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
import { MatDialogModule } from '@angular/material/dialog';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { ConfirmDialogStoryComponent, ConfirmContentDialogStoryComponent } from './gio-confirm-dialog.stories.component';
import { GioConfirmDialogData } from './gio-confirm-dialog.component';
import { GioConfirmDialogModule } from './gio-confirm-dialog.module';

export default {
  title: 'Components / Confirm dialog',
  component: ConfirmDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [ConfirmDialogStoryComponent],
      imports: [GioConfirmDialogModule, MatDialogModule],
    }),
  ],
  argTypes: {
    title: {
      type: { name: 'string', required: false },
    },
    content: {
      type: { name: 'string', required: false },
    },
    confirmButton: {
      type: { name: 'string', required: false },
    },
    cancelButton: {
      type: { name: 'string', required: false },
    },
    disableCancel: {
      type: { name: 'boolean', required: false },
    },
  },
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

export const Custom: StoryObj<GioConfirmDialogData> = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};
Custom.args = {
  title: 'Are you sure you want to remove all cats ?',
  content: '🙀😿 Are you sure? You can’t undo this action afterwards.',
  confirmButton: 'Yes, I want',
  cancelButton: 'Nope',
};

export const CustomContentComponent: StoryObj<GioConfirmDialogData> = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};
CustomContentComponent.args = {
  title: 'Are you sure you want to remove all cats?',
  content: {
    componentOutlet: ConfirmContentDialogStoryComponent,
    componentInputs: {
      title: 'ARE YOU SURE? YOU CAN’T UNDO THIS ACTION AFTERWARDS.',
    },
  },
  confirmButton: 'Yes, I want',
  cancelButton: 'Nope',
};

export const OnlyConfirmChoice: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-confirm-dialog') as HTMLButtonElement;
    button.click();
  },
};
OnlyConfirmChoice.args = {
  title: 'For your information',
  content: 'This is an information message.',
  confirmButton: 'OK',
  disableCancel: true,
};
