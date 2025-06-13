import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/coverage/',
    '**/*.config.js',
    '**/*.config.ts',
    '**/generated-api/',
    '**/temp.js',
    'config/*',
  ]),
  {
    extends: fixupConfigRules(compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    )),
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      indent: ['error', 2, {
        SwitchCase: 1,
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild'
        ],
        flatTernaryExpressions: false
      }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      quotes: ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      'jsx-quotes': ['error', 'prefer-single'],
      'object-curly-spacing': ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      semi: ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [{
          pattern: '**/*.css',
          group: 'internal',
          position: 'before',
        }],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      }],
    },
  }
]);