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

import { fakeAllPolicies } from '../../models/index-testing';
import { GioPolicyStudioModule } from '../../gio-policy-studio.module';

import {
  GioPolicyStudioPoliciesCatalogDialogComponent,
  GioPolicyStudioPoliciesCatalogDialogData,
  GioPolicyStudioPoliciesCatalogDialogResult,
} from './gio-ps-policies-catalog-dialog.component';

@Component({
  selector: 'gio-ps-flow-proxy-form-dialog-story',
  template: `<button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class GioPolicyStudioPoliciesCatalogDialogStoryComponent {
  @Input()
  public dialogData?: GioPolicyStudioPoliciesCatalogDialogData;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<
        GioPolicyStudioPoliciesCatalogDialogComponent,
        GioPolicyStudioPoliciesCatalogDialogData,
        GioPolicyStudioPoliciesCatalogDialogResult
      >(GioPolicyStudioPoliciesCatalogDialogComponent, {
        data: this.dialogData,
        role: 'alertdialog',
        id: 'gioPsPoliciesCatalogDialog',
      })
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
  title: 'Policy Studio / components / Policies catalog dialog',
  component: GioPolicyStudioPoliciesCatalogDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioPoliciesCatalogDialogStoryComponent],
      imports: [GioPolicyStudioModule, MatDialogModule, NoopAnimationsModule],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioPoliciesCatalogDialogStoryComponent,
    props: {
      dialogData: {
        executionPhase: args.executionPhase,
        policies: fakeAllPolicies(),
      },
    },
  }),
  parameters: {
    chromatic: { delay: 2000 },
  },
} as Meta;

export const ListAll: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
  args: {
    executionPhase: 'REQUEST',
  },
};
