const { mergeConfig } = require('vite');

module.exports = {
  stories: ['../src/stories/*.stories.mdx', '../src/stories/*.stories.js'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: (await import('../vite.config.js')).default.resolve,
    });
  },
};