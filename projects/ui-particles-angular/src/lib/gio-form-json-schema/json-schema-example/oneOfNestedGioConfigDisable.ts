/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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

export const oneOfNestedGioConfigDisableExample: GioJsonSchema = {
  type: 'object',
  properties: {
    standalone: {
      type: 'object',
      oneOf: [
        {
          title: 'Configure standalone',
          properties: {
            enabled: {
              const: true,
            },
            host: {
              title: 'Host',
              description: 'The host of the instance. (Supports EL)',
              type: 'string',
              default: 'localhost',
            },
            port: {
              title: 'Port',
              description: 'The port of the instance.',
              type: 'integer',
              default: 6379,
            },
          },
          required: ['host', 'port'],
        },
        {
          title: 'Standalone disabled',
          properties: {
            enabled: {
              const: false,
            },
          },
        },
      ],
      default: {
        enabled: true,
      },
      gioConfig: {
        disableIf: {
          $eq: {
            'value.sentinel.enabled': true,
          },
        },
      },
    },
    sentinel: {
      type: 'object',
      oneOf: [
        {
          title: 'Configure sentinel',
          properties: {
            enabled: {
              const: true,
            },
            masterId: {
              title: 'Master',
              description: 'The sentinel master id. (Supports EL)',
              type: 'string',
              default: 'sentinel-master',
            },
            password: {
              title: 'Sentinel password',
              description: 'The sentinel password. (Supports EL and secrets)',
              type: 'string',
              writeOnly: true,
            },
            nodes: {
              type: 'array',
              title: 'Sentinel nodes',
              items: {
                type: 'object',
                title: 'Node',
                properties: {
                  host: {
                    title: 'The host of node',
                    type: 'string',
                    default: 'localhost',
                  },
                  port: {
                    title: 'The port of node',
                    type: 'integer',
                    default: 26379,
                  },
                },
                required: ['host', 'port'],
              },
              default: [
                {
                  host: 'localhost',
                  port: 26379,
                },
              ],
            },
          },
          required: ['masterId', 'nodes'],
        },
        {
          title: 'Sentinel disabled',
          description:
            'Sentinel provides high availability for Redis. In practical terms this means that using Sentinel you can create a Redis deployment that resists without human intervention certain kinds of failures.',
          properties: {
            enabled: {
              const: false,
            },
          },
        },
      ],
      default: {
        enabled: false,
      },
    },
  },
};
