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
import { Component, importProvidersFrom, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';
import { GIO_DIALOG_WIDTH, GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';
import { MarkdownModule } from 'ngx-markdown';

import { fakeTestPolicy, fakeTestPolicyStep, POLICIES_V4_UNREGISTERED_ICON } from '../../models/index-testing';
import { matIconRegisterProvider } from '../../../storybook-utils/mat-icon-register.provider';
import { GioPolicyStudioService } from '../../policy-studio/gio-policy-studio.service';
import { fakePolicyDocumentation, fakePolicySchema } from '../../models/policy/PolicySchema.fixture';
import { PolicyDocumentation } from '../../policy-studio/gio-policy-studio.model';

import {
  GioPolicyStudioStepEditDialogComponent,
  GioPolicyStudioStepEditDialogData,
  GioPolicyStudioStepEditDialogResult,
} from './gio-ps-step-edit-dialog.component';

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
class GioPolicyStudioStepEditDialogStoryComponent {
  @Input()
  public dialogData?: GioPolicyStudioStepEditDialogData;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioStepEditDialogComponent, GioPolicyStudioStepEditDialogData, GioPolicyStudioStepEditDialogResult>(
        GioPolicyStudioStepEditDialogComponent,
        {
          data: this.dialogData,
          role: 'alertdialog',
          id: 'gioPsPolicyFormDialog',
          width: GIO_DIALOG_WIDTH.LARGE,
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
  title: 'Policy Studio / components / Step Edit dialog',
  component: GioPolicyStudioStepEditDialogStoryComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioPolicyStudioStepEditDialogStoryComponent],
      imports: [MatDialogModule],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        { provide: GioPolicyStudioService, useValue: provideGioPolicyStudioService() },
        importProvidersFrom(GioFormJsonSchemaModule),
      ],
    }),
  ],
  argTypes: {},
  render: args => ({
    component: GioPolicyStudioStepEditDialogStoryComponent,
    props: {
      dialogData: {
        genericPolicy: args.genericPolicy,
        step: args.step,
        flowPhase: 'REQUEST',
        apiType: 'PROXY',
      },
    },
  }),
  parameters: {
    chromatic: { delay: 1000 },
  },
} as Meta;

const sharedArgs = {
  genericPolicy: {
    ...fakeTestPolicy({ description: 'This is a test policy' }),
    _id: 'test',
    policyId: fakeTestPolicy().id,
    type: 'POLICY',
  },
  step: fakeTestPolicyStep(),
};

export const Default: StoryObj = {
  args: sharedArgs,
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const UsingLegacyDocumentationWithoutType: StoryObj = {
  args: sharedArgs,
  decorators: createStoryDecorators(
    '= Basic authentication policy\n\nifdef::env-github[]\nimage:https://img.shields.io/static/v1?label=Available%20at&message=Gravitee.io&color=1EC9D2["Gravitee.io", link="https://download.gravitee.io/#graviteeio-apim/plugins/policies/gravitee-policy-basic-authentication/"]\nimage:https://img.shields.io/badge/License-Apache%202.0-blue.svg["License", link="https://github.com/gravitee-io/gravitee-policy-basic-authentication/blob/master/LICENSE.txt"]\nimage:https://img.shields.io/badge/semantic--release-conventional%20commits-e10079?logo=semantic-release["Releases", link="https://github.com/gravitee-io/gravitee-policy-basic-authentication/releases"]\nimage:https://circleci.com/gh/gravitee-io/gravitee-policy-basic-authentication.svg?style=svg["CircleCI", link="https://circleci.com/gh/gravitee-io/gravitee-policy-basic-authentication"]\nendif::[]\n\n== Phase\n\n[cols="2*", options="header"]\n|===\n^|onRequest\n^|onResponse\n\n^.^| X\n^.^|\n\n|===\n\n== Description\n\nYou can use the basic-authentication policy to manage basic authentication headers sent in API calls. The policy compares the user and password sent in the basic authentication header to an APIM user to determine if the user credentials are valid.\n\nTo use the policy in an API, you need to:\n\n* configure an LDAP, inline or http resource for your API plan, which specifies where the APIM users are stored\n* configure a basic authentication policy for the API flows\n\nNOTE: LDAP, inline and http resources are not part of the default APIM configuration, so you must configure an LDAP, inline or http resource for APIM first, as described in the link:/apim/3.x/apim_devguide_plugins.html[Developer Guide^].\n\n== Compatibility with APIM\n\n|===\n| Plugin version | APIM version\n\n| 1.4.x and upper             | 3.15.x to latest\n| Up to 1.x                   | Up to 3.14.x\n|===\n\n=== Connected user\n\nAfter successful authentication, connected username is stored in context attributes, accessible with context.attributes[\'user\'] expression language.\n\nIn order to display the connected username in API logging, you can enable the environment setting Gateway > API logging > Display end user on API Logging.\n\nThis adds a user column in the logs table.\n\n== Configuration\n\nThe policy configuration is as follows:\n\n|===\n|Property |Description |Type\n\n|authenticationProviders||List of strings\n|realm||string\n|===\n',
  ),
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

export const UsingMdViewer: StoryObj = {
  args: sharedArgs,
  decorators: createStoryDecorators({
    content:
      '## Overview\nYou can use the callout-http policy to invoke an HTTP(S) URL and place a subset or all of the content in\none or more variables of the request execution context.\n\nThis can be useful if you need some data from an external service and want to inject it during request\nprocessing.\n\nThe result of the callout is placed in a variable called calloutResponse and is only available during policy\nexecution. If no variable is configured the result of the callout is no longer available.\n\n\n\n\n\n## Errors\nYou can use the response template feature to override the default response provided by the policy.\nThese templates are be defined at the API level, in "Entrypoint" section for V4 Apis, or in "Response Templates" for V2 APIs.\n\nThe error keys sent by this policy are as follows:\n\n| Key |\n| ---  |\n| CALLOUT_EXIT_ON_ERROR |\n| CALLOUT_HTTP_ERROR |\n\n\n',
    language: 'MARKDOWN',
  } as PolicyDocumentation),
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

function createStoryDecorators(policyDocumentation: PolicyDocumentation | string) {
  return [
    moduleMetadata({
      declarations: [GioPolicyStudioStepEditDialogStoryComponent],
      imports: [MatDialogModule],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        { provide: GioPolicyStudioService, useValue: provideGioPolicyStudioService(policyDocumentation) },
        importProvidersFrom(GioFormJsonSchemaModule),
        importProvidersFrom(MarkdownModule.forRoot()),
      ],
    }),
  ];
}

function provideGioPolicyStudioService(doc: PolicyDocumentation | string = fakePolicyDocumentation('test-policy')): GioPolicyStudioService {
  const service = new GioPolicyStudioService();
  service.setPolicySchemaFetcher(policy => of(fakePolicySchema(policy.id)));
  service.setPolicyDocumentationFetcher(() => of(doc));
  return service;
}
