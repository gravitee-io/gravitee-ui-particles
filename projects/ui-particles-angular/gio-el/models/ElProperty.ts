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

export type ElPropertyType = 'string' | 'number' | 'date' | 'boolean' | 'List' | 'Map' | 'MultiMap';

type ElPropertyBase<T extends ElPropertyType> = {
  field: string;
  label: string;
  type: T;
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

export type ListElProperty<T extends ElPropertyType> = ElPropertyBase<'List'> & {
  valueProperty: ElPropertyTyped<T>;
};

export type MapElProperty<T extends ElPropertyType> = ElPropertyBase<'Map'> & {
  key?: string | null; // ??
  keyValues?: string[] | { value: string; label: string }[];
  valueProperty: ElPropertyTyped<T>;
};

export type MultiMapElProperty<T extends ElPropertyType> = ElPropertyBase<'MultiMap'> & {
  key1?: string | null; // ??
  key1Values?: string[] | { value: string; label: string }[];
  key2?: string | null; // ??
  // key2Values?: string[] | { value: string; label: string }[];
  valueProperty: Omit<ElPropertyTyped<T>, 'label' | 'field'>;
};

export type ElPropertyTyped<T extends ElPropertyType> = Partial<Extract<ElProperty, { type: T }>>;

export type ElProperty =
  | StringElProperty
  | NumberElProperty
  | DateElProperty
  | BooleanElProperty
  | MapElProperty<ElPropertyType>
  | MultiMapElProperty<ElPropertyType>;

export function isStringElProperty(elProperty: ElProperty): elProperty is StringElProperty {
  return elProperty.type === 'string';
}

export function isNumberElProperty(elProperty: ElProperty): elProperty is NumberElProperty {
  return elProperty.type === 'number';
}

export function isDateElProperty(elProperty: ElProperty): elProperty is DateElProperty {
  return elProperty.type === 'date';
}

export function isBooleanElProperty(elProperty: ElProperty): elProperty is BooleanElProperty {
  return elProperty.type === 'boolean';
}

export function isMapElProperty<T extends ElPropertyType>(elProperty: ElProperty, type: T): elProperty is MapElProperty<T> {
  return elProperty.type === 'Map' && elProperty.valueProperty?.type === type;
}

export function ifMultiMapElProperty<T extends ElPropertyType>(elProperty: ElProperty, type: T): elProperty is MultiMapElProperty<T> {
  return elProperty.type === 'MultiMap' && elProperty.valueProperty?.type === type;
}
