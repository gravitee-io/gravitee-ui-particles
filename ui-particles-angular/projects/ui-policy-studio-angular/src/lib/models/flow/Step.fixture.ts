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

import { Step } from './Step';

export function fakeMockPolicyStep(modifier?: Partial<Step> | ((base: Step) => Step)): Step {
  const base: Step = {
    name: 'Mock Policy',
    description: 'Mock Policy description',
    enabled: true,
    policy: 'test-policy',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeRateLimitStep(modifier?: Partial<Step> | ((base: Step) => Step)): Step {
  const base: Step = {
    name: 'Rate Limit',
    description: 'Step description',
    enabled: true,
    policy: 'rate-limit',
    configuration: {
      rate: {
        limit: 10,
        periodTime: 1,
        periodTimeUnit: 'MINUTES',
      },
    },
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeJsonToXmlStep(modifier?: Partial<Step> | ((base: Step) => Step)): Step {
  const base: Step = {
    name: 'JSON to XML',
    description: 'JSON to XML',
    enabled: true,
    policy: 'json-xml',
    configuration: {},
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}
