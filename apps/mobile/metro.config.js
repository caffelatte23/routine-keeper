// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Drizzle ORM: resolve generated .sql migration files as source.
config.resolver.sourceExts.push('sql');
// expo-sqlite web ships its sqlite engine as .wasm.
config.resolver.assetExts.push('wasm');

module.exports = config;
