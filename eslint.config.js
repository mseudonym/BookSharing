import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
  { ignores: ['dist', 'src/generated-api'] },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  stylistic.configs.customize({
    flat: true,
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
  }),
];
