/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  rules: {
    'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'pathGroups': [
        {
          'pattern': '**/*.css',
          'group': 'internal',
          'position': 'before'
        }
      ],
      'pathGroupsExcludedImportTypes': ['react'],
      'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
    }]
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 