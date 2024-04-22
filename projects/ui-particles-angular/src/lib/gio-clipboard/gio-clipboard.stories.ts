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
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GioClipboardModule } from './gio-clipboard.module';
import { GioClipboardCopyWrapperComponent } from './gio-clipboard-copy-wrapper.component';

export default {
  title: 'Components / Clipboard',
  component: GioClipboardCopyWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [GioClipboardModule, MatFormFieldModule, MatInputModule],
    }),
  ],
} as Meta;

export const InnerButton: StoryObj = {
  render: () => {
    return {
      template: `<div style="width:300px;"><div gioClipboardCopyWrapper contentToCopy="Hello" > Copy me ! </div></div>`,
      props: {},
    };
  },
};

export const InnerButtonAlwaysVisible: StoryObj = {
  render: () => {
    return {
      template: `<div style="width:300px;"><div gioClipboardCopyWrapper contentToCopy="Hello" alwaysVisible="true" > Copy me ! </div></div>`,
      props: {},
    };
  },
};

export const FormField: StoryObj = {
  render: () => {
    return {
      template: `
      <mat-form-field>
        <mat-label>Default animal</mat-label>
        <input #animalInput matInput value="🦊" tabindex="1"/>
        <gio-clipboard-copy-icon tabIndex="1" matIconSuffix [contentToCopy]="animalInput.value"></gio-clipboard-copy-icon>
      </mat-form-field>
      `,
      props: {},
    };
  },
};
