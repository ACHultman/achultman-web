const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const testModule = { exports: {} };
vm.runInNewContext(
    ts.transpileModule(readFileSync('src/utils/workflowEconomics.ts', 'utf8'), {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020,
        },
    }).outputText,
    { module: testModule, exports: testModule.exports }
);
const { calculateWorkflowEconomics: calculate } = testModule.exports;
const close = (actual, expected) =>
    assert.ok(
        Math.abs(actual - expected) < 1e-8,
        `${actual} should be close to ${expected}`
    );
const example = {
    people: 2,
    weeklyHours: 5,
    hourlyCost: 60,
    timeReturnedPercent: 50,
    implementationCost: 6000,
    monthlyOperatingCost: 100,
};

test('published example includes upfront and recurring costs over twelve months', () => {
    const result = calculate(example);
    assert.ok(Math.abs(result.monthlyHoursSaved - 21.6666666667) < 1e-8);
    close(result.monthlyCapacityReturned, 1300);
    close(result.monthlyNetValue, 1200);
    close(result.firstYearCost, 7200);
    close(result.firstYearNetValue, 8400);
    assert.ok(Math.abs(result.firstYearRoiPercent - 116.6666666667) < 1e-8);
    close(result.paybackMonths, 5);
});

test('operating costs can remove payback despite positive time savings', () => {
    for (const monthlyOperatingCost of [1300, 1500]) {
        const result = calculate({ ...example, monthlyOperatingCost });
        assert.equal(result.paybackMonths, null);
        assert.ok(result.firstYearNetValue < 0);
        assert.ok(result.firstYearRoiPercent < 0);
    }
});

test('zero savings and zero costs do not generate infinite or invented returns', () => {
    const noSavings = calculate({ ...example, timeReturnedPercent: 0 });
    assert.equal(noSavings.firstYearRoiPercent, -100);
    assert.equal(noSavings.paybackMonths, null);
    const free = calculate({
        ...example,
        implementationCost: 0,
        monthlyOperatingCost: 0,
    });
    assert.equal(free.firstYearRoiPercent, null);
    assert.equal(free.paybackMonths, 0);
    close(free.firstYearNetValue, 15600);
});

test('a project can pay back eventually while losing value in the first year', () => {
    const result = calculate({ ...example, implementationCost: 24000 });
    close(result.paybackMonths, 20);
    close(result.firstYearNetValue, -9600);
    assert.ok(result.firstYearRoiPercent < 0);
});

test('rejects non-finite, out-of-range, and fractional-person inputs', () => {
    for (const key of Object.keys(example)) {
        for (const value of [NaN, Infinity, -Infinity, -1]) {
            assert.equal(
                calculate({ ...example, [key]: value }),
                null,
                `${key}: ${value}`
            );
        }
    }
    for (const invalid of [
        { people: 1.5 },
        { people: 0 },
        { people: 101 },
        { weeklyHours: 0 },
        { weeklyHours: 81 },
        { hourlyCost: 0 },
        { hourlyCost: 1001 },
        { timeReturnedPercent: 101 },
        { implementationCost: 1_000_001 },
        { monthlyOperatingCost: 100_001 },
    ]) {
        assert.equal(calculate({ ...example, ...invalid }), null);
    }
});
