import { defineConfig } from 'oxlint';
import native from 'oxlint-config-universe/native';
import tsAnalysis from 'oxlint-config-universe/typescript-analysis';

const config = defineConfig({
  extends: [native, tsAnalysis],
});

export default config;
