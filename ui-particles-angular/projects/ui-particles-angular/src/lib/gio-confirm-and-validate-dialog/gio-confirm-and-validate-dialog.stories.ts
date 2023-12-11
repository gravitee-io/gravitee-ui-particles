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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { GioBannerModule } from '../public-api';

import { GioConfirmAndValidateDialogModule } from './gio-confirm-and-validate-dialog.module';
import { GioConfirmAndValidateDialogComponent, GioConfirmAndValidateDialogData } from './gio-confirm-and-validate-dialog.component';
import {
  ConfirmAndValidateDialogStoryComponent,
  ConfirmAndValidateContentDialogStoryComponent,
} from './gio-confirm-and-validate-dialog.stories.component';

export default {
  title: 'Components / Confirm and validate dialog',
  component: GioConfirmAndValidateDialogComponent,
  decorators: [
    moduleMetadata({
      declarations: [ConfirmAndValidateDialogStoryComponent, ConfirmAndValidateContentDialogStoryComponent],
      imports: [GioConfirmAndValidateDialogModule, GioBannerModule, MatDialogModule, NoopAnimationsModule],
    }),
  ],
  argTypes: {
    title: {
      type: { name: 'string', required: false },
    },
    warning: {
      type: { name: 'string', required: false },
    },
    content: {
      type: { name: 'string', required: false },
    },
    validationMessage: {
      type: { name: 'string', required: false },
    },
    validationValue: {
      type: { name: 'string', required: false },
    },
    confirmButton: {
      type: { name: 'string', required: false },
    },
    cancelButton: {
      type: { name: 'string', required: false },
    },
  },
  render: args => ({
    component: ConfirmAndValidateDialogStoryComponent,
    props: { ...args },
  }),
  parameters: {
    chromatic: { delay: 2000 },
  },
} as Meta;

export const Default: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const Custom: StoryObj<GioConfirmAndValidateDialogData> = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};
Custom.args = {
  title: 'Are you sure you want to remove all cats?',
  warning: 'This action is irreversible',
  content: '🙀😿 Are you sure? You can’t undo this action afterwards.',
  validationMessage: 'Type "remove" to confirm',
  validationValue: 'remove',
  confirmButton: 'Yes, I want',
  cancelButton: 'Nope',
};

export const WithMultipleSpaces: StoryObj<GioConfirmAndValidateDialogData> = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};
WithMultipleSpaces.args = {
  ...Custom.args,
  title: 'Are you sure you want to remove a `Specific   Cat`?',
  content: '🙀😿 Are you sure? Removing a <code>Specific   Cat</code> can’t be undone afterwards.',
  validationMessage: 'Type <code>Specific   Cat</code> to confirm',
};

export const CustomContentComponent: StoryObj<GioConfirmAndValidateDialogData> = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};
CustomContentComponent.args = {
  title: 'Are you sure you want to remove all cats?',
  warning: 'This action is irreversible',
  content: {
    componentOutlet: ConfirmAndValidateContentDialogStoryComponent,
    componentInputs: {
      title: 'Dynamic component title',
    },
  },
  validationMessage: 'Type "remove" to confirm',
  validationValue: 'remove',
  confirmButton: 'Yes, I want',
  cancelButton: 'Nope',
};
