module.exports = {
  framework: '@storybook/angular',
  stories: ['../projects/**/*.stories.@(ts|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-docs',
      options: { transcludeMarkdown: true },
    },
  ],
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
  staticDirs: [{ from: '../../node_modules/@gravitee/ui-components/assets', to: '/' }],
  previewHead: (head: unknown) =>
    `${head}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`,
};
