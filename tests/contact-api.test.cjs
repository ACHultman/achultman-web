const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the real route with a fake SMTP boundary. These tests cannot send mail.
const code = ts.transpileModule(
    readFileSync('src/pages/api/v1/contact.ts', 'utf8'),
    {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
            esModuleInterop: true,
        },
    }
).outputText;

function setup({
    accepted = true,
    mailError = false,
    telemetryError = false,
    configured = true,
    limitStatus = 200,
} = {}) {
    const mail = [],
        events = [];
    const testModule = { exports: {} };
    vm.runInNewContext(code, {
        module: testModule,
        exports: testModule.exports,
        process: {
            env: configured
                ? {
                      NEXT_PUBLIC_EMAIL: 'owner@example.com',
                      EMAIL_PASS: 'test-only',
                  }
                : {},
        },
        console: { error() {} },
        require(name) {
            if (name.endsWith('rate-limit'))
                return {
                    checkRateLimit: async () => ({
                        status: limitStatus,
                        headers: {},
                    }),
                };
            if (name === 'nodemailer')
                return {
                    createTransport: () => ({
                        sendMail: async (options) => {
                            mail.push(options);
                            if (mailError) throw new Error('Provider failed');
                            return {
                                accepted: accepted ? ['owner@example.com'] : [],
                            };
                        },
                    }),
                };
            if (name.endsWith('posthog-server'))
                return {
                    getPostHogClient: () => {
                        if (telemetryError)
                            throw new Error('Telemetry unavailable');
                        return { capture: (event) => events.push(event) };
                    },
                };
            return require(name);
        },
    });
    const response = {
        code: 0,
        headers: {},
        body: undefined,
        setHeader(name, value) {
            this.headers[name] = value;
        },
        status(code) {
            this.code = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
    return {
        handler: (request, response) =>
            testModule.exports.default(
                { headers: { 'content-type': 'application/json' }, ...request },
                response
            ),
        response,
        mail,
        events,
    };
}
const valid = {
    name: 'Taylor <script>\r\nInjected',
    email: 'taylor@example.com',
    message: '<img src=x onerror=alert(1)>\nHello',
    website: '',
};

test('valid message reaches SMTP, is escaped, and confirms acceptance without personal analytics data', async () => {
    const s = setup();
    await s.handler({ method: 'POST', body: valid }, s.response);
    assert.equal(s.response.code, 200);
    assert.equal(s.response.body.success, true);
    assert.equal(s.mail.length, 1);
    assert.equal(s.mail[0].replyTo, valid.email);
    assert.ok(s.mail[0].html.includes('&lt;img'));
    assert.ok(!s.mail[0].subject.includes('\n'));
    const analytics = JSON.stringify(s.events);
    for (const value of [valid.name, valid.email, valid.message])
        assert.ok(!analytics.includes(value));
    assert.equal(s.response.headers['Cache-Control'], 'no-store');
});

test('analytics failure cannot reverse a delivered submission', async () => {
    const s = setup({ telemetryError: true });
    await s.handler({ method: 'POST', body: valid }, s.response);
    assert.equal(s.response.code, 200);
    assert.equal(s.mail.length, 1);
});

test('provider failure or rejection never reports success', async () => {
    for (const options of [{ mailError: true }, { accepted: false }]) {
        const s = setup(options);
        await s.handler({ method: 'POST', body: valid }, s.response);
        assert.equal(s.response.code, 502);
        assert.notEqual(s.response.body.success, true);
    }
});

test('malformed, oversized, empty, and honeypot submissions never reach SMTP', async () => {
    for (const body of [
        undefined,
        {},
        { ...valid, name: ' ' },
        { ...valid, email: 'bad' },
        { ...valid, message: ' ' },
        { ...valid, message: 'x'.repeat(4501) },
        { ...valid, website: 'spam.example' },
    ]) {
        const s = setup();
        await s.handler({ method: 'POST', body }, s.response);
        assert.equal(s.response.code, 400);
        assert.equal(s.mail.length, 0);
    }
});

test('missing configuration and unsupported methods fail before SMTP', async () => {
    const s = setup({ configured: false });
    await s.handler({ method: 'POST', body: valid }, s.response);
    assert.equal(s.response.code, 503);
    assert.equal(s.mail.length, 0);
    await s.handler({ method: 'GET' }, s.response);
    assert.equal(s.response.code, 405);
    assert.equal(s.mail.length, 0);
});

test('limiter rejection, timeout, and unsupported media types never reach SMTP', async () => {
    for (const limitStatus of [429, 503]) {
        const s = setup({ limitStatus });
        await s.handler({ method: 'POST', body: valid }, s.response);
        assert.equal(s.response.code, limitStatus);
        assert.equal(s.mail.length, 0);
    }
    for (const type of [
        undefined,
        'text/plain',
        'application/x-www-form-urlencoded',
    ]) {
        const s = setup();
        await s.handler(
            { method: 'POST', headers: { 'content-type': type }, body: valid },
            s.response
        );
        assert.equal(s.response.code, 415);
        assert.equal(s.mail.length, 0);
    }
});
