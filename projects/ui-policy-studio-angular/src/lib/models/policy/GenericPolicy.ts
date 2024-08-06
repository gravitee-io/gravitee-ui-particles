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
import { SharedPolicyGroupPolicy } from './SharedPolicyGroupPolicy';
import { Policy } from './Policy';

type CommonGenericPolicy = {
  _id: string;
  policyId: string;
  icon?: string;
  category?: string;
  type: 'POLICY' | 'SHARED_POLICY_GROUP';
};

export type GenericPolicyPolicy = CommonGenericPolicy & {
  type: 'POLICY';
} & Omit<Policy, 'id'>;

export type GenericPolicySharedPolicyGroupPolicy = CommonGenericPolicy & {
  type: 'SHARED_POLICY_GROUP';
  sharedPolicyGroupId: string;
} & Omit<SharedPolicyGroupPolicy, 'id'>;

export type GenericPolicy = GenericPolicyPolicy | GenericPolicySharedPolicyGroupPolicy;

export const isSharedPolicyGroupPolicy = (policy: GenericPolicy): policy is GenericPolicySharedPolicyGroupPolicy =>
  policy.type === 'SHARED_POLICY_GROUP';
export const isPolicy = (policy: GenericPolicy): policy is GenericPolicyPolicy => policy.type === 'POLICY';

export const toGenericPolicies = (policies: Policy[], sharedPolicyGroupPolicies: SharedPolicyGroupPolicy[] = []): GenericPolicy[] => {
  return [
    ...policies.map(policy => ({ _id: `POLICY_${policy.id}`, policyId: policy.id, type: 'POLICY' as const, ...policy })),
    ...sharedPolicyGroupPolicies.map(sharedPolicyGroupPolicy => ({
      _id: `SHARED_POLICY_GROUP_${sharedPolicyGroupPolicy.id}`,
      type: 'SHARED_POLICY_GROUP' as const,
      category: 'Shared Policy Group',
      sharedPolicyGroupId: sharedPolicyGroupPolicy.id,
      ...sharedPolicyGroupPolicy,
    })),
  ];
};

export const toPolicy = (genericPolicy: GenericPolicy): Policy => {
  if (isPolicy(genericPolicy)) {
    return {
      id: genericPolicy.policyId,
      ...genericPolicy,
    };
  }
  throw new Error('Cannot convert a Shared Policy Group Policy to a Policy');
};
