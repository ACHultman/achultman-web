const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

module.exports = function load(file, mocks = {}, globals = {}) {
    const result = { exports: {} };
    const source = ts.transpileModule(readFileSync(file, 'utf8'), {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
            jsx: ts.JsxEmit.ReactJSX,
        },
    }).outputText;
    vm.runInNewContext(
        source,
        {
            URL,
            TextEncoder,
            console,
            setTimeout,
            clearTimeout,
            process: { env: { NODE_ENV: 'production' } },
            ...globals,
            module: result,
            exports: result.exports,
            require(name) {
                if (name in mocks) return mocks[name];
                if (name.startsWith('.')) {
                    const base = path.resolve(path.dirname(file), name);
                    const resolved = [
                        base,
                        base + '.ts',
                        base + '.tsx',
                        base + '/index.tsx',
                    ].find(
                        (f) =>
                            existsSync(f) &&
                            !require('node:fs').statSync(f).isDirectory()
                    );
                    return load(resolved, mocks, globals);
                }
                return require(name);
            },
        },
        { filename: file }
    );
    return result.exports;
};
