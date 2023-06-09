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

import { Policy } from './Policy';

export function fakeMockPolicy(modifier?: Partial<Policy> | ((base: Policy) => Policy)): Policy {
  const base: Policy = {
    id: 'mock-policy',
    name: 'Mock policy',
    icon: 'gio:gift',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeTransformHeadersPolicy(modifier?: Partial<Policy> | ((base: Policy) => Policy)): Policy {
  const base: Policy = {
    id: 'transform-headers',
    name: 'Transform Headers',
    description: 'Override HTTP headers in incoming requests or outbound responses',
    icon: 'gio:gift',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeAllPolicies(): Policy[] {
  return [
    fakeMockPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeTransformHeadersPolicy(),
    fakeMockPolicy({
      name: 'Mock policy - With very long name to test overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        'Mock policy description - With very long name to test overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis sem at nibh elementum imperdiet.',
    }),
  ];
}
