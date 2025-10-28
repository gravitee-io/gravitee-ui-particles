import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/angular',
    options: {},
  },

  stories: ['../projects/**/*.@(mdx|stories.@(ts))'],

  addons: ['@storybook/addon-a11y', '@storybook/addon-designs', '@storybook/addon-docs'],

  staticDirs: [
    { from: './favicon.ico', to: 'favicon.svg' },
    { from: '../projects/ui-particles-angular/assets/gio-icons.svg', to: '/assets/gio-icons.svg' },
    {
      from: '../projects/ui-particles-angular/assets/license-expiration-notification-background.svg',
      to: '/assets/license-expiration-notification-background.svg',
    },
    { from: './images/audit-trail.svg', to: '/images/audit-trail.svg' },
    { from: '../node_modules/monaco-editor', to: '/assets/monaco-editor' },
    { from: '../node_modules/@asciidoctor/core/dist/browser/asciidoctor.min.js', to: '/assets/asciidoctor/asciidoctor.js' },
    { from: '../node_modules/prismjs/prism.js', to: '/assets/prismjs/prism.js' },
    { from: '../node_modules/prismjs/components/prism-json.js', to: '/assets/prismjs/components/prism-json.js' },
  ],
};
export default config;
