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
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import GioJsonSchema from '../gio-form-json-schema/model/GioJsonSchema.json';

import { GioMonacoEditorComponent } from './gio-monaco-editor.component';
import { GioMonacoEditorModule } from './gio-monaco-editor.module';

export default {
  title: 'Components / Monaco editor',
  component: GioMonacoEditorComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, GioMonacoEditorModule, ReactiveFormsModule],
    }),
  ],
  parameters: {
    a11y: {
      // Disable to avoid freeze with monaco editor
      disable: true,
    },
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    languageConfig: {
      control: { type: 'object' },
    },
    value: {
      control: { type: 'object' },
    },
  },
  render: ({ value, disabled, languageConfig }) => {
    const control = new FormControl({ value, disabled });
    control.valueChanges.subscribe(value => {
      action('valueChanges')(value);
    });
    control.statusChanges.subscribe(status => {
      action('statusChanges')(status);
    });
    return {
      template: `
      <gio-monaco-editor [formControl]="control" [languageConfig]="languageConfig"></gio-monaco-editor>
      <br>
      <pre>{{ control.status }}</pre>
      <pre>{{ control.dirty ? 'DIRTY' : 'PRISTINE' }}</pre>
      <pre>{{ control.touched ? 'TOUCHED' : 'UNTOUCHED' }}</pre>
      <pre>{{ control.value?.length < 1000 ? (control.value | json) : '...TL;TR...' }}</pre>
      `,
      props: {
        control,
        languageConfig,
      },
    };
  },
} as Meta;

export const Default: Story = {
  args: {},
};

export const LanguageJson: Story = {
  args: {
    languageConfig: {
      language: 'json',
      schemas: [
        {
          uri: 'http://myserver/foo-schema.json',
          schema: GioJsonSchema,
        },
      ],
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: `{
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string"
        },
      },
    }`,
  },
};
