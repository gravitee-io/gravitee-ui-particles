module.exports = {
  framework: '@storybook/angular',
  stories: ['../projects/**/*.stories.@(ts|mdx)'],
  addons: [
    'storybook-addon-designs',
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
  staticDirs: [
    { from: '../../node_modules/@gravitee/ui-components/assets', to: '/' },
    { from: '../projects/ui-particles-angular/assets', to: '/assets' },
  ],
};
