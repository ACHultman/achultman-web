const { spawn, execFileSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');

// Loopback-only TLS lets WebKit exercise the production upgrade-insecure-requests CSP.
const directory = mkdtempSync(path.join(tmpdir(), 'hultman-preview-'));
const key = path.join(directory, 'key.pem');
const cert = path.join(directory, 'cert.pem');
execFileSync(
    'openssl',
    [
        'req',
        '-x509',
        '-newkey',
        'rsa:2048',
        '-nodes',
        '-keyout',
        key,
        '-out',
        cert,
        '-days',
        '1',
        '-subj',
        '/CN=localhost',
    ],
    { stdio: 'ignore' }
);
const child = spawn(
    process.execPath,
    [
        require.resolve('next/dist/bin/next'),
        'start',
        '--hostname',
        '127.0.0.1',
        '--port',
        '3444',
    ],
    {
        stdio: 'inherit',
        env: { ...process.env, NOTION_PREVIEW_MODE: 'true' },
    }
);
const server = https.createServer(
    { key: readFileSync(key), cert: readFileSync(cert) },
    (request, response) => {
        const upstream = http.request(
            {
                hostname: '127.0.0.1',
                port: 3444,
                path: request.url,
                method: request.method,
                headers: request.headers,
            },
            (result) => {
                response.writeHead(result.statusCode || 502, result.headers);
                result.pipe(response);
            }
        );
        upstream.on('error', () => {
            response.writeHead(503);
            response.end('Preview is starting');
        });
        request.on('aborted', () => upstream.destroy());
        request.pipe(upstream);
    }
);
server.listen(3443, '127.0.0.1');
let stopping = false;
function stop(code = 0) {
    if (stopping) return;
    stopping = true;
    child.kill('SIGTERM');
    server.close();
    server.closeAllConnections();
    rmSync(directory, { recursive: true });
    process.exitCode = code;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
child.on('exit', (code) => stop(code || 0));
server.on('error', (error) => {
    console.error(error.message);
    stop(1);
});
