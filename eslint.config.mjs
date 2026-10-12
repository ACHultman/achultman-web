import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
    ...nextVitals,
    ...nextTypescript,
    prettier,
    globalIgnores([
        '.next/**',
        'out/**',
        'next-env.d.ts',
        'test-results/**',
        '.lighthouseci/**',
        '.vercel/**',
        'growth/**', // Private workspace, already excluded from Git.
    ]),
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            'no-console': ['error', { allow: ['warn', 'error'] }],
        },
    },
    {
        files: ['**/*.cjs', '.lighthouserc.js', '.pa11yci.js'],
        rules: { '@typescript-eslint/no-require-imports': 'off' },
    },
]);
