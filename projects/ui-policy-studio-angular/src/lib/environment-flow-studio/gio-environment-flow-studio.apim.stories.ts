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

import { GioEnvironmentFlowStudioComponent } from './gio-environment-flow-studio.component';

export default {
  title: 'Policy Studio / APIM - Environment Flow Studio',
  decorators: [
    moduleMetadata({
      imports: [GioEnvironmentFlowStudioComponent],
    }),
    applicationConfig({
      providers: [
        matIconRegisterProvider(POLICIES_V4_UNREGISTERED_ICON.map(policy => ({ id: policy.id, svg: policy.icon }))),
        importProvidersFrom(GioFormJsonSchemaModule),
      ],
    }),
  ],
  component: GioEnvironmentFlowStudioComponent,
};

export const RequestPhase = () => ({
  props: {
    environmentFlowChange: action('environmentFlowChange'),
    policies: fakeAllPolicies(),
    policySchemaFetcher: (policy: Policy) => of(fakePolicySchema(policy.id)).pipe(delay(600)),
    policyDocumentationFetcher: (policy: Policy) => of(fakePolicyDocumentation(policy.id)).pipe(delay(600)),
  },
});
