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
import isChromatic from 'chromatic/isChromatic';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { importProvidersFrom, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { GioMonacoEditorModule } from '../gio-monaco-editor/gio-monaco-editor.module';
import { GioFormFocusInvalidModule } from '../gio-form-focus-first-invalid/gio-form-focus-first-invalid.module';

import { DemoComponent } from './gio-form-json-schema.stories.component';
import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';
import { integerExample } from './json-schema-example/integer';
import { stringExample } from './json-schema-example/string';
import { mixedExample } from './json-schema-example/mixed';
import { oneOfExample } from './json-schema-example/oneOf';
import { oneOfNestedGioConfigDisableExample } from './json-schema-example/oneOfNestedGioConfigDisable';
import { entrypointsGetResponse, getEntrypointConnectorSchema } from './json-schema-example/entrypoints';
import { endpointsGetResponse, getEndpointConnectorSchema } from './json-schema-example/endpoints';
import { enumExample } from './json-schema-example/enum';
import { referencesExample } from './json-schema-example/references';
import { allOfExample } from './json-schema-example/allOf';
import { booleanExample } from './json-schema-example/boolean';
import { arrayExample } from './json-schema-example/array';
import { kafkaAdvancedExample } from './json-schema-example/kafka-advanced';
import { mqttAdvancedExample } from './json-schema-example/mqtt-advanced';
import { httpProxyExample } from './json-schema-example/http-proxy';
import { webhookAdvancedExample } from './json-schema-example/webhook-advanced';
import { codeEditorExample } from './json-schema-example/code-editor';
import { displayIfExample } from './json-schema-example/displayIf';
import { disableIfExample } from './json-schema-example/disableIf';
import { uiBorderExample } from './json-schema-example/uiBorder';

@NgModule({
  declarations: [DemoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    GioFormJsonSchemaModule,
    GioFormFocusInvalidModule,
    MatButtonModule,
    MatButtonToggleModule,
    GioFormJsonSchemaModule,
    GioMonacoEditorModule,
  ],
  exports: [DemoComponent, GioFormJsonSchemaModule],
})
export class GioFJSStoryModule {}

export default {
  title: 'Components / Form Json schema',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatSelectModule, GioFJSStoryModule],
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
  render: ({ jsonSchema, initialValue, disabled, context }) => ({
    template: `<gio-demo 
                    [jsonSchema]="jsonSchema" 
                    [initialValue]="initialValue"
                    [isChromatic]="isChromatic()" 
                    [disabled]="disabled"
                    [context]="context"
                ></gio-demo>`,
    props: { jsonSchema, initialValue, isChromatic, disabled, context },
  }),
} as Meta;

export const StringDisabled: StoryObj = {
  name: 'Disabled',
  args: {
    jsonSchema: stringExample,
    disabled: true,
  },
};

export const String: StoryObj = {
  args: {
    jsonSchema: stringExample,
  },
};

export const Number: StoryObj = {
  args: {
    jsonSchema: integerExample,
  },
};

export const Boolean: StoryObj = {
  args: {
    jsonSchema: booleanExample,
  },
};

export const Array: StoryObj = {
  args: {
    jsonSchema: arrayExample,
  },
};

export const Mixed: StoryObj = {
  args: {
    jsonSchema: mixedExample,
  },
};

export const MixedWithValue: StoryObj = {
  name: 'Mixed with value',
  args: {
    jsonSchema: mixedExample,
    initialValue: {
      body: '<xml></xml>',
    },
  },
};

export const WithBanner: StoryObj = {
  name: 'With banner',
  args: {
    jsonSchema: {
      type: 'object',
      properties: {
        sample: {
          title: 'Sample property',
          description: 'Additional hint',
          type: 'string',
          gioConfig: {
            banner: {
              title: 'Complex property',
              text: 'This is a quite long description of what the field is, that would not fit into the hint field',
            },
          },
        },
      },
    },
    initialValue: { sample: 'sample value' },
  },
};

