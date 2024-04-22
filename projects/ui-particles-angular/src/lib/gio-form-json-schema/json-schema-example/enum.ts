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

export const enumExample: GioJsonSchema = {
  type: 'object',
  additionalProperties: false,

  definitions: {
    locations: {
      enum: ['New York', 'London', 'Paris'],
    },
  },

  properties: {
    enumW: {
      type: 'object',
      title: 'Enum',
      properties: {
        type: {
          title: 'Type',
          description: 'The type of the trust store',
          enum: [null, 'JKS', 'PKCS12', 'PEM'],
        },
      },
    },
    enumWithCustomLabel: {
      type: 'object',
      title: 'Enum with custom select label',
      properties: {
        type: {
          title: 'Type',
          description: 'The type of the trust store',
          enum: [null, 'JKS', 'PKCS12', 'PEM'],
          gioConfig: {
            enumLabelMap: {
              JKS: 'Java Trust Store (.jks)',
              PKCS12: 'PKCS#12 (.p12) / PFX (.pfx)',
              PEM: 'PEM (.pem)',
            },
          },
        },
      },
    },
    enumWithTitle: {
      type: 'object',
      title: 'Enum with custom select label',
      properties: {
        type: {
          title: 'Type',
          description: 'The type of the trust store',
          oneOf: [
            { const: 'JKS', title: 'Java Trust Store (.jks)' },
            { const: 'PKCS12', title: 'PKCS#12 (.p12) / PFX (.pfx)' },
            { const: 'PEM', title: 'PEM (.pem)' },
          ],
        },
      },
    },

    location: {
      title: 'Enum with $ref',
      $ref: '#/definitions/locations',
    },
    locationRadio: {
      title: 'Enum with Radio 🚧wip🚧',
      $ref: '#/definitions/locations',
      // Todo: replace with gioConfig option and remove any below
      widget: {
        formlyConfig: {
          type: 'radio',
        },
      },
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    multiSelect: {
      title: 'Enum with Checkboxes',
      type: 'array',
      uniqueItems: true,
      items: {
        $ref: '#/definitions/locations',
      },
    },
    checkboxes: {
      title: 'Locations Checkboxes',
      type: 'array',
      uniqueItems: true,
      items: {
        $ref: '#/definitions/locations',
      },
    },
  },
};
