/*
 * Copyright (C) 2022 The Gravitee team (http://gravitee.io)
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

import { Flow } from '../models';

// Model used internally by the component and it's children
export interface FlowVM extends Flow {
  _id: string;
  _hasChanged: boolean;
  _parentFlowGroupName?: string;
}
export interface FlowGroupVM {
  _id: string;
  _icon?: string;
  _planId?: string;
  name: string;
  flows: FlowVM[];
}

export interface PolicyDocumentation {
  content: string;
  language: 'MARKDOWN' | 'ASCIIDOC';
}
