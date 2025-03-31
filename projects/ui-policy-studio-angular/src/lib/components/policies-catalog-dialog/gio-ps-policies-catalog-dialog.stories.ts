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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';
import { GIO_DIALOG_WIDTH } from '@gravitee/ui-particles-angular';

import { POLICIES_V4_UNREGISTERED_ICON, fakeAllPolicies } from '../../models/index-testing';
import { matIconRegisterProvider } from '../../../storybook-utils/mat-icon-register.provider';
import { GioPolicyStudioService } from '../../policy-studio/gio-policy-studio.service';
import { fakePolicyDocumentation, fakePolicySchema } from '../../models/policy/PolicySchema.fixture';
import { fromPolicyInput, toGenericPolicies } from '../../models';
import { fakeAllSharedPolicyGroupPolicies } from '../../models/policy/SharedPolicyGroupPolicy.fixture';

import {
  GioPolicyStudioPoliciesCatalogDialogComponent,
  GioPolicyStudioPoliciesCatalogDialogData,
  GioPolicyStudioPoliciesCatalogDialogResult,
} from './gio-ps-policies-catalog-dialog.component';

@Component({
  selector: 'gio-ps-flow-proxy-form-dialog-story',
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
        width: GIO_DIALOG_WIDTH.LARGE,
      })
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
  title: 'Policy Studio / components / Policies catalog dialog',
  component: GioPolicyStudioPoliciesCatalogDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioPoliciesCatalogDialogStoryComponent],
      imports: [MatDialogModule],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        {
          provide: GioPolicyStudioService,
          useFactory: () => {
            const service = new GioPolicyStudioService();
            service.setPolicySchemaFetcher(policy => of(fakePolicySchema(policy.id)));
            service.setPolicyDocumentationFetcher(policy => of(fakePolicyDocumentation(policy.id)));
            return service;
          },
        },
      ],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioPoliciesCatalogDialogStoryComponent,
    props: {
      dialogData: {
        apiType: args.apiType,
        flowPhase: args.flowPhase,
        genericPolicies: toGenericPolicies(fakeAllPolicies().map(fromPolicyInput), fakeAllSharedPolicyGroupPolicies()),
        trialUrl: 'https://gravitee.io/self-hosted-trial',
      },
    },
  }),
  parameters: {
    chromatic: { delay: 2000 },
  },
} as Meta;

export const NoPolicies: StoryObj = {
  name: 'No policies',
  args: {
    flowPhase: 'UNKNOWN',
    apiType: 'PROXY',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const PROXY_REQUEST: StoryObj = {
  name: 'PROXY / REQUEST',
  args: {
    flowPhase: 'REQUEST',
    apiType: 'PROXY',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const PROXY_RESPONSE: StoryObj = {
  name: 'PROXY / RESPONSE',
  args: {
    flowPhase: 'RESPONSE',
    apiType: 'PROXY',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const MESSAGE_REQUEST: StoryObj = {
  name: 'MESSAGE / REQUEST',
  args: {
    flowPhase: 'REQUEST',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const MESSAGE_RESPONSE: StoryObj = {
  name: 'MESSAGE / RESPONSE',
  args: {
    flowPhase: 'RESPONSE',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const MESSAGE_PUBLISH: StoryObj = {
  name: 'MESSAGE / PUBLISH',
  args: {
    flowPhase: 'PUBLISH',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const MESSAGE_SUBSCRIBE: StoryObj = {
  name: 'MESSAGE / SUBSCRIBE',
  args: {
    flowPhase: 'SUBSCRIBE',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};
