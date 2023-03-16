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
import { GioJsonSchema } from '../model/GioJsonSchema';

export const stringExample: GioJsonSchema = {
  type: 'object',
  properties: {
    simpleString: {
      title: 'Simple Type String',
      description: 'Simple string without validation',
      type: 'string',
    },
    textareaString: {
      title: 'Format text (textarea)',
      description: 'Simple string with textarea input',
      type: 'string',
      format: 'text',
    },
    requiredString: {
      title: 'Required Type String',
      description: 'Required string by parent object',
      type: 'string',
    },
    stringEnum: {
      title: 'Type String with enum',
      type: 'string',
      enum: ['a', 'b', 'c'],
    },
    readonly: {
      title: 'Readonly/Disabled field',
      default: 'Should not edit my value',
      description: 'Example for readonly',
      type: 'string',
      readOnly: true,
    },
    password: {
      title: 'Format password',
      description: 'Simple string with password format',
      type: 'string',
      format: 'password',
    },
  },
  required: ['requiredString'],
};
