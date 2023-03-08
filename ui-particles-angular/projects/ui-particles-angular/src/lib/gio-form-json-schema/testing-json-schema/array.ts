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

export const fakeArray: GioJsonSchema = {
  type: 'object',
  additionalProperties: false,

  properties: {
    arrayOfString: {
      type: 'array',
      title: 'Array',
      description: 'Array description. With min and max items',
      items: {
        type: 'string',
      },
      minItems: 2,
      maxItems: 4,
      gioConfig: {
        banner: {
          title: 'Banner title',
          text: 'Banner text',
        },
      },
    },
    arrayOfObject: {
      type: 'array',
      title: 'Array of object',
      description: 'Array of object description',
      items: {
        type: 'object',
        properties: {
          string: {
            type: 'string',
            title: 'String',
            description: 'String description',
          },
          boolean: {
            type: 'boolean',
            title: 'Boolean',
            description: 'Boolean description',
          },
        },
      },
    },

    headers: {
      type: 'array',
      title: 'HTTP Headers',
      description: 'Default HTTP headers added or overridden by the API gateway to upstream',
      items: {
        type: 'object',
        title: 'Header',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
          value: {
            type: 'string',
            title: 'Value',
          },
        },
        required: ['name', 'value'],
      },
      gioConfig: {
        uiType: 'gio-headers-array',
      },
    },
  },
  required: ['booleanRequired'],
};
