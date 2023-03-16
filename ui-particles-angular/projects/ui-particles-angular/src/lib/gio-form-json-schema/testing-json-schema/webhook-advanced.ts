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

export const fakeWebhookAdvanced: GioJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  definitions: {
    proxy: {
      type: 'object',
      title: 'Proxy Options',
      oneOf: [
        {
          title: 'No proxy',
          properties: { enabled: { const: false }, useSystemProxy: { const: false } },
          additionalProperties: false,
        },
        {
          title: 'Use proxy configured at system level',
          properties: { enabled: { const: true }, useSystemProxy: { const: true } },
          additionalProperties: false,
        },
        {
          title: 'Use proxy for client connections',
          properties: {
            enabled: { const: true },
            useSystemProxy: { const: false },
            type: {
              type: 'string',
              title: 'Proxy Type',
              description: 'The type of the proxy',
              default: 'HTTP',
              enum: ['HTTP', 'SOCKS4', 'SOCKS5'],
            },
            host: {
              type: 'string',
              title: 'Proxy host',
              description: 'Proxy host to connect to',
            },
            port: {
              type: 'integer',
              title: 'Proxy port',
              description: 'Proxy port to connect to',
            },
            username: {
              type: 'string',
              title: 'Proxy username',
              description: 'Optional proxy username',
            },
            password: {
              type: 'string',
              title: 'Proxy password',
              description: 'Optional proxy password',
              format: 'password',
            },
          },
          required: ['host', 'port'],
          additionalProperties: false,
        },
      ],
    },
  },
  properties: {
    http: {
      type: 'object',
      title: 'HTTP Options',
      properties: {
        connectTimeout: {
          type: 'integer',
          title: 'Connect timeout (ms)',
          description: 'Maximum time to connect to the webhook in milliseconds.',
          default: 3000,
        },
        readTimeout: {
          type: 'integer',
          title: 'Read timeout (ms)',
          description: 'Maximum time given to the webhook to complete the request (including response) in milliseconds.',
          default: 10000,
        },
        idleTimeout: {
          type: 'integer',
          title: 'Idle timeout (ms)',
          description:
            'Maximum time a connection will stay in the pool without being used in milliseconds. Once the timeout has elapsed, the unused connection will be closed, allowing to free the associated resources.',
          default: 60000,
        },
      },
    },
    proxy: {
      $ref: '#/definitions/proxy',
    },
  },
};
