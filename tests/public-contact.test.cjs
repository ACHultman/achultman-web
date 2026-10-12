const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');

test('tracked source and documents do not publish the owner’s email address', () => {
    const files = execFileSync(
        'git',
        ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        { encoding: 'utf8' }
    )
        .split('\0')
        .filter(Boolean);
    for (const file of files) {
        if (!/\.(?:tsx?|[cm]?js|json|md|txt|html|xml|svg|css)$/.test(file))
            continue;
        assert.doesNotMatch(
            readFileSync(file, 'utf8'),
            /[a-z0-9._%+-]+@hultman\.dev\b/i,
            file
        );
    }
});

test('the downloadable resume links to the contact form without a mailto annotation', () => {
    const pdf = readFileSync('public/adam-hultman-resume.pdf').toString(
        'latin1'
    );
    assert.match(pdf, /\/URI \(https:\/\/hultman\.dev\/contact\)/);
    assert.doesNotMatch(pdf, /mailto:|[a-z0-9._%+-]+@hultman\.dev\b/i);
});
