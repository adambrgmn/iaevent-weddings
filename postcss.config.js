/* eslint-disable global-require */

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')(require.resolve('./tailwind.config.js')),
    require('postcss-preset-env')({ stage: 3 }),
    isProd &&
      require('@fullhuman/postcss-purgecss')({
        content: ['**/*.html', 'assets/**/*.ts'],
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      }),
  ].filter(Boolean),
};
