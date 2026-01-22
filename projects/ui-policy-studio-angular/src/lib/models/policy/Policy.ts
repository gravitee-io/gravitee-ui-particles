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

import { get } from 'lodash';

import { ApiProtocolType } from '../ApiProtocolType';

export type FlowPhase = 'REQUEST' | 'RESPONSE' | 'INTERACT' | 'PUBLISH' | 'SUBSCRIBE' | 'ENTRYPOINT_CONNECT';

export interface Policy {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  category?: string;
  version?: string;
  flowPhaseCompatibility?: Partial<Record<ApiProtocolType, FlowPhase[]>>;
  deployed?: boolean;
}

/**
 * @Deprecated to keep as long as we support APIM < 4.6
 */
export type ExecutionPhase = 'REQUEST' | 'RESPONSE' | 'MESSAGE_REQUEST' | 'MESSAGE_RESPONSE';

export type PolicyInput = Omit<Policy, 'proxy' | 'message'> & {
  proxy?: ExecutionPhase[];
  message?: ExecutionPhase[];
};

/**
 * @Deprecated to keep as long as we support APIM < 4.6
 */
export const fromPolicyInput = (policy: PolicyInput | Policy): Policy => {
  const getProxyPhase = get(policy, 'proxy')?.map(fromExecutionPhase);
  const getMessagePhase = get(policy, 'message')?.map(fromExecutionPhase);

  return {
    ...policy,
    flowPhaseCompatibility: {
      ...(getProxyPhase && { HTTP_PROXY: getProxyPhase }),
      ...(getMessagePhase && { HTTP_MESSAGE: getMessagePhase }),
      ...policy.flowPhaseCompatibility,
    },
  };
};

/**
 * @Deprecated to keep as long as we support APIM < 4.6
 */
export const fromExecutionPhase = (phase: ExecutionPhase | FlowPhase): FlowPhase => {
  if (phase === 'MESSAGE_REQUEST') {
    return 'PUBLISH';
  }
  if (phase === 'MESSAGE_RESPONSE') {
    return 'SUBSCRIBE';
  }
  return phase;
};
