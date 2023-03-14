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

export const fakeMqttAdvanced: GioJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  definitions: {
    serverHost: {
      type: 'string',
      title: 'Server host (serverHost)',
      gioConfig: {
        banner: {
          title: 'Server host',
          text: 'Define the host of the MQTT broker.',
        },
      },
    },
    serverPort: {
      type: 'integer',
      title: 'Server port (serverPort)',
      gioConfig: {
        banner: {
          title: 'Server port',
          text: 'Define the port of the MQTT broker.',
        },
      },
    },
    reconnectAttempt: {
      type: 'integer',
      title: 'Reconnect attempt (reconnectAttempt)',
      description: 'Between 0 and 10',
      default: 3,
      minimum: 0,
      maximum: 10,
      gioConfig: {
        banner: {
          title: 'Reconnect attempt',
          text: 'Number of reconnect attempt after any kind of disconnection.',
        },
      },
    },
    sessionExpiryInterval: {
      title: 'Session expiry interval (sessionExpiryInterval)',
      description: 'Minimum 0',
      type: 'integer',
      default: 0,
      minimum: 0,
      gioConfig: {
        banner: {
          title: 'Session expiry interval',
          text: 'This interval defines the period of time that the broker stores the session information of that particular MQTT client. When the session expiry interval is set to 0 or the CONNECT packet does not contain an expiry value, the session information is immediately removed from the broker as soon as the network connection of the client closes.',
        },
      },
    },
    cleanStart: {
      title: 'Clean start (cleanStart)',
      type: 'boolean',
      default: true,
      gioConfig: {
        banner: {
          title: 'Clean start',
          text: 'When using this flag, the broker discards any previous session data and the client starts with a fresh session.',
        },
      },
    },

    sslTrustStoreContent: {
      type: 'string',
      title: 'Content',
      description: 'Binary content as Base64',
      format: 'text',
    },
    sslTrustStorePath: {
      type: 'string',
      title: 'Path',
      description: 'Path to the trust store file',
    },
    sslTrustStorePassword: {
      type: 'string',
      title: 'Password',
      description: 'Trust store password',
      format: 'password',
    },
    sslKeyStorePEMCertPath: {
      type: 'string',
      title: 'Certificate path',
      description: 'Path to cert file (.PEM)',
    },
    sslKeyStorePEMCertContent: {
      type: 'string',
      title: 'Certificate content',
      format: 'text',
    },
    sslKeyStorePEMKeyPath: {
      type: 'string',
      title: 'Key path',
      description: 'Path to private key file (.PEM)',
    },
    sslKeyStorePEMKeyContent: {
      type: 'string',
      title: 'Key content',
      format: 'text',
    },
    sslKeyStoreJKSOrPKCS12Content: {
      type: 'string',
      title: 'Content',
      description: 'Binary content as Base64',
      format: 'text',
    },
    sslKeyStoreJKSOrPKCS12Path: {
      type: 'string',
      title: 'Path',
      description: 'Path to the key store file',
    },
    sslKeyStoreJKSOrPKCS12Password: {
      type: 'string',
      title: 'Password',
      description: 'Key store password',
      format: 'password',
    },

    security: {
      type: 'object',
      title: 'Security',
      anyOf: [
        {
          title: 'Authentication configuration',
          properties: {
            auth: {
              type: 'object',
              title: 'Authentication configuration',
              properties: {
                username: {
                  type: 'string',
                  title: 'Username',
                  description: 'Username used for authentication.',
                },
                password: {
                  type: 'string',
                  title: 'Password',
                  description: 'Password used for authentication.',
                  format: 'password',
                },
              },
              required: ['username', 'password'],
              additionalProperties: false,
            },
          },
        },
        {
          title: 'SSL configuration',
          properties: {
            ssl: {
              type: 'object',
              title: 'SSL configuration',
              properties: {
                hostnameVerifier: {
                  title: 'Hostname verifier (hostnameVerifier)',
                  description: 'Use to enable host name verification',
                  type: 'boolean',
                  default: true,
                },
                trustStore: {
                  type: 'object',
                  title: 'TrustStore',
                  oneOf: [
                    {
                      title: 'PEM with content',
                      properties: {
                        type: {
                          const: 'PEM',
                        },
                        content: {
                          $ref: '#/definitions/sslTrustStoreContent',
                        },
                      },
                      additionalProperties: false,
                      required: ['content'],
                    },
                    {
                      title: 'PEM with path',
                      properties: {
                        type: {
                          const: 'PEM',
                        },
                        path: {
                          $ref: '#/definitions/sslTrustStorePath',
                        },
                      },
                      additionalProperties: false,
                      required: ['path'],
                    },
                    {
                      title: 'JKS with content',
                      properties: {
                        type: {
                          const: 'JKS',
                        },
                        content: {
                          $ref: '#/definitions/sslTrustStoreContent',
                        },
                        password: {
                          $ref: '#/definitions/sslTrustStorePassword',
                        },
                      },
                      additionalProperties: false,
                      required: ['content', 'password'],
                    },
                    {
                      title: 'JKS with path',
                      properties: {
                        type: {
                          const: 'JKS',
                        },
                        path: {
                          $ref: '#/definitions/sslTrustStorePath',
                        },
                        password: {
                          $ref: '#/definitions/sslTrustStorePassword',
                        },
                      },
                      additionalProperties: false,
                      required: ['path', 'password'],
                    },
                    {
                      title: 'PKCS12 with content',
                      properties: {
                        type: {
                          const: 'PKCS12',
                        },
                        content: {
                          $ref: '#/definitions/sslTrustStoreContent',
                        },
                        password: {
                          $ref: '#/definitions/sslTrustStorePassword',
                        },
                      },
                      additionalProperties: false,
                      required: ['content', 'password'],
                    },
                    {
                      title: 'PKCS12 with path',
                      properties: {
                        type: {
                          const: 'PKCS12',
                        },
                        path: {
                          $ref: '#/definitions/sslTrustStorePath',
                        },
                        password: {
                          $ref: '#/definitions/sslTrustStorePassword',
                        },
                      },
                      additionalProperties: false,
                      required: ['path', 'password'],
                    },
                  ],
                  required: ['type'],
                },
                keyStore: {
                  type: 'object',
                  title: 'KeyStore',
                  oneOf: [
                    {
                      title: 'PEM with content',
                      properties: {
                        type: {
                          const: 'PEM',
                        },
                        certContent: {
                          $ref: '#/definitions/sslKeyStorePEMCertContent',
                        },
                        keyContent: {
                          $ref: '#/definitions/sslKeyStorePEMKeyContent',
                        },
                      },
                      additionalProperties: false,
                    },
                    {
                      title: 'PEM with path',
                      properties: {
                        type: {
                          const: 'PEM',
                        },
                        certPath: {
                          $ref: '#/definitions/sslKeyStorePEMCertPath',
                        },
                        keyPath: {
                          $ref: '#/definitions/sslKeyStorePEMKeyPath',
                        },
                      },
                      additionalProperties: false,
                    },
                    {
                      title: 'JKS with content',
                      properties: {
                        type: {
                          const: 'JKS',
                        },
                        content: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Content',
                        },
                        password: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Password',
                        },
                      },
                      additionalProperties: false,
                    },
                    {
                      title: 'JKS with path',
                      properties: {
                        type: {
                          const: 'JKS',
                        },
                        path: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Path',
                        },
                        password: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Password',
                        },
                      },
                      additionalProperties: false,
                    },
                    {
                      title: 'PKCS12 with Content',
                      properties: {
                        type: {
                          const: 'PKCS12',
                        },
                        content: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Content',
                        },
                        password: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Password',
                        },
                      },
                      additionalProperties: false,
                    },
                    {
                      title: 'PKCS12 with Path',
                      properties: {
                        type: {
                          const: 'PKCS12',
                        },
                        path: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Path',
                        },
                        password: {
                          $ref: '#/definitions/sslKeyStoreJKSOrPKCS12Password',
                        },
                      },
                      additionalProperties: false,
                    },
                  ],
                  required: ['type'],
                },
              },
              required: ['trustStore'],
              additionalProperties: false,
            },
          },
        },
      ],
    },

    consumer: {
      type: 'object',
      title: 'Consumer',
      properties: {
        enabled: {
          const: true,
        },
        topic: {
          title: 'Topic (topic)',
          type: 'string',
          gioConfig: {
            banner: {
              title: 'Topic',
              text: 'Refers to an UTF-8 string that the broker uses to filter messages for each connected client. The topic consists of one or more topic levels. Each topic level is separated by a forward slash (topic level separator).',
            },
          },
        },
      },
      additionalProperties: false,
      required: ['enabled', 'topic'],
    },

    producer: {
      type: 'object',
      title: 'Producer',
      properties: {
        enabled: {
          const: true,
        },
        topic: {
          title: 'Topic (topic)',
          type: 'string',
          gioConfig: {
            banner: {
              title: 'Topic',
              text: 'Refers to an UTF-8 string that the broker uses to filter messages for each connected client. The topic consists of one or more topic levels. Each topic level is separated by a forward slash (topic level separator).',
            },
          },
        },
        retained: {
          title: 'Retained (Retained)',
          type: 'boolean',
          default: false,
          gioConfig: {
            banner: {
              title: 'Retained',
              text: 'Define if the retain flag must be set to every publish messages. The broker stores the last retained message.',
            },
          },
        },
        messageExpiryInterval: {
          title: 'Message Expiry Interval (messageExpiryInterval)',
          type: 'integer',
          default: -1,
          gioConfig: {
            banner: {
              title: 'Message Expiry Interval',
              text: 'This interval defines the period of time that the broker stores the PUBLISH message for any matching subscribers that are not currently connected. When no message expiry interval is set, the broker must store the message for matching subscribers indefinitely. When the retained=true option is set on the PUBLISH message, this interval also defines how long a message is retained on a topic.',
            },
          },
        },
        responseTopic: {
          title: 'Response Topic (responseTopic)',
          type: 'string',
          gioConfig: {
            banner: {
              title: 'Response Topic',
              text: 'The response topic represents the topics on which the responses from the receivers of the message are expected.',
            },
          },
        },
      },
      additionalProperties: false,
      required: ['enabled', 'topic'],
    },
  },
  oneOf: [
    {
      title: 'Use Consumer',
      properties: {
        serverHost: {
          $ref: '#/definitions/serverHost',
        },
        serverPort: {
          $ref: '#/definitions/serverPort',
        },
        reconnectAttempt: {
          $ref: '#/definitions/reconnectAttempt',
        },
        sessionExpiryInterval: {
          $ref: '#/definitions/sessionExpiryInterval',
        },
        cleanStart: {
          $ref: '#/definitions/cleanStart',
        },
        security: {
          $ref: '#/definitions/security',
        },
        consumer: {
          $ref: '#/definitions/consumer',
        },
      },
      required: ['serverHost', 'serverPort', 'consumer'],
      additionalProperties: false,
    },
    {
      title: 'Use Producer',
      properties: {
        serverHost: {
          $ref: '#/definitions/serverHost',
        },
        serverPort: {
          $ref: '#/definitions/serverPort',
        },
        reconnectAttempt: {
          $ref: '#/definitions/reconnectAttempt',
        },
        sessionExpiryInterval: {
          $ref: '#/definitions/sessionExpiryInterval',
        },
        cleanStart: {
          $ref: '#/definitions/cleanStart',
        },
        security: {
          $ref: '#/definitions/security',
        },
        producer: {
          $ref: '#/definitions/producer',
        },
      },
      required: ['serverHost', 'serverPort', 'producer'],
      additionalProperties: false,
    },
    {
      title: 'Use Consumer and Producer',
      properties: {
        serverHost: {
          $ref: '#/definitions/serverHost',
        },
        serverPort: {
          $ref: '#/definitions/serverPort',
        },
        reconnectAttempt: {
          $ref: '#/definitions/reconnectAttempt',
        },
        sessionExpiryInterval: {
          $ref: '#/definitions/sessionExpiryInterval',
        },
        cleanStart: {
          $ref: '#/definitions/cleanStart',
        },
        security: {
          $ref: '#/definitions/security',
        },
        producer: {
          $ref: '#/definitions/producer',
        },
        consumer: {
          $ref: '#/definitions/consumer',
        },
      },
      required: ['serverHost', 'serverPort', 'producer', 'consumer'],
      additionalProperties: false,
    },
  ],
};
