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
import { FlowExecution } from '../../models';
import { fakeBestMatchFlowExecution } from '../../models/flow/FlowExecution.fixture';

import {
  GioPolicyStudioFlowExecutionFormDialogComponent,
  GioPolicyStudioFlowExecutionFormDialogData,
} from './gio-ps-flow-execution-form-dialog.component';

@Component({
  selector: 'gio-ps-flow-execution-form-dialog-story',
  template: `<button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class GioPolicyStudioFlowExecutionFormDialogStoryComponent {
  @Input() public flowExecution?: FlowExecution = undefined;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowExecutionFormDialogComponent, GioPolicyStudioFlowExecutionFormDialogData, FlowExecution | undefined>(
        GioPolicyStudioFlowExecutionFormDialogComponent,
        {
          data: {
            flowExecution: this.flowExecution,
          },
          role: 'alertdialog',
          id: 'gioPsFlowExecutionFormDialog',
        },
      )
      .afterClosed()
      .pipe(
        tap(edited => {
          action('edited')(edited);
        }),
      )
      .subscribe();
  }
}

export default {
  title: 'Policy Studio / components / Flow execution form dialog',
  component: GioPolicyStudioFlowExecutionFormDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioFlowExecutionFormDialogStoryComponent],
      imports: [GioPolicyStudioModule, MatDialogModule, NoopAnimationsModule],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioFlowExecutionFormDialogStoryComponent,
    props: { ...args },
  }),
  parameters: {
    chromatic: { delay: 1000 },
  },
} as Meta;

export const EditDefaultValue: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
  args: {
    flowExecution: undefined,
  },
};

export const EditExistingValue: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
  args: {
    flowExecution: fakeBestMatchFlowExecution({ matchRequired: true }),
  },
};
