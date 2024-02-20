import { dirname, join } from 'path';
module.exports = {
  framework: getAbsolutePath('@storybook/angular'),
  stories: ['../projects/**/*.stories.@(ts|mdx)'],

  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-designs'),
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
    {
      name: '@storybook/addon-docs',
      options: { transcludeMarkdown: true },
    },
    getAbsolutePath('@storybook/addon-mdx-gfm'),
  ],

  features: {
    previewCsfV3: true,
    storyStoreV7: true,
  },

  angularOptions: {
    enableIvy: true,
  },

  staticDirs: [
    { from: '../../node_modules/@gravitee/ui-components/assets', to: '/' },
    { from: './favicon.ico', to: '/favicon.ico' },
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

  docs: {
    autodocs: false,
  },
};

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
