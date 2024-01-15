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
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { action } from '@storybook/addon-actions';
import { GIO_DIALOG_WIDTH } from '@gravitee/ui-particles-angular';

import { GioPolicyStudioModule } from '../../../gio-policy-studio.module';
import { FlowVM } from '../../../gio-policy-studio.model';
import { fakeChannelFlow, fakeHTTPGetMessageEntrypoint, fakeSSEMessageEntrypoint } from '../../../models/index-testing';
import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';

import {
  GioPolicyStudioFlowMessageFormDialogComponent,
  GioPolicyStudioFlowMessageFormDialogData,
} from './gio-ps-flow-message-form-dialog.component';

@Component({
  selector: 'gio-ps-flow-message-form-dialog-story',
  template: `<button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vh;
      }
    `,
  ],
})
class GioPolicyStudioFlowMessageFormDialogStoryComponent {
  @Input() public flow?: FlowVM = undefined;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowMessageFormDialogComponent, GioPolicyStudioFlowMessageFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowMessageFormDialogComponent,
        {
          data: {
            flow: this.flow,
            entrypoints: [
              fakeSSEMessageEntrypoint({
                name: 'entrypoint1',
                type: 'entrypoint1',
              }),
              fakeHTTPGetMessageEntrypoint({
                name: 'entrypoint2',
                type: 'entrypoint2',
              }),
            ],
          },
          role: 'alertdialog',
          id: 'gioPsFlowFormDialog',
          width: GIO_DIALOG_WIDTH.MEDIUM,
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
  title: 'Policy Studio / components / Flow message form dialog',
  component: GioPolicyStudioFlowMessageFormDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioFlowMessageFormDialogStoryComponent],
      imports: [GioPolicyStudioModule, MatDialogModule],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioFlowMessageFormDialogStoryComponent,
    props: { ...args },
  }),
  parameters: {
    chromatic: { delay: 1000, pauseAnimationAtEnd: true },
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
