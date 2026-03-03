const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsparser,
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            'no-console': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
