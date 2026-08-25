import { defineConfig } from 'oxfmt';

const config = defineConfig({
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  jsxSingleQuote: true,
  endOfLine: 'lf',
  sortImports: {
    groups: [
      'value-builtin',
      'value-external',
      'value-internal',
      ['value-parent', 'value-sibling', 'value-index'],
      { newlinesBetween: true },
      'type-import',
    ],
    newlinesBetween: true,
  },
});

export default config;
