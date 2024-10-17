/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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

import { isFunction } from 'lodash';

import { SharedPolicyGroupPolicy } from './SharedPolicyGroupPolicy';

export function fakeProxyRequestSharedPolicyGroupPolicy(
  modifier?: Partial<SharedPolicyGroupPolicy> | ((base: SharedPolicyGroupPolicy) => SharedPolicyGroupPolicy),
): SharedPolicyGroupPolicy {
  const base: SharedPolicyGroupPolicy = {
    id: '4d4c1b3b-3b1b-4b3b-8b3b-request',
    policyId: 'shared-policy-group-policy',
    name: 'Test PROXY SPG',
    description: 'Test Shared Policy Group request phase',
    prerequisiteMessage: 'The resource cache "my-cache" is required',
    apiType: 'PROXY',
    phase: 'REQUEST',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeProxyResponseSharedPolicyGroupPolicy(
  modifier?: Partial<SharedPolicyGroupPolicy> | ((base: SharedPolicyGroupPolicy) => SharedPolicyGroupPolicy),
): SharedPolicyGroupPolicy {
  const base: SharedPolicyGroupPolicy = {
    id: '4d4c1b3b-3b1b-4b3b-8b3b-response',
    policyId: 'shared-policy-group-policy',
    name: 'Test PROXY SPG',
    description: 'Test Shared Policy Group response phase',
    apiType: 'PROXY',
    phase: 'RESPONSE',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeAllSharedPolicyGroupPolicies(): SharedPolicyGroupPolicy[] {
  return [
    fakeProxyRequestSharedPolicyGroupPolicy(),
    fakeProxyResponseSharedPolicyGroupPolicy(),
    fakeProxyRequestSharedPolicyGroupPolicy({
      id: '4d4c1b3b-3b1b-4b3b-8b3b-1b3b4c1b3b4d',
      name: 'Test SPG PROXY 3',
      description: 'Yet another policy',
    }),
    fakeProxyRequestSharedPolicyGroupPolicy({
      id: '4d4c1b3b-3b1b-4b3b-8b3b-1b3b4c1b3b4e',
      name: 'Test SPG MESSAGE 4',
      description: 'PUBLISH Phase',
      apiType: 'MESSAGE',
      phase: 'PUBLISH',
    }),
  ];
}
