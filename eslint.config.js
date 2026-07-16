const eslint = require('@eslint/js')
const tseslintPlugin = require('@typescript-eslint/eslint-plugin')
const tseslintParser = require('@typescript-eslint/parser')
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended')
const globals = require('globals')

module.exports = [
  {
    ignores: ['coverage/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  {
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  eslintPluginPrettier,
]
