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
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { DemoComponent } from './gio-form-json-schema.stories.component';
import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';

@NgModule({
  declarations: [DemoComponent],
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, GioFormJsonSchemaModule],
  exports: [DemoComponent],
})
export class GioFJSStoryModule {}

export default {
  title: 'Components / Form Json schema',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, CommonModule, GioFJSStoryModule],
    }),
  ],
} as Meta;

export const String: Story = {
  name: 'String',
  render: () => ({
    template: `<gio-demo jsonSchemaName="string"></gio-demo>`,
  }),
};

export const Number: Story = {
  name: 'Number',
  render: () => ({
    template: `<gio-demo jsonSchemaName="integer"></gio-demo>`,
  }),
};

export const Mixed: Story = {
  name: 'Mixed',
  render: () => ({
    template: `<gio-demo jsonSchemaName="mixed"></gio-demo>`,
  }),
};
