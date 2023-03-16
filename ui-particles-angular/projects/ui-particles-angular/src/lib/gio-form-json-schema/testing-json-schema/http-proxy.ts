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

export const fakeHttpProxy: GioJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  definitions: {
    target: {
      title: 'Target url',
      description: 'The target url to use to contact the backend',
      type: 'string',
    },

    clearTextUpgrade: {
      title: 'Allow h2c Clear Text Upgrade',
      description:
        'If enabled, an h2c connection is established using an HTTP/1.1 Upgrade request. If disabled, h2c connection is established directly (with prior knowledge).',
      type: 'boolean',
      default: true,
    },

    keepAlive: {
      title: 'Enable keep-alive',
      description: 'Use an HTTP persistent connection to send and receive multiple HTTP requests / responses.',
      type: 'boolean',
      default: true,
    },
    connectTimeout: {
      type: 'integer',
      title: 'Connect timeout (ms)',
      description: 'Maximum time to connect to the backend in milliseconds.',
      default: 3000,
    },
    pipelining: {
      title: 'Enable HTTP pipelining',
      description:
        'When pipe-lining is enabled requests will be written to connections without waiting for previous responses to return.\n',
      type: 'boolean',
      default: false,
    },
    readTimeout: {
      type: 'integer',
      title: 'Read timeout (ms)',
      description: 'Maximum time given to the backend to complete the request (including response) in milliseconds.',
      default: 10000,
    },
    useCompression: {
      title: 'Enable compression (gzip, deflate)',
      description:
        "The gateway can let the remote http server know that it supports compression. In case the remote http server returns a compressed response, the gateway will decompress it. Leave that option off if you don't want compression between the gateway and the remote server.",
      type: 'boolean',
      default: true,
    },
    idleTimeout: {
      type: 'integer',
      title: 'Idle timeout (ms)',
      description:
        'Maximum time a connection will stay in the pool without being used in milliseconds. Once the timeout has elapsed, the unused connection will be closed, allowing to free the associated resources.',
      default: 60000,
    },
    followRedirects: {
      title: 'Follow HTTP redirects',
      description:
        'When the connector receives a status code in the range 3xx from the backend, it follows the redirection provided by the Location response header.',
      type: 'boolean',
      default: false,
    },
    maxConcurrentConnections: {
      type: 'integer',
      title: 'Max Concurrent Connections',
      description: 'Maximum pool size for connections.',
      default: 20,
    },

    http: {
      type: 'object',
      title: 'Security configuration',

      oneOf: [
        {
          title: 'HTTP 1.1',
          properties: {
            version: {
              const: 'HTTP_1_1',
            },
            keepAlive: {
              $ref: '#/definitions/keepAlive',
            },
            connectTimeout: {
              $ref: '#/definitions/connectTimeout',
            },
            pipelining: {
              $ref: '#/definitions/pipelining',
            },
            readTimeout: {
              $ref: '#/definitions/readTimeout',
            },
            useCompression: {
              $ref: '#/definitions/useCompression',
            },
            idleTimeout: {
              $ref: '#/definitions/idleTimeout',
            },
            followRedirects: {
              $ref: '#/definitions/followRedirects',
            },
            maxConcurrentConnections: {
              $ref: '#/definitions/maxConcurrentConnections',
            },
          },
          required: ['connectTimeout', 'readTimeout', 'idleTimeout', 'maxConcurrentConnections'],
          additionalProperties: false,
        },
        {
          title: 'HTTP 2',
          properties: {
            version: {
              const: 'HTTP_2',
            },
            clearTextUpgrade: {
              $ref: '#/definitions/clearTextUpgrade',
            },
            keepAlive: {
              $ref: '#/definitions/keepAlive',
            },
            connectTimeout: {
              $ref: '#/definitions/connectTimeout',
            },
            pipelining: {
              $ref: '#/definitions/pipelining',
            },
            readTimeout: {
              $ref: '#/definitions/readTimeout',
            },
            useCompression: {
              $ref: '#/definitions/useCompression',
            },
            idleTimeout: {
              $ref: '#/definitions/idleTimeout',
            },
            followRedirects: {
              $ref: '#/definitions/followRedirects',
            },
            maxConcurrentConnections: {
              $ref: '#/definitions/maxConcurrentConnections',
            },
          },
          required: ['connectTimeout', 'readTimeout', 'idleTimeout', 'maxConcurrentConnections'],
          additionalProperties: false,
        },
      ],
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

    sslTrustStoreHostnameVerifier: {
      title: 'Verify Host',
      description: 'Use to enable host name verification',
      type: 'boolean',
      default: true,
    },

    sslTrustStoreTrustAll: {
      title: 'Trust all',
      description:
        "Use this with caution (if over Internet). The gateway must trust any origin certificates. The connection will still be encrypted but this mode is vulnerable to 'man in the middle' attacks.",
      type: 'boolean',
      default: false,
    },

    sslTrustStorePassword: {
      type: 'string',
      title: 'Password',
      description: 'Truststore password',
      format: 'password',
      gioConfig: {
        banner: {
          title: 'SSL truststore password',
          text: 'The password for the truststore file. If a password is not set, truststore file configured will still be used, but integrity checking is disabled. Truststore password is not supported for PEM format.',
        },
      },
    },
    sslTrustStorePath: {
      type: 'string',
      title: 'Path to truststore',
      description: 'Path to the truststore file',
    },
    sslTrustStoreContent: {
      type: 'string',
      title: 'Content',
      description: 'Binary content as Base64',
      format: 'text',
    },

    sslKeyStorePassword: {
      type: 'string',
      title: 'Password',
      description: 'Password to use to open the key store',
      format: 'text',
    },
    sslKeyStoreAlias: {
      type: 'string',
      title: 'Alias for the key',
      description: 'Alias of the key to use in case the key store contains more than one key',
    },
    sslKeyStoreKeyPassword: {
      type: 'string',
      title: 'Key Password',
      description: 'Password to use to access the key when protected by password',
      format: 'text',
    },
    sslKeyStorePath: {
      type: 'string',
      title: 'Path to key store',
      description: 'Path to the key store file',
    },
    sslKeyStoreContent: {
      type: 'string',
      title: 'Content',
      description: 'Binary content as Base64',
      format: 'text',
    },
    sslKeyStoreCertPath: {
      type: 'string',
      title: 'Path to cert file',
      description: 'Path to cert file (.PEM)',
    },
    sslKeyStoreCertContent: {
      type: 'string',
      title: 'Certificate',
      format: 'text',
    },
    sslKeyStoreKeyPath: {
      type: 'string',
      title: 'Path to private key file',
      description: 'Path to private key file (.PEM)',
    },
    sslKeyStoreKeyContent: {
      type: 'string',
      title: 'Private key',
      format: 'text',
    },

    ssl: {
      type: 'object',
      title: 'SSL Options',
      properties: {
        hostnameVerifier: {
          $ref: '#/definitions/sslTrustStoreHostnameVerifier',
        },
        trustAll: {
          $ref: '#/definitions/sslTrustStoreTrustAll',
        },
        truststore: {
          type: 'object',
          title: 'Truststore',
          oneOf: [
            {
              type: 'object',
              title: 'None',
              properties: {
                type: {
                  const: '',
                },
              },
            },
            {
              type: 'object',
              title: 'JKS with path',
              properties: {
                type: {
                  const: 'JKS',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
                path: {
                  $ref: '#/definitions/sslTrustStorePath',
                },
              },
              required: ['password', 'path'],
            },
            {
              type: 'object',
              title: 'JKS with content',
              properties: {
                type: {
                  const: 'JKS',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
                content: {
                  $ref: '#/definitions/sslTrustStoreContent',
                },
              },
              required: ['password', 'content'],
            },
            {
              type: 'object',
              title: 'PKCS#12 / PFX with path',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
                path: {
                  $ref: '#/definitions/sslTrustStorePath',
                },
              },
              required: ['password', 'path'],
            },
            {
              type: 'object',
              title: 'PKCS#12 / PFX with content',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
                content: {
                  $ref: '#/definitions/sslTrustStoreContent',
                },
              },
              required: ['password', 'content'],
            },
            {
              type: 'object',
              title: 'PEM with path',
              properties: {
                type: {
                  const: 'PEM',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
                path: {
                  $ref: '#/definitions/sslTrustStorePath',
                },
              },
              required: ['password', 'path'],
            },
            {
              type: 'object',
              title: 'PEM with content',
              properties: {
                type: {
                  const: 'PEM',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
                content: {
                  $ref: '#/definitions/sslTrustStoreContent',
                },
              },
              required: ['password', 'content'],
            },
          ],
        },
        keystore: {
          type: 'object',
          title: 'Key store',
          oneOf: [
            {
              type: 'object',
              title: 'None',
              properties: {
                type: {
                  const: '',
                },
              },
            },
            {
              type: 'object',
              title: 'JKS with path',
              properties: {
                type: {
                  const: 'JKS',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
                alias: {
                  $ref: '#/definitions/sslKeyStoreAlias',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
                path: {
                  $ref: '#/definitions/sslKeyStorePath',
                },
              },
              required: ['password', 'path'],
            },
            {
              type: 'object',
              title: 'JKS with content',
              properties: {
                type: {
                  const: 'JKS',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
                alias: {
                  $ref: '#/definitions/sslKeyStoreAlias',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
                content: {
                  $ref: '#/definitions/sslKeyStoreContent',
                },
              },
              required: ['password', 'content'],
            },
            {
              type: 'object',
              title: 'PKCS#12 / PFX with path',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
                alias: {
                  $ref: '#/definitions/sslKeyStoreAlias',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
                path: {
                  $ref: '#/definitions/sslKeyStorePath',
                },
              },
              required: ['password', 'path'],
            },
            {
              type: 'object',
              title: 'PKCS#12 / PFX with content',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
                alias: {
                  $ref: '#/definitions/sslKeyStoreAlias',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
                content: {
                  $ref: '#/definitions/sslKeyStoreContent',
                },
              },
              required: ['password', 'content'],
            },
            {
              type: 'object',
              title: 'PEM with path',
              properties: {
                type: {
                  const: 'PEM',
                },
                certPath: {
                  $ref: '#/definitions/sslKeyStoreCertPath',
                },
                keyPath: {
                  $ref: '#/definitions/sslKeyStoreKeyPath',
                },
              },
              required: ['certPath', 'keyPath'],
            },
            {
              type: 'object',
              title: 'PEM with content',
              properties: {
                type: {
                  const: 'PEM',
                },
                certContent: {
                  $ref: '#/definitions/sslKeyStoreCertContent',
                },
                keyContent: {
                  $ref: '#/definitions/sslKeyStoreKeyContent',
                },
              },
              required: ['certContent', 'keyContent'],
            },
          ],
        },
      },
    },
  },
  properties: {
    target: {
      $ref: '#/definitions/target',
    },
    http: {
      $ref: '#/definitions/http',
    },
    headers: {
      $ref: '#/definitions/headers',
    },
    proxy: {
      $ref: '#/definitions/proxy',
    },
    ssl: {
      $ref: '#/definitions/ssl',
    },
  },
  required: ['target'],
};
