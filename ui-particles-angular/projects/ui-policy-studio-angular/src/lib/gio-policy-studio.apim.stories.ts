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
import { Meta, moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';

import { matIconRegisterProvider } from '../storybook-utils/mat-icon-register.provider';

import { GioPolicyStudioModule } from './gio-policy-studio.module';
import {
  POLICIES_V4_UNREGISTERED_ICON,
  fakeAllPolicies,
  fakeChannelFlow,
  fakeHTTPGetMessageEntrypoint,
  fakeHTTPPostMessageEntrypoint,
  fakeHTTPProxyEndpoint,
  fakeHTTPProxyEntrypoint,
  fakeHttpFlow,
  fakeJsonToXmlStep,
  fakeKafkaMessageEndpoint,
  fakeTestPolicyStep,
  fakePlan,
  fakeRateLimitStep,
  fakeWebhookMessageEntrypoint,
  fakeConditionedChannelFlow,
  fakeConditionedHttpFlow,
  fakeWebsocketMessageEntrypoint,
  fakeSSEMessageEntrypoint,
  fakeMockMessageEndpoint,
} from './models/index-testing';
import { ChannelSelector, HttpSelector, Policy, SaveOutput } from './models';
import { fakePolicyDocumentation, fakePolicySchema } from './models/policy/PolicySchema.fixture';

export default {
  title: 'Policy Studio / APIM',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, GioPolicyStudioModule],

      providers: [matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon })))],
    }),
  ],

  render: props => ({
    template: `<div style="height:calc(100vh - 2rem);"><gio-policy-studio
    [loading]="loading"
    [apiType]="apiType"
    [flowExecution]="flowExecution"
    [entrypointsInfo]="entrypointsInfo"
    [endpointsInfo]="endpointsInfo"
    [commonFlows]="commonFlows"
    [plans]="plans"
    [policies]="policies"
    [policySchemaFetcher]="policySchemaFetcher"
    [policyDocumentationFetcher]="policyDocumentationFetcher"
    (save)="onSave($event)"
    >
    </gio-policy-studio></div>`,
    props: {
      ...props,
      policies: fakeAllPolicies(),
      // Simulate a get policy schema http fetcher.
      policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)),
      policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)),
      onSave: (event: SaveOutput) => {
        console.info('saveOutput', event);
        action('saveOutput')(event);
      },
    },
  }),
} as Meta;

export const Loading: Story = {
  name: 'Loading',
  args: {
    loading: true,
    apiType: 'MESSAGE',
    flowExecution: {
      mode: 'BEST_MATCH',
      matchRequired: false,
    },
    entrypointsInfo: [fakeWebhookMessageEntrypoint()],
    endpointsInfo: [fakeKafkaMessageEndpoint()],
  },
};

export const MessageWithoutFlows: Story = {
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

export const MessageWithFlows: Story = {
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

export const MessageWithFlowsAndPlans: Story = {
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

export const MessageWithAllPhases: Story = {
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

export const MessageWithDisabledPhase: Story = {
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

export const MessageWithConditionalStep: Story = {
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

export const ProxyWithFlowsAndPlans: Story = {
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

export const ProxyWithFlowSteps: Story = {
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

export const LongWorld: Story = {
  name: 'Long World',
  args: {
    apiType: 'PROXY',
    entrypointsInfo: [fakeHTTPProxyEntrypoint()],
    endpointsInfo: [fakeHTTPProxyEndpoint()],
    commonFlows: [
      fakeHttpFlow({
        name: 'FlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
        selectors: [
          {
            type: 'HTTP',
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE'],
            path: '/FlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscing/Elit',
            pathOperator: 'EQUALS',
          },
        ],
        request: [
          fakeJsonToXmlStep({
            name: 'VeryLongWorldToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
            description:
              'VeryLongWorldToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElitVeryLongWorldToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
          }),
          fakeRateLimitStep(),
        ],
        response: [],
      }),
      fakeConditionedHttpFlow(base => {
        base.name = 'ConditionedFlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit';
        const httpS = base.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
        if (httpS) {
          httpS.path = '/ConditionedFlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscing/Elit';
          httpS.methods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE'];
        }
        return base;
      }),
    ],
    plans: [
      fakePlan({
        name: 'PlanNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
        flows: [
          fakeChannelFlow({
            name: 'FlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
            selectors: [
              {
                type: 'CHANNEL',
                channel: '/FlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscing/Elit',
                channelOperator: 'EQUALS',
                operations: ['PUBLISH', 'SUBSCRIBE'],
                entrypoints: ['webhook'],
              },
            ],
            request: [
              fakeJsonToXmlStep({
                name: 'VeryLongWorldToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
                description:
                  'VeryLongWorldToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElitVeryLongWorldToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
                condition: 'veryLongConditionToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit',
              }),
              fakeRateLimitStep(),
            ],
          }),
          fakeConditionedChannelFlow(base => {
            base.name = 'ConditionedFlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscingElit';
            const chanelS = base.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
            if (chanelS) {
              chanelS.channel = '/ConditionedFlowNameWithVeryLongNameToTestOverflowLoremIpsumDolorSitAmetConsecteturAdipiscing/Elit';
              chanelS.operations = ['PUBLISH', 'SUBSCRIBE'];
              chanelS.channelOperator = 'STARTS_WITH';
            }
            return base;
          }),
        ],
      }),
    ],
  },
};
