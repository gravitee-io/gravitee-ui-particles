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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { action } from '@storybook/addon-actions';

import { GioPolicyStudioModule } from '../../gio-policy-studio.module';
import { FlowVM } from '../../gio-policy-studio.model';
import { fakeChannelFlow } from '../../models/index-testing';

import {
  GioPolicyStudioFlowFormDialogComponent,
  GioPolicyStudioFlowFormDialogData,
  GioPolicyStudioFlowFormDialogResult,
} from './gio-ps-flow-form-dialog.component';

@Component({
  selector: 'gio-ps-flow-form-dialog-story',
  template: `<button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class GioPolicyStudioFlowFormDialogStoryComponent {
  @Input() public flow?: FlowVM = undefined;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowFormDialogComponent, GioPolicyStudioFlowFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowFormDialogComponent,
        {
          data: {
            flow: this.flow,
            entrypoints: ['entrypoint1', 'entrypoint2'],
          },
          role: 'alertdialog',
          id: 'gioPsFlowFormDialog',
        },
      )
      .afterClosed()
      .pipe(
        tap(createdOrEdited => {
          action('createdOrEdited')(createdOrEdited);
        }),
      )
      .subscribe();
  }
}

export default {
  title: 'Policy Studio / components / Flow form dialog',
  component: GioPolicyStudioFlowFormDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioFlowFormDialogStoryComponent],
      imports: [GioPolicyStudioModule, MatDialogModule, NoopAnimationsModule],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioFlowFormDialogStoryComponent,
    props: { ...args },
  }),
  parameters: {
    chromatic: { delay: 1000 },
  },
} as Meta;

export const Create: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const Edit: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
  args: {
    flow: {
      ...fakeChannelFlow({
        name: 'Flow name',
        selectors: [
          {
            type: 'CHANNEL',
            channel: 'channel1',
            channelOperator: 'EQUALS',
            operations: ['PUBLISH'],
            entrypoints: ['entrypoint1', 'entrypoint2'],
          },
          {
            type: 'CONDITION',
            condition: 'My condition',
          },
        ],
      }),
      _id: 'flowId1',
    },
  },
};
