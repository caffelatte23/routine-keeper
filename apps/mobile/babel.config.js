module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Drizzle ORM ships migrations as .sql files that must be inlined into the bundle.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
