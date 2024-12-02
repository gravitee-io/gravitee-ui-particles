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
import { importProvidersFrom } from '@angular/core';
import { GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import { matIconRegisterProvider } from '../../storybook-utils/mat-icon-register.provider';
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
  fakeSharedPolicyGroupPolicyStep,
  fakeKafkaNativeEntrypoint,
  fakeKafkaNativeEndpoint,
  fakeNativeFlow,
} from '../models/index-testing';
import { ApiType, ChannelSelector, HttpSelector, Policy, SaveOutput } from '../models';
import { fakePolicyDocumentation, fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import { fakeAllSharedPolicyGroupPolicies } from '../models/policy/SharedPolicyGroupPolicy.fixture';

import { GioPolicyStudioComponent } from './gio-policy-studio.component';

export default {
  title: 'Policy Studio / APIM - Policy Studio',
  decorators: [
    moduleMetadata({
      imports: [GioPolicyStudioComponent],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        importProvidersFrom(GioFormJsonSchemaModule),
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
    [plans]="plans"
    [policies]="policies"
    [sharedPolicyGroupPolicies]="sharedPolicyGroupPolicies"
    [policySchemaFetcher]="policySchemaFetcher"
    [policyDocumentationFetcher]="policyDocumentationFetcher"
    [trialUrl]="trialUrl"
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
      onSave: (event: SaveOutput) => {
        console.info('saveOutput', event);
        action('saveOutput')(event);
      },
    },
  }),
} as Meta;

export const Loading: StoryObj = {
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

export const LongWorld: StoryObj = {
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

export const NativeKafka: StoryObj = {
  name: 'Native Kafka API',
  args: {
    apiType: 'NATIVE' satisfies ApiType,
    entrypointsInfo: [fakeKafkaNativeEntrypoint()],
    endpointsInfo: [fakeKafkaNativeEndpoint()],
    commonFlows: [
      fakeNativeFlow(base => {
        return {
          ...base,
          name: 'Common flow',
          interact: [fakeTestPolicyStep()],
          publish: [fakeTestPolicyStep()],
          subscribe: [fakeTestPolicyStep()],
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
