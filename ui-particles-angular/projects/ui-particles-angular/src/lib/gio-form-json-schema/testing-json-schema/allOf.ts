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

export const fakeAllOf: FormlyJSONSchema7 = {
  type: 'object',
  definitions: {
    userType: {
      properties: {
        pseudo: {
          type: 'string',
          title: 'Pseudo',
        },
      },
    },
    authMethod: {
      properties: {
        token: {
          type: 'string',
          title: 'Token',
        },
      },
    },
  },

  properties: {
    allOfWithProperties: {
      title: 'AllOf with properties',
      type: 'object',
      allOf: [
        {
          properties: {
            first: {
              title: 'First',
              type: 'string',
            },
          },
        },
        {
          $ref: '#/definitions/authMethod',
        },
        {
          properties: {
            second: {
              title: 'Second',
              type: 'string',
            },
          },
        },
        {
          $ref: '#/definitions/userType',
        },
      ],
    },
  },
};
