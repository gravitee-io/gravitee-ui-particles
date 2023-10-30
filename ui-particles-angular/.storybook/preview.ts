// Set material classes to the Storybook body
import { moduleMetadata } from '@storybook/angular';
import { GioMatConfigModule } from '../projects/ui-particles-angular/src/lib/gio-mat-config';

window.document.body?.classList.add('mat-app-background');
window.document.body?.classList.add('mat-typography');

export const parameters = {
  docs: {
    inlineStories: true,
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['README', 'Theme', 'OEM Theme', 'Guidelines'],
      includeName: true,
    },
  },
  backgrounds: {
    default: 'default',
    values: [
      {
        name: 'default',
        value: 'transparent',
      },
      {
        name: 'white',
        value: 'white',
      },
    ],
  },
};

export const decorators = [moduleMetadata({ imports: [GioMatConfigModule] })];
