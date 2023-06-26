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
import { Story } from '@storybook/angular/types-7-0';
import isChromatic from 'chromatic/isChromatic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GioFormSlideToggleModule } from '@gravitee/ui-particles-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { GioMonacoEditorModule } from '../gio-monaco-editor/gio-monaco-editor.module';
import { GioFormFocusInvalidModule } from '../gio-form-focus-first-invalid/gio-form-focus-first-invalid.module';

import { DemoComponent } from './gio-form-json-schema.stories.component';
import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';
import { integerExample } from './json-schema-example/integer';
import { stringExample } from './json-schema-example/string';
import { mixedExample } from './json-schema-example/mixed';
import { oneOfExample } from './json-schema-example/oneOf';
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
    GioFormSlideToggleModule,
    GioMonacoEditorModule.forRoot({ theme: 'vs-dark' }),
  ],
  exports: [DemoComponent, GioFormJsonSchemaModule],
})
export class GioFJSStoryModule {}

export default {
  title: 'Components / Form Json schema',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, CommonModule, MatSelectModule, GioFJSStoryModule],
    }),
  ],
  parameters: {
    a11y: {
      // Disable to avoid freeze with monaco editor
      disable: true,
    },
  },
  render: ({ jsonSchema, initialValue, disabled, withToggle }) => ({
    template: `<gio-demo 
                    [jsonSchema]="jsonSchema" 
                    [initialValue]="initialValue"
                    [isChromatic]="isChromatic()" 
                    [disabled]="disabled"
                    [withToggle]="withToggle"
                ></gio-demo>`,
    props: { jsonSchema, initialValue, isChromatic, disabled, withToggle },
  }),
} as Meta;

export const StringDisabled: Story = {
  name: 'Disabled',
  args: {
    jsonSchema: stringExample,
    disabled: true,
  },
};

export const String: Story = {
  name: 'String',
  args: {
    jsonSchema: stringExample,
  },
};

export const Number: Story = {
  name: 'Number',
  args: {
    jsonSchema: integerExample,
  },
};

export const Boolean: Story = {
  name: 'Boolean',
  args: {
    jsonSchema: booleanExample,
  },
};

export const Array: Story = {
  name: 'Array',
  args: {
    jsonSchema: arrayExample,
  },
};

export const Mixed: Story = {
  name: 'Mixed',
  args: {
    jsonSchema: mixedExample,
  },
};

export const MixedWithValue: Story = {
  name: 'Mixed with value',
  args: {
    jsonSchema: mixedExample,
    initialValue: {
      body: '<xml></xml>',
    },
  },
};

export const WithBanner: Story = {
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

export const oneOf: Story = {
  name: 'OneOf',
  args: {
    jsonSchema: oneOfExample,
  },
};

export const allOf: Story = {
  name: 'AllOf',
  args: {
    jsonSchema: allOfExample,
  },
};

export const enumStory: Story = {
  name: 'Enum',
  args: {
    jsonSchema: enumExample,
  },
};

export const references: Story = {
  name: 'References',
  args: {
    jsonSchema: referencesExample,
  },
};

export const codeEditor: Story = {
  name: 'Code Editor',
  args: {
    jsonSchema: codeEditorExample,
  },
};

export const kafkaAdvanced: Story = {
  name: 'Kafka Advanced',
  args: {
    jsonSchema: kafkaAdvancedExample,
  },
};

export const kafkaAdvancedWithDisableToggle: Story = {
  name: 'Kafka Advanced Disabled With Disable Toggle',
  args: {
    jsonSchema: kafkaAdvancedExample,
    withToggle: true,
    disabled: true,
  },
};

export const mqttAdvanced: Story = {
  name: 'MQTT Advanced',
  args: {
    jsonSchema: mqttAdvancedExample,
  },
};

export const httpProxy: Story = {
  name: 'Http Proxy',
  args: {
    jsonSchema: httpProxyExample,
  },
};

export const webhookAdvanced: Story = {
  name: 'Webhook Advanced',
  args: {
    jsonSchema: webhookAdvancedExample,
  },
};

export const Entrypoints: Story = {
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
};

export const Endpoints: Story = {
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
};
