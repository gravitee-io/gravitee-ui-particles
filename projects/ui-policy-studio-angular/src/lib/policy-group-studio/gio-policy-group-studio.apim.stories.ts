/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { importProvidersFrom } from '@angular/core';
import { GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import { fakeAllPolicies, POLICIES_V4_UNREGISTERED_ICON } from '../models/policy/Policy.fixture';
import { matIconRegisterProvider } from '../../storybook-utils/mat-icon-register.provider';
import { Policy } from '../models';
import { fakePolicyDocumentation, fakePolicySchema } from '../models/policy/PolicySchema.fixture';

import { GioPolicyGroupStudioComponent } from './gio-policy-group-studio.component';

export default {
  title: 'Policy Studio / APIM - Policy Group Studio',
  decorators: [
    moduleMetadata({
      imports: [GioPolicyGroupStudioComponent],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        importProvidersFrom(GioFormJsonSchemaModule),
      ],
    }),
  ],
  component: GioPolicyGroupStudioComponent,
};

export const Loading = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'REQUEST',
    apiType: 'PROXY',
  },
});

export const ProxyAPIRequestPhase = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'REQUEST',
    apiType: 'PROXY',
  },
});

export const ProxyAPIResponsePhase = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'RESPONSE',
    apiType: 'PROXY',
  },
});

export const MessageAPIRequestPhase = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'REQUEST',
    apiType: 'MESSAGE',
  },
});

export const MessageAPIMessageRequestPhase = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'MESSAGE_REQUEST',
    apiType: 'MESSAGE',
  },
});

export const MessageAPIMessageResponsePhase = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'MESSAGE_RESPONSE',
    apiType: 'MESSAGE',
  },
});

export const MessageAPIResponsePhase = () => ({
  props: {
    policyGroupChange: action('policyGroupChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
    executionPhase: 'RESPONSE',
    apiType: 'MESSAGE',
  },
});
