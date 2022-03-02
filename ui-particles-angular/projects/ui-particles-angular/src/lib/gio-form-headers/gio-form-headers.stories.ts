/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Meta, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GioFormHeadersComponent } from './gio-form-headers.component';
import { GioFormHeadersModule } from './gio-form-headers.module';

export default {
  title: 'Components / Form Headers',
  component: GioFormHeadersComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, GioFormHeadersModule, FormsModule, ReactiveFormsModule],
    }),
  ],
  argTypes: {},
  render: args => ({
    template: `<gio-form-headers [ngModel]="headers"></gio-form-headers>`,
    props: args,
  }),
  args: {
    headers: [],
  },
} as Meta;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
  },
};

export const ReactiveForm: Story = {
  render: args => {
    const headersControl = new FormControl({
      value: args.headers,
      disabled: args.disabled,
    });

    headersControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `<gio-form-headers [formControl]="headersControl"></gio-form-headers>`,
      props: {
        headersControl,
      },
    };
  },
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
    disabled: false,
  },
};
