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

import { Flow } from './Flow';
import { ChannelSelector } from './Selector';

export function fakeChannelFlow(modifier?: Partial<Flow> | ((baseApi: Flow) => Flow)): Flow {
  const channelSelector: ChannelSelector = {
    type: 'CHANNEL',
    channel: 'channel',
    channelOperator: 'EQUALS',
    entrypoints: ['entrypoint'],
    operations: ['PUBLISH'],
  };

  const base: Flow = {
    name: 'Flow name',
    selectors: [channelSelector],
    request: [],
    response: [],
    subscribe: [],
    publish: [],
    enabled: true,
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}
