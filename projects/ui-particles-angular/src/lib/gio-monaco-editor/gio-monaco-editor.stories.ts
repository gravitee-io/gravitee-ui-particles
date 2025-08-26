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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { importProvidersFrom } from '@angular/core';

import GioJsonSchema from '../gio-form-json-schema/model/GioJsonSchema.json';

import ElSchema from './data/el-schema.json';
import { GioMonacoEditorComponent } from './gio-monaco-editor.component';
import { GioMonacoEditorModule } from './gio-monaco-editor.module';

export default {
  title: 'Components / Monaco editor',
  component: GioMonacoEditorComponent,
  decorators: [
    moduleMetadata({
      imports: [GioMonacoEditorModule, ReactiveFormsModule, MatFormFieldModule],
    }),
    applicationConfig({
      providers: [importProvidersFrom(GioMonacoEditorModule.forRoot({ theme: 'vs-dark', baseUrl: '.' }))],
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
    disableMiniMap: {
      control: { type: 'boolean' },
    },
    disableAutoFormat: {
      control: { type: 'boolean' },
    },
    singleLineMode: {
      control: { type: 'boolean' },
    },
  },
  render: ({ value, disabled, languageConfig, disableMiniMap, disableAutoFormat, singleLineMode }) => {
    const control = new UntypedFormControl({ value, disabled });
    control.valueChanges.subscribe(value => {
      action('valueChanges')(value);
    });
    control.statusChanges.subscribe(status => {
      action('statusChanges')(status);
    });
    return {
      template: `
      <gio-monaco-editor [formControl]="control" [languageConfig]="languageConfig" [disableMiniMap]="disableMiniMap" [singleLineMode]="singleLineMode" [disableAutoFormat]="disableAutoFormat"></gio-monaco-editor>
      <br>
      <pre>{{ control.status }}</pre>
      <pre>{{ control.dirty ? 'DIRTY' : 'PRISTINE' }}</pre>
      <pre>{{ control.touched ? 'TOUCHED' : 'UNTOUCHED' }}</pre>
      <pre>{{ control.value?.length < 1000 ? (control.value | json) : '...TL;TR...' }}</pre>
      `,
      props: {
        control,
        languageConfig,
        disableMiniMap,
        disableAutoFormat,
        singleLineMode,
      },
    };
  },
} as Meta;

export const Default: StoryObj = {
  args: {},
};

export const Disabled: StoryObj = {
  args: {
    disabled: true,
  },
};

export const WithValue: StoryObj = {
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

export const InsideMatFormField: StoryObj = {
  render: ({ value, disabled, languageConfig }) => {
    const control = new UntypedFormControl({ value, disabled }, Validators.required);
    control.valueChanges.subscribe(value => {
      action('valueChanges')(value);
    });
    control.statusChanges.subscribe(status => {
      action('statusChanges')(status);
    });

    return {
      template: `
      <mat-form-field style="width:100%;">
        <mat-label>Monaco editor</mat-label>
        <gio-monaco-editor gioMonacoEditorFormField [formControl]="control" [languageConfig]="languageConfig"></gio-monaco-editor>
        <mat-error *ngIf="control.hasError('required')">This field is required</mat-error>
      </mat-form-field>
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
  args: {},
};

export const FormControlName: StoryObj = {
  render: ({ value, disabled, languageConfig }) => {
    const control = new UntypedFormControl({ value, disabled }, Validators.required);
    control.valueChanges.subscribe(value => {
      action('valueChanges')(value);
    });
    control.statusChanges.subscribe(status => {
      action('statusChanges')(status);
    });
    const from = new UntypedFormGroup({ control });

    return {
      template: `
      <mat-form-field style="width:100%;" [formGroup]="from">
        <mat-label>Monaco editor</mat-label>
        <gio-monaco-editor gioMonacoEditorFormField formControlName="control" [languageConfig]="languageConfig"></gio-monaco-editor>
        <mat-error *ngIf="from.get('control').hasError('required')">This field is required</mat-error>
      </mat-form-field>
      <br>
      <pre>{{ from.status }}</pre>
      <pre>{{ from.dirty ? 'DIRTY' : 'PRISTINE' }}</pre>
      <pre>{{ from.touched ? 'TOUCHED' : 'UNTOUCHED' }}</pre>
      <pre>{{ from.get('control').value?.length < 1000 ? (from.get('control').value | json) : '...TL;TR...' }}</pre>
      `,
      props: {
        from,
        languageConfig,
      },
    };
  },
  args: {},
};

export const SingleLineMode: StoryObj = {
  render: ({ value, disabled, languageConfig }) => {
    const control = new UntypedFormControl({ value, disabled }, Validators.required);
    control.valueChanges.subscribe(value => {
      action('valueChanges')(value);
    });
    control.statusChanges.subscribe(status => {
      action('statusChanges')(status);
    });
    const from = new UntypedFormGroup({ control });

    return {
      template: `
      <mat-form-field style="width:100%;" [formGroup]="from">
        <mat-label>Monaco editor</mat-label>
        <gio-monaco-editor gioMonacoEditorFormField formControlName="control" [languageConfig]="languageConfig" [singleLineMode]="singleLineMode"></gio-monaco-editor>
        <mat-error *ngIf="from.get('control').hasError('required')">This field is required</mat-error>
      </mat-form-field>
      <br>
      <pre>{{ from.status }}</pre>
      <pre>{{ from.dirty ? 'DIRTY' : 'PRISTINE' }}</pre>
      <pre>{{ from.touched ? 'TOUCHED' : 'UNTOUCHED' }}</pre>
      <pre>{{ from.get('control').value?.length < 1000 ? (from.get('control').value | json) : '...TL;TR...' }}</pre>
      `,
      props: {
        from,
        languageConfig,
        singleLineMode: true,
      },
    };
  },
  args: {
    singleLineMode: true,
  },
};

export const LanguageAutoDetectJSON: StoryObj = {
  args: {
    value: `{
      "type": "object",
      "properties": { "firstName": { "type": "string" } }
    }`,
  },
};

export const LanguageJson: StoryObj = {
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

export const LanguageCss: StoryObj = {
  args: {
    languageConfig: {
      language: 'css',
    },
    value: `.style {
  border: 1px solid black;
}`,
  },
};

export const LanguageEL: StoryObj = {
  args: {
    languageConfig: {
      language: 'spel',
      schema: ElSchema,
    },
    value: `{#request.headers['x-story'] == 'true'}`,
  },
};

export const LanguageJsonAutoFormat: StoryObj = {
  args: {
    languageConfig: {
      language: 'json',
    },
    value: `{
      "type": "object",
      "properties": { "firstName": { "type": "string" } }
    }`,
  },
};

export const LanguageJsonDisableAutoFormat: StoryObj = {
  args: {
    languageConfig: {
      language: 'json',
    },
    disableAutoFormat: true,
    value: `{
      "type": "object",
      "properties": { "firstName": { "type": "string" } }
    }`,
  },
};

export const LanguageJsonWithSchemaValidation: StoryObj = {
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
    value: `{
      "type": "object",
      "properties": { "firstName": { "type": "string" } }
    }`,
  },
};

export const LanguageYaml: StoryObj = {
  args: {
    languageConfig: {
      language: 'yaml',
    },
    value: `openapi: 3.0.0
info:
  title: Sample API`,
  },
};

export const LanguageMarkdown: StoryObj = {
  args: {
    languageConfig: {
      language: 'markdown',
    },
    value: `# Header 1 #
## Header 2 ##
### Header 3 ###             (Hashes on right are optional)
## Markdown plus h2 with a custom ID ##   {#id-goes-here}
[Link back to H2](#id-goes-here)
`,
    disableMiniMap: true,
  },
};

export const LanguageHTML: StoryObj = {
  args: {
    languageConfig: {
      language: 'html',
    },
    value: `<html>
  <body style="text-align: center;">
    <header>
      <#include "header.html" />
    </header>
    <div style="margin-top: 50px; color: #424e5a;">
      <h3>Hi,</h3>
      <p>
        The API <b><code>{api.name}</code></b> was updated by {user.displayName}.
      </p>
    </div>
  </body>
</html>`,
    disableMiniMap: true,
  },
};

export const DisableMiniMap: StoryObj = {
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
    value: `{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
  },
    }`,
    disableMiniMap: true,
  },
};

export const DisabledWithCopy: StoryObj = {
  render: ({ value }) => {
    const options = {
      readOnly: true,
      renderLineHighlight: 'none',
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: false,
      overviewRulerBorder: false,
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        useShadows: false,
      },
    };

    return {
      styles: [
        `
            .editor {
                border: 1px solid grey;
                border-radius: 4px;
                height: 180px;
                overflow: hidden;
            }
            
            .container {
                width: 60%;
            }
        `,
      ],
      template: `
                <div gioMonacoClipboardCopy class="container">
                  <gio-monaco-editor
                    class="editor"
                    [value]="value"
                    [options]="options"
                    [disableMiniMap]="true"
                  >
                  </gio-monaco-editor>
                </div>
            `,
      props: { options, value },
    };
  },
  args: {
    value: `
        {
          "headers": {
            "Host": "api.gravitee.io",
            "foo": "bar",
            "User-Agent": "Gravitee.io/4.6.15-SNAPSHOT"
          },
          "query_params": {},
          "bodySize": 0
        }`,
  },
};
