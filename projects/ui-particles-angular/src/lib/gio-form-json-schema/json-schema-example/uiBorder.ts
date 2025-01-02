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

export const uiBorderExample: GioJsonSchema = {
  type: 'object',
  properties: {
    simpleObject: {
      title: 'Simple object without border',
      type: 'object',
      properties: {
        string: {
          type: 'string',
        },
      },
      gioConfig: {
        uiBorder: 'none',
      },
    },
    exampleWithOneOf: {
      type: 'object',
      title: 'OneOf without border on child obj',
      oneOf: [
        {
          title: 'Use Lorem',
          properties: {
            lorem: {
              title: 'Lorem',
              type: 'string',
            },
          },
          required: ['lorem'],
          gioConfig: {
            uiBorder: 'none',
          },
        },
        {
          title: 'Use Ipsum',
          properties: {
            ipsum: {
              title: 'Ipsum',
              type: 'string',
            },
          },
          required: ['ipsum'],
          gioConfig: {
            uiBorder: 'none',
          },
        },
      ],
    },
    arrayWithoutBorder: {
      type: 'array',
      title: 'Array without border',
      items: {
        type: 'object',
        properties: {
          string: {
            type: 'string',
          },
        },
      },
      gioConfig: {
        uiBorder: 'none',
      },
    },
    arrayWithoutItemsBorder: {
      type: 'array',
      title: 'Array without items border',
      items: {
        type: 'object',
        properties: {
          string: {
            type: 'string',
          },
        },
        gioConfig: {
          uiBorder: 'none',
        },
      },
    },
  },
};
