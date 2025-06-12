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
import { ElPropertyType } from '../../models/ElProperty';

import { Operator } from './Operator';

type ConditionValue<T> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'date'
      ? Date
      : T extends 'boolean'
        ? boolean
        : unknown;

export class Condition<T extends ElPropertyType> {
  constructor(
    public field:
      | string
      | {
          field: string;
          key1?: string;
          key2?: string;
        },
    public type: T,
    public operator: Operator,
    public value?: ConditionValue<T>,
  ) {}
}
