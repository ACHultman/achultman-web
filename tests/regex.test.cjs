const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./helpers/load.cjs');
const { evaluateRegex } = load('src/lib/tools/regex.ts');
const evaluate = (pattern, text, flags = 'g') =>
    JSON.parse(JSON.stringify(evaluateRegex({ pattern, text, flags })));

test('regex tester follows native JavaScript matching, including backtracking and captures', () => {
    for (const [pattern, text, expected] of [
        ['a+a', 'aa', 'aa'],
        ['a{2}', 'aa', 'aa'],
        ['a|b', 'b', 'b'],
        ['[\\d]', '4', '4'],
        ['a?ab', 'ab', 'ab'],
        ['.*@.*\\.com', 'user@email.com', 'user@email.com'],
    ])
        assert.equal(evaluate(pattern, text).matches[0].text, expected);
    assert.deepEqual(evaluate('(a)(b)?', 'a').matches[0].groups, ['a', null]);
    assert.equal(evaluate('a', 'aa', '').matches.length, 1);
    assert.equal(evaluate('a', 'A', 'i').matches[0].text, 'A');
});

test('regex tester terminates empty-match iteration and preserves UTF-16 indices', () => {
    assert.deepEqual(
        evaluate('(?:)', '🧠', 'gu').matches.map((m) => m.index),
        [0, 2]
    );
    assert.equal(evaluate('(?:)', 'aa').matches.length, 3);
});

test('regex tester bounds input and output and reports syntax errors', () => {
    assert.ok(evaluate('[', '').error);
    assert.ok(evaluate('a', 'a', 'gg').error);
    assert.ok(evaluate('a', 'a', 'z').error);
    assert.ok(evaluate('a'.repeat(501), '').error);
    assert.ok(evaluate('a', 'a'.repeat(10001)).error);
    assert.equal(evaluate('a', 'a'.repeat(101)).matches.length, 100);
    assert.equal(evaluate('a', 'a'.repeat(101)).truncated, true);
    assert.equal(evaluate('a', 'a'.repeat(100)).truncated, false);
    assert.equal(
        evaluate('((a+))', 'a'.repeat(1000)).matches[0].groups[0].length,
        501
    );
});
