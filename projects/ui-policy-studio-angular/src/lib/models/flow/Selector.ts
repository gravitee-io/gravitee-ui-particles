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
import { HttpMethod } from './HttpMethod';

export type Operation = 'PUBLISH' | 'SUBSCRIBE';
export type Operator = 'EQUALS' | 'STARTS_WITH';
export type BaseSelectorTypeEnum = 'HTTP' | 'CHANNEL' | 'CONDITION' | 'MCP';

export interface BaseSelector {
  /**
   * Selector type.
   */
  type?: BaseSelectorTypeEnum;
}

export interface HttpSelector extends BaseSelector {
  /**
   * The path of the selector
   */
  path: string;
  pathOperator: Operator;
  methods?: HttpMethod[];
}

export interface ChannelSelector extends BaseSelector {
  /**
   * The list of operations associated with this channel selector.
   */
  operations?: Operation[];
  /**
   * The channel of the selector
   */
  channel: string;
  channelOperator: Operator;
  entrypoints?: string[];
}

export interface ConditionSelector extends BaseSelector {
  /**
   * The condition of the selector
   */
  condition: string;
}

export interface McpSelector extends BaseSelector {
  methods?: string[];
}

export type Selector = HttpSelector | ChannelSelector | ConditionSelector | McpSelector;
