import { defineConfig } from 'oxlint';

const config = defineConfig({
  plugins: ['eslint', 'import', 'typescript', 'react'],
  options: {
    typeAware: true,
    typeCheck: true,
  },
});

export default config;
