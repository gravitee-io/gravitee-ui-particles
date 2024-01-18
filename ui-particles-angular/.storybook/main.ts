module.exports = {
  framework: '@storybook/angular',
  stories: ['../projects/**/*.stories.@(ts|mdx)'],
  addons: [
    '@storybook/addon-a11y',
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
    { from: './ui-particles.ico', to: '/ui-particles.ico' },
    { from: '../projects/ui-particles-angular/assets/gio-icons.svg', to: '/assets/gio-icons.svg' },
    {
      from: '../projects/ui-particles-angular/assets/license-expiration-notification-background.svg',
      to: '/assets/license-expiration-notification-background.svg',
    },
    { from: './images/audit-trail.svg', to: '/images/audit-trail.svg' },
    { from: '../../node_modules/monaco-editor', to: '/assets/monaco-editor' },
    { from: '../../node_modules/@asciidoctor/core/dist/browser/asciidoctor.min.js', to: '/assets/asciidoctor/asciidoctor.js' },
    { from: '../../node_modules/prismjs/prism.js', to: '/assets/prismjs/prism.js' },
    { from: '../../node_modules/prismjs/components/prism-json.js', to: '/assets/prismjs/components/prism-json.js' },
  ],
};
