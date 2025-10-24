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
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { GioElService, GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import { matIconRegisterProvider } from '../../storybook-utils/mat-icon-register.provider';
import {
  POLICIES_V4_UNREGISTERED_ICON,
  fakeAllPolicies,
  fakeHTTPProxyEndpoint,
  fakeHTTPProxyEntrypoint,
  fakeHttpFlow,
  fakeJsonToXmlStep,
  fakeTestPolicyStep,
  fakePlan,
  fakeRateLimitStep,
  fakeSharedPolicyGroupPolicyStep,
} from '../models/index-testing';
import { Policy, SaveOutput } from '../models';
import { fakePolicyDocumentation, fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import { fakeAllSharedPolicyGroupPolicies } from '../models/policy/SharedPolicyGroupPolicy.fixture';

import { GioPolicyStudioComponent } from './gio-policy-studio.component';

export default {
  title: 'Policy Studio / APIM - Policy Studio / Http Proxy API',
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

export const ProxyWithFlowsAndPlans: StoryObj = {
  name: 'Proxy API with flows & plans',
  args: {
    apiType: 'PROXY',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeHTTPProxyEntrypoint()],
    endpointsInfo: [fakeHTTPProxyEndpoint()],
    commonFlows: [
      fakeHttpFlow(),
      fakeHttpFlow({
        name: 'Extra long flow name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }),
      fakeHttpFlow({
        name: '',
      }),
    ],
    plans: [
      fakePlan({
        id: 'plan1',
        name: 'Plan without flow and with a very long name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        flows: [
          fakeHttpFlow({
            name: '',
          }),

          fakeHttpFlow({
            name: 'plan flow 1',
          }),
        ],
      }),
      fakePlan({
        id: 'plan2',
        name: 'Second plan',
        flows: [
          fakeHttpFlow({
            name: 'Flow 1',
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET'],
                path: '/path1',
                pathOperator: 'EQUALS',
              },
            ],
          }),
          fakeHttpFlow({
            name: 'Flow 2',
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET', 'PUT', 'POST', 'DELETE'],
                path: '/path1',
                pathOperator: 'STARTS_WITH',
              },
            ],
          }),
          fakeHttpFlow({
            name: 'Flow 3',
            selectors: [
              {
                type: 'HTTP',
                methods: [],
                path: '/path3',
                pathOperator: 'EQUALS',
              },
            ],
          }),
        ],
      }),
    ],
  },
};

export const ProxyWithSharedPolicyGroup: StoryObj = {
  name: 'Proxy API with SharedPolicyGroup',
  args: {
    apiType: 'PROXY',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeHTTPProxyEntrypoint()],
    endpointsInfo: [fakeHTTPProxyEndpoint()],
    commonFlows: [
      fakeHttpFlow({
        request: [fakeSharedPolicyGroupPolicyStep()],
      }),
    ],
    plans: [
      fakePlan({
        name: 'Second plan',
        flows: [
          fakeHttpFlow({
            request: [
              fakeSharedPolicyGroupPolicyStep(),
              fakeSharedPolicyGroupPolicyStep({
                name: 'SPG Not found',
                configuration: {
                  sharedPolicyGroupId: 'undefined',
                },
              }),
            ],
          }),
        ],
      }),
    ],
  },
};

export const ReadOnlyProxyWithFlowsAndPlans: StoryObj = {
  name: 'Read only proxy API with flows & plans',
  args: {
    readOnly: true,
    apiType: 'PROXY',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeHTTPProxyEntrypoint()],
    endpointsInfo: [fakeHTTPProxyEndpoint()],
    commonFlows: [
      fakeHttpFlow(),
      fakeHttpFlow({
        name: 'Extra long flow name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }),
      fakeHttpFlow({
        name: '',
      }),
    ],
    plans: [
      fakePlan({
        name: 'Plan without flow and with a very long name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        flows: [
          fakeHttpFlow({
            name: '',
          }),

          fakeHttpFlow({
            name: 'plan flow 1',
          }),
        ],
      }),
      fakePlan({
        name: 'Second plan',
        flows: [
          fakeHttpFlow({
            name: 'Flow 1',
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET'],
                path: '/path1',
                pathOperator: 'EQUALS',
              },
            ],
          }),
          fakeHttpFlow({
            name: 'Flow 2',
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET', 'PUT', 'POST', 'DELETE'],
                path: '/path1',
                pathOperator: 'STARTS_WITH',
              },
            ],
          }),
          fakeHttpFlow({
            name: 'Flow 3',
            selectors: [
              {
                type: 'HTTP',
                methods: [],
                path: '/path3',
                pathOperator: 'EQUALS',
              },
            ],
          }),
        ],
      }),
    ],
  },
};

export const ProxyWithFlowSteps: StoryObj = {
  name: 'Proxy API With Flow steps',
  args: {
    apiType: 'PROXY',
    entrypointsInfo: [fakeHTTPProxyEntrypoint()],
    endpointsInfo: [fakeHTTPProxyEndpoint()],
    commonFlows: [
      fakeHttpFlow({
        name: 'Flow with steps',
        request: [
          fakeJsonToXmlStep({
            description: undefined,
          }),
          fakeJsonToXmlStep(),
          fakeRateLimitStep(),
        ],
        response: [
          fakeTestPolicyStep({
            name: 'Policy with very long name to test overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            description:
              'Policy with very long name to test overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit and some more text to test overflow.',
          }),
          fakeTestPolicyStep(),
          fakeTestPolicyStep(),
        ],
      }),
    ],
    plans: [],
  },
};
