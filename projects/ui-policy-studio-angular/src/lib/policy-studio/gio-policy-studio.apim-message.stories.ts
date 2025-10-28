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
  fakeChannelFlow,
  fakeHTTPGetMessageEntrypoint,
  fakeHTTPPostMessageEntrypoint,
  fakeKafkaMessageEndpoint,
  fakeTestPolicyStep,
  fakePlan,
  fakeWebhookMessageEntrypoint,
  fakeConditionedChannelFlow,
  fakeWebsocketMessageEntrypoint,
  fakeSSEMessageEntrypoint,
  fakeMockMessageEndpoint,
} from '../models/index-testing';
import { ChannelSelector, Policy, SaveOutput } from '../models';
import { fakePolicyDocumentation, fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import { fakeAllSharedPolicyGroupPolicies } from '../models/policy/SharedPolicyGroupPolicy.fixture';

import { GioPolicyStudioComponent } from './gio-policy-studio.component';

export default {
  title: 'Policy Studio / APIM - Policy Studio / Message API',
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

export const MessageWithoutFlows: StoryObj = {
  name: 'Message API without flows',
  args: {
    apiType: 'MESSAGE',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeWebhookMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
  },
};

export const MessageWithFlows: StoryObj = {
  name: 'Message API with flows',
  args: {
    apiType: 'MESSAGE',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeWebhookMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow(),
      fakeChannelFlow({
        name: 'Extra long flow name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }),
      fakeChannelFlow({
        name: '',
      }),
    ],
  },
};

export const MessageWithFlowsAndPlans: StoryObj = {
  name: 'Message API with flows & plans',
  args: {
    apiType: 'MESSAGE',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeWebhookMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow(),
      fakeChannelFlow({
        name: 'Extra long flow name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      }),
      fakeChannelFlow({
        name: '',
      }),
    ],
    selectedFlowIndexes: { planIndex: 2, flowIndex: 2 },
    plans: [
      fakePlan({
        name: 'Plan without flow and with a very long name to test overflow Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        flows: [
          fakeChannelFlow({
            name: '',
          }),

          fakeChannelFlow({
            name: 'plan flow 1',
          }),
          fakeConditionedChannelFlow({}),
        ],
      }),
      fakePlan({
        name: 'Second plan',
        flows: [
          fakeChannelFlow({
            name: 'Flow 1 with webhook entrypoints',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel1',
                channelOperator: 'EQUALS',
                operations: ['PUBLISH', 'SUBSCRIBE'],
                entrypoints: ['webhook'],
              },
            ],
          }),
          fakeChannelFlow({
            name: 'Flow 2',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel2',
                channelOperator: 'STARTS_WITH',
                operations: ['SUBSCRIBE'],
              },
            ],
          }),
        ],
      }),
    ],
  },
};

export const MessageWithAllPhases: StoryObj = {
  name: 'Message API with All phases',
  args: {
    apiType: 'MESSAGE',
    entrypointsInfo: [
      fakeSSEMessageEntrypoint(),
      fakeWebsocketMessageEntrypoint(),
      fakeHTTPPostMessageEntrypoint(),
      fakeHTTPGetMessageEntrypoint(),
      fakeWebhookMessageEntrypoint(),
    ],
    endpointsInfo: [fakeMockMessageEndpoint(), fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow(base => {
        const channelSelector = base.selectors?.find(selector => selector.type === 'CHANNEL') as ChannelSelector;
        channelSelector.entrypoints = [];
        channelSelector.operations = [];
        return {
          ...base,
          name: 'Flow',
          request: [fakeTestPolicyStep()],
          response: [fakeTestPolicyStep()],
          publish: [fakeTestPolicyStep()],
          subscribe: [fakeTestPolicyStep()],
        };
      }),
    ],
    plans: [],
  },
};

export const ReadonlyMessageWithAllPhases: StoryObj = {
  name: 'Read only message API with All phases',
  args: {
    readOnly: true,
    apiType: 'MESSAGE',
    entrypointsInfo: [
      fakeSSEMessageEntrypoint(),
      fakeSSEMessageEntrypoint(),
      fakeWebsocketMessageEntrypoint(),
      fakeHTTPPostMessageEntrypoint(),
      fakeHTTPGetMessageEntrypoint(),
      fakeWebhookMessageEntrypoint(),
    ],
    endpointsInfo: [fakeMockMessageEndpoint(), fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow(base => {
        const channelSelector = base.selectors?.find(selector => selector.type === 'CHANNEL') as ChannelSelector;
        channelSelector.entrypoints = [];
        channelSelector.operations = [];
        return {
          ...base,
          name: 'Flow',
          request: [fakeTestPolicyStep()],
          response: [fakeTestPolicyStep()],
          publish: [fakeTestPolicyStep()],
          subscribe: [fakeTestPolicyStep()],
        };
      }),
    ],
    plans: [],
  },
};

export const MessageWithDisabledPhase: StoryObj = {
  name: 'Message API with disabled phase',
  args: {
    apiType: 'MESSAGE',
    entrypointsInfo: [fakeWebhookMessageEntrypoint(), fakeWebsocketMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow({
        name: 'Publish disabled',
        request: [fakeTestPolicyStep()],
        response: [fakeTestPolicyStep()],
        publish: [fakeTestPolicyStep()],
        subscribe: [fakeTestPolicyStep()],
      }),
      fakeChannelFlow({
        name: 'No entrypoints & operations selected',
        selectors: [
          {
            type: 'CHANNEL',
            channel: 'channel1',
            channelOperator: 'EQUALS',
            operations: [],
            entrypoints: [],
          },
        ],
        request: [fakeTestPolicyStep()],
        response: [fakeTestPolicyStep()],
        publish: [fakeTestPolicyStep()],
        subscribe: [fakeTestPolicyStep()],
      }),
    ],
    plans: [],
  },
};

export const MessageWithConditionalStep: StoryObj = {
  name: 'Message API with conditional step',
  args: {
    apiType: 'MESSAGE',
    entrypointsInfo: [fakeWebhookMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow({
        name: 'Flow',
        request: [
          fakeTestPolicyStep({
            condition: 'true',
          }),
          fakeTestPolicyStep(),
        ],
        response: [fakeTestPolicyStep()],
        publish: [],
        subscribe: [],
      }),
    ],
    plans: [],
  },
};
export const MessageWithConditionalExpressionLanguageStep: StoryObj = {
  name: 'Message API with conditional expression language step',
  args: {
    apiType: 'MESSAGE',
    entrypointsInfo: [fakeWebhookMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
    commonFlows: [
      fakeChannelFlow({
        name: 'Flow',
        request: [],
        response: [fakeTestPolicyStep()],
        selectors: [
          {
            type: 'CHANNEL',
            operations: ['PUBLISH', 'SUBSCRIBE'],
            channel: 'boop',
            channelOperator: 'EQUALS',
            entrypoints: ['sse'],
          },
          {
            type: 'CONDITION',
            condition: "{#request.params['includeheaders'] == null}",
          },
        ],
        publish: [],
        subscribe: [],
      }),
    ],
    plans: [],
  },
};
