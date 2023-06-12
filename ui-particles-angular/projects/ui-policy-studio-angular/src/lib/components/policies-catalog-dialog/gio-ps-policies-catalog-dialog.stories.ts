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

import { POLICIES_V4_UNREGISTERED_ICON, fakeAllPolicies } from '../../models/index-testing';
import { GioPolicyStudioModule } from '../../gio-policy-studio.module';
import { matIconRegisterProvider } from '../../../storybook-utils/mat-icon-register.provider';
import { GioPolicyStudioService } from '../../gio-policy-studio.service';
import { fakePolicySchema } from '../../models/policy/PolicySchema.fixture';

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
        width: '1000px',
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
    component: GioPolicyStudioPoliciesCatalogDialogStoryComponent,
    props: {
      dialogData: {
        apiType: args.apiType,
        executionPhase: args.executionPhase,
        policies: fakeAllPolicies(),
      },
    },
  }),
  parameters: {
    chromatic: { delay: 2000 },
  },
} as Meta;

export const PROXY_REQUEST: StoryObj = {
  name: 'PROXY / REQUEST',
  args: {
    executionPhase: 'REQUEST',
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
    executionPhase: 'RESPONSE',
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
    executionPhase: 'REQUEST',
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
    executionPhase: 'RESPONSE',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const MESSAGE_MESSAGE_REQUEST: StoryObj = {
  name: 'MESSAGE / MESSAGE_REQUEST',
  args: {
    executionPhase: 'MESSAGE_REQUEST',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const MESSAGE_MESSAGE_RESPONSE: StoryObj = {
  name: 'MESSAGE / MESSAGE_RESPONSE',
  args: {
    executionPhase: 'MESSAGE_RESPONSE',
    apiType: 'MESSAGE',
  },
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};
