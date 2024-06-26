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
import { FormlyFieldConfig } from '@ngx-formly/core';

export function minItemsValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should NOT have fewer than ${field.props?.minItems} items`;
}

export function maxItemsValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should NOT have more than ${field.props?.maxItems} items`;
}

export function minLengthValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should NOT be shorter than ${field.props?.minLength} characters`;
}

export function maxLengthValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should NOT be longer than ${field.props?.maxLength} characters`;
}

export function minValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should be >= ${field.props?.min}`;
}

export function maxValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should be <= ${field.props?.max}`;
}

export function multipleOfValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should be multiple of ${field.props?.step}`;
}

export function exclusiveMinimumValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should be > ${field.props?.step}`;
}

export function exclusiveMaximumValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should be < ${field.props?.step}`;
}

export function constValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  return `Should be equal to constant "${field.props?.const}"`;
}

export function typeValidationMessage({ schemaType }: { schemaType: unknown[] }): string {
  return `Should be "${schemaType[0]}".`;
}

export function patternValidationMessage(error: unknown, field: FormlyFieldConfig): string {
  const key = field?.key?.toString() ?? 'Field';
  return `${key.charAt(0).toUpperCase() + key.slice(1)} value does not respect the pattern: ${field?.props?.pattern}`;
}
