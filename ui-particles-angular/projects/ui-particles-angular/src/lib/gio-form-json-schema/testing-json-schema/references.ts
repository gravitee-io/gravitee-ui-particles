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
import { FormlyJSONSchema7 } from '../model/FormlyJSONSchema7';

export const fakeReferences: FormlyJSONSchema7 = {
  type: 'object',

  definitions: {
    address: {
      type: 'object',
      properties: {
        street_address: {
          title: 'Street address',
          type: 'string',
        },
        city: {
          title: 'City',
          type: 'string',
        },
        state: {
          title: 'State',
          type: 'string',
        },
      },
      required: ['street_address', 'city', 'state'],
    },
  },

  properties: {
    billing_address: {
      title: 'Simple reference',
      $ref: '#/definitions/address',
    },
    shipping_address: {
      title: 'Merge properties with reference',
      properties: {
        save: {
          title: 'Save shipping address',
          type: 'boolean',
        },
      },
      $ref: '#/definitions/address',
    },
  },
};
