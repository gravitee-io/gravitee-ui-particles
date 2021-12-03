const path = require('path');

module.exports = {
  framework: '@storybook/angular',
  stories: ['../projects/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-essentials', path.resolve(__dirname + '/addon-angular-docs/preset.js')],
  features: {
    previewCsfV3: true,
    storyStoreV7: true,
  },
  angularOptions: {
    enableIvy: true,
  },
  core: {
    builder: 'webpack5',
  },
  previewHead: (head: unknown) =>
    `${head}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`,
};
