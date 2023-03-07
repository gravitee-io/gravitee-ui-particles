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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { DemoComponent } from './gio-form-json-schema.stories.component';
import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';
import { fakeInteger } from './testing-json-schema/integer';
import { fakeString } from './testing-json-schema/string';
import { fakeMixed } from './testing-json-schema/mixed';
import { fakeOneOf } from './testing-json-schema/oneOf';
import { entrypointsGetResponse, getEntrypointConnectorSchema } from './testing-json-schema/entrypoints';
import { endpointsGetResponse, getEndpointConnectorSchema } from './testing-json-schema/endpoints';
import { fakeEnum } from './testing-json-schema/enum';
import { fakeReferences } from './testing-json-schema/references';
import { fakeAllOf } from './testing-json-schema/allOf';
import { fakeSecurityConfig } from './testing-json-schema/securityConfig';
import { fakeBoolean } from './testing-json-schema/boolean';

@NgModule({
  declarations: [DemoComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatFormFieldModule, GioFormJsonSchemaModule],
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
} as Meta;

export const String: Story = {
  name: 'String',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeString },
  }),
};

export const Number: Story = {
  name: 'Number',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeInteger },
  }),
};

export const Boolean: Story = {
  name: 'Boolean',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeBoolean },
  }),
};

export const Mixed: Story = {
  name: 'Mixed',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeMixed },
  }),
};

export const MixedWithValue: Story = {
  name: 'Mixed with value',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema" [initialValue]="initialValue"></gio-demo>`,
    props: { jsonSchema: fakeMixed, initialValue: { body: '<xml></xml>' } },
  }),
};

export const FieldWithBanner: Story = {
  name: 'Field with banner',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema" [initialValue]="initialValue"></gio-demo>`,
    props: {
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
  }),
};

export const oneOf: Story = {
  name: 'OneOf',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeOneOf },
  }),
};

export const allOf: Story = {
  name: 'AllOf',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeAllOf },
  }),
};

export const enumStory: Story = {
  name: 'Enum',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeEnum },
  }),
};

export const references: Story = {
  name: 'References',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeReferences },
  }),
};

export const securityConfig: Story = {
  name: 'Security config',
  render: () => ({
    template: `<gio-demo [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: fakeSecurityConfig },
  }),
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
    <gio-demo *ngIf="jsonSchema" [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: undefined, entrypoints: entrypointsGetResponse, getEntrypointConnectorSchema },
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
    <gio-demo *ngIf="jsonSchema" [jsonSchema]="jsonSchema"></gio-demo>`,
    props: { jsonSchema: undefined, endpoints: endpointsGetResponse, getEndpointConnectorSchema },
  }),
};
