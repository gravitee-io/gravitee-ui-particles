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
import { of } from 'rxjs';

import { POLICIES_V4_UNREGISTERED_ICON, fakeMockPolicyStep, fakeTestPolicy } from '../../models/index-testing';
import { GioPolicyStudioModule } from '../../gio-policy-studio.module';
import { matIconRegisterProvider } from '../../../storybook-utils/mat-icon-register.provider';
import { GioPolicyStudioService } from '../../gio-policy-studio.service';
import { fakePolicySchema } from '../../models/policy/PolicySchema.fixture';

import {
  GioPolicyStudioPolicyFormDialogComponent,
  GioPolicyStudioPolicyFormDialogData,
  GioPolicyStudioPolicyFormDialogResult,
} from './gio-ps-policy-form-dialog.component';

@Component({
  selector: 'gio-ps-flow-proxy-form-dialog-story',
  template: `<button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class GioPolicyStudioPolicyFormDialogStoryComponent {
  @Input()
  public dialogData?: GioPolicyStudioPolicyFormDialogData;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioPolicyFormDialogComponent, GioPolicyStudioPolicyFormDialogData, GioPolicyStudioPolicyFormDialogResult>(
        GioPolicyStudioPolicyFormDialogComponent,
        {
          data: this.dialogData,
          role: 'alertdialog',
          id: 'gioPsPolicyFormDialog',
          width: '1000px',
        },
      )
      .afterClosed()
      .pipe(
        tap(dialogResult => {
          action('dialogResult')(dialogResult);
        }),
      )
      .subscribe();
  }
}

export default {
  title: 'Policy Studio / components / Policy Form dialog',
  component: GioPolicyStudioPolicyFormDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioPolicyFormDialogStoryComponent],
      imports: [GioPolicyStudioModule, MatDialogModule, NoopAnimationsModule],
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        {
          provide: GioPolicyStudioService,
          useFactory: () => {
            const service = new GioPolicyStudioService();
            service.setPolicySchemaFetcher(policy => of(fakePolicySchema(policy.id)));
            service.setPolicyDocumentationFetcher(policy => of(`${policy.id} documentation`));
            return service;
          },
        },
      ],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioPolicyFormDialogStoryComponent,
    props: {
      dialogData: {
        policy: args.policy,
        step: args.step,
      },
    },
  }),
  parameters: {
    chromatic: { delay: 2000 },
  },
} as Meta;

export const Default: StoryObj = {
  name: 'Default',
  args: {
    policy: fakeTestPolicy({
      description: 'This is a test policy',
    }),
    step: fakeMockPolicyStep(),
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};
