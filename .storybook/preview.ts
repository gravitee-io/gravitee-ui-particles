// Set material classes to the Storybook body
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { GioMatConfigModule } from '../projects/ui-particles-angular/src/lib/gio-mat-config';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

window.document.body?.classList.add('mat-app-background');
window.document.body?.classList.add('mat-typography');

export const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['README', 'Theme', 'OEM Theme', 'Guidelines'],
      includeName: true,
    },
  },
  backgrounds: {
    options: {
      default: {
        name: 'default',
        value: 'transparent',
      },

      white: {
        name: 'white',
        value: 'white',
      },
    },
  },
};

export const decorators = [
  moduleMetadata({ imports: [GioMatConfigModule] }),
  applicationConfig({
    providers: [importProvidersFrom(BrowserAnimationsModule), importProvidersFrom(HttpClientModule)],
  }),
];

export const initialGlobals = {
  backgrounds: {
    value: 'default',
  },
};
