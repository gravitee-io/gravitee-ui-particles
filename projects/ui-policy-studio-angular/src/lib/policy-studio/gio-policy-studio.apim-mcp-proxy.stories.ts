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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { GioElService, GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import { matIconRegisterProvider } from '../../storybook-utils/mat-icon-register.provider';
import {
  POLICIES_V4_UNREGISTERED_ICON,
  fakeAllPolicies,
  fakePlan,
  fakeMCPProxyEndpoint,
  fakeMCPProxyEntrypoint,
  fakeMcpFlow,
} from '../models/index-testing';
import { ApiType, Policy, SaveOutput } from '../models';
import { fakePolicyDocumentation, fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import { fakeAllSharedPolicyGroupPolicies } from '../models/policy/SharedPolicyGroupPolicy.fixture';

import { GioPolicyStudioComponent } from './gio-policy-studio.component';

export default {
  title: 'Policy Studio / APIM - Policy Studio / MCP Proxy API',
  decorators: [
    moduleMetadata({
      imports: [GioPolicyStudioComponent],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        importProvidersFrom(GioFormJsonSchemaModule),
        GioElService,
        provideAppInitializer(() => {
          inject(GioElService).promptCallback = () => of({ el: 'Hello world!' });
        }),
      ],
    }),
  ],

  render: props => ({
    template: `<div style="height:calc(100vh - 2rem);"><gio-policy-studio
    [readOnly]="readOnly"
    [loading]="loading"
    [apiType]="apiType"
    [flowExecution]="flowExecution"
    [entrypointsInfo]="entrypointsInfo"
    [endpointsInfo]="endpointsInfo"
    [commonFlows]="commonFlows"
    [selectedFlowIndexes]="selectedFlowIndexes"
    [plans]="plans"
    [policies]="policies"
    [sharedPolicyGroupPolicies]="sharedPolicyGroupPolicies"
    [policySchemaFetcher]="policySchemaFetcher"
    [policyDocumentationFetcher]="policyDocumentationFetcher"
    [trialUrl]="trialUrl"
    (selectedFlowChanged)="onFlowSelectionChange($event)"
    (save)="onSave($event)"
    >
    </gio-policy-studio></div>`,
    props: {
      ...props,
      policies: fakeAllPolicies(),
      sharedPolicyGroupPolicies: fakeAllSharedPolicyGroupPolicies(),
      trialUrl: 'https://gravitee.io/self-hosted-trial',
      // Simulate a get policy schema http fetcher.
      policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
      policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
      onFlowSelectionChange: (event: { planIndex: number; flowIndex: number }) => {
        console.info('onFlowSelectionChange', event);
        action('onFlowSelectionChange')(event);
      },
      onSave: (event: SaveOutput) => {
        console.info('saveOutput', event);
        action('saveOutput')(event);
      },
    },
  }),
} as Meta;

export const McpProxyKafka: StoryObj = {
  name: 'MCP API',
  args: {
    apiType: 'MCP_PROXY' satisfies ApiType,
    entrypointsInfo: [fakeMCPProxyEntrypoint()],
    endpointsInfo: [fakeMCPProxyEndpoint()],
    commonFlows: [
      fakeMcpFlow(base => {
        return {
          ...base,
          name: 'Common flow',
          selectors: [
            {
              type: 'MCP',
              methods: ['tools/list', 'tools/call', 'notifications/tools/list_changed'],
            },
            {
              type: 'CONDITION',
              condition: 'message.attributes.type == "notification"',
            },
          ],
        };
      }),
    ],
    plans: [
      fakePlan({
        name: 'Plan Alpha',
        flows: [],
      }),
    ],
  },
};
