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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { action } from 'storybook/actions';
import { GIO_DIALOG_WIDTH } from '@gravitee/ui-particles-angular';

import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';
import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { fakeHttpFlow } from '../../../models/flow/Flow.fixture';

import {
  GioPolicyStudioFlowNativeFormDialogComponent,
  GioPolicyStudioFlowNativeFormDialogData,
} from './gio-ps-flow-native-form-dialog.component';

@Component({
  selector: 'gio-ps-flow-native-form-dialog-story',
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
  standalone: false,
})
class GioPolicyStudioFlowNativeFormDialogStoryComponent {
  @Input() public flow?: FlowVM = undefined;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowNativeFormDialogComponent, GioPolicyStudioFlowNativeFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowNativeFormDialogComponent,
        {
          data: {
            flow: this.flow,
            parentGroupName: 'Common',
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
  title: 'Policy Studio / components / Flow native form dialog',
  component: GioPolicyStudioFlowNativeFormDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioFlowNativeFormDialogStoryComponent],
      imports: [GioPolicyStudioFlowNativeFormDialogComponent, MatDialogModule],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioFlowNativeFormDialogStoryComponent,
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
      ...fakeHttpFlow({
        name: 'Flow name',
      }),
      _id: 'flowId1',
    },
  },
};
