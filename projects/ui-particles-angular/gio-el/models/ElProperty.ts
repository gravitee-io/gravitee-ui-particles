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

export type ElPropertyType = 'string' | 'number' | 'date' | 'boolean';

export type ElPropertyBase<T extends ElPropertyType> = {
  field: string;
  label: string;
  type: T;
  map?:
    | {
        type: 'Map';
        key1Values?: string[] | { value: string; label: string }[];
        key1Value?: string | null;
      }
    | {
        type: 'MultiMap';
        key1Value?: string | null;
        key1Values?: string[];
        key2Value?: string | null;
      };
};

export type StringElProperty = ElPropertyBase<'string'> & {
  values?:
    | string[]
    | {
        value: string;
        label: string;
      }[];
};

export type NumberElProperty = ElPropertyBase<'number'> & {
  min?: number;
  max?: number;
};

export type DateElProperty = ElPropertyBase<'date'>;

export type BooleanElProperty = ElPropertyBase<'boolean'>;

export type ElProperty = StringElProperty | NumberElProperty | DateElProperty | BooleanElProperty;