export const WithDisplayIf: StoryObj = {
  name: 'With displayIf',
  args: {
    jsonSchema: displayIfExample,
    context: { currentUser: 'foo' },
  },
};

export const WithDisableIf: StoryObj = {
  name: 'With disableIf',
  args: {
    jsonSchema: disableIfExample,
    context: { currentUser: 'foo' },
  },
};

export const WithUiBorder: StoryObj = {
  name: 'With uiBorder',
  args: {
    jsonSchema: uiBorderExample,
  },
};

export const OneOf: StoryObj = {
  args: {
    jsonSchema: oneOfExample,
  },
};

export const OneOfNestedGioConfigDisable: StoryObj = {
  name: 'One Of with disableIf and parent disabled',
  args: {
    disabled: true,
    jsonSchema: oneOfNestedGioConfigDisableExample,
    initialValue: {
      maxTotal: 8,
      password: 'redispassword',
      releaseCache: false,
      sentinel: {
        enabled: false,
        masterId: 'sentinel-master',
      },
      standalone: {
        enabled: true,
        host: 'localhost',
        port: 6379,
      },
      timeToLiveSeconds: 0,
      timeout: 2000,
      useSsl: true,
    },
  },
};

export const AllOf: StoryObj = {
  args: {
    jsonSchema: allOfExample,
  },
};

export const EnumStory: StoryObj = {
  name: 'Enum',
  args: {
    jsonSchema: enumExample,
  },
};

export const References: StoryObj = {
  args: {
    jsonSchema: referencesExample,
  },
};

export const CodeEditor: StoryObj = {
  args: {
    jsonSchema: codeEditorExample,
  },
};

export const KafkaAdvanced: StoryObj = {
  args: {
    jsonSchema: kafkaAdvancedExample,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const MqttAdvanced: StoryObj = {
  name: 'MQTT Advanced',
  args: {
    jsonSchema: mqttAdvancedExample,
  },
};

export const HttpProxy: StoryObj = {
  args: {
    jsonSchema: httpProxyExample,
  },
};

export const WebhookAdvanced: StoryObj = {
  args: {
    jsonSchema: webhookAdvancedExample,
  },
};

export const Entrypoints: StoryObj = {
  name: 'Gio - V4 Entrypoints',
  render: () => ({
    template: `<mat-form-field appearance="fill" style="width:100%">
    <mat-label>--Please choose an entrypoint--</mat-label>
      <mat-select (selectionChange)="jsonSchema = getEntrypointConnectorSchema($event.value)" >
          <mat-option *ngFor="let entrypoint of entrypoints" [value]="entrypoint.id">{{ entrypoint.name }}</mat-option>
      </mat-select>
    </mat-form-field>
    <gio-demo *ngIf="jsonSchema" [jsonSchema]="jsonSchema" [isChromatic]="isChromatic()"></gio-demo>`,
    props: { jsonSchema: undefined, entrypoints: entrypointsGetResponse, getEntrypointConnectorSchema, isChromatic },
  }),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Endpoints: StoryObj = {
  name: 'Gio - V4 Endpoints',
  render: () => ({
    template: `<mat-form-field appearance="fill" style="width:100%">
    <mat-label>--Please choose an endpoint--</mat-label>
      <mat-select (selectionChange)="jsonSchema = getEndpointConnectorSchema($event.value)" >
          <mat-option *ngFor="let endpoint of endpoints" [value]="endpoint.id">{{ endpoint.name }}</mat-option>
      </mat-select>
    </mat-form-field>
    <gio-demo *ngIf="jsonSchema" [jsonSchema]="jsonSchema" [isChromatic]="isChromatic()"></gio-demo>`,
    props: { jsonSchema: undefined, endpoints: endpointsGetResponse, getEndpointConnectorSchema, isChromatic },
  }),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
