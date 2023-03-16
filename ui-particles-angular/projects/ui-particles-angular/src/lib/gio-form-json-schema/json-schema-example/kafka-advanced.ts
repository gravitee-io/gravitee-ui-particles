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

export const kafkaAdvancedExample: GioJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',

  definitions: {
    bootstrapServers: {
      title: 'Bootstrap servers (bootstrap.servers)',
      description: 'This list should be in the form host1:port1,host2:port2,...',
      type: 'string',
      gioConfig: {
        banner: {
          title: 'Bootstrap servers',
          text: 'A list of host/port pairs, separated by a comma, to use for establishing the initial connection to the Kafka cluster. The client will make use of all servers irrespective of which servers are specified here for bootstrapping—this list only impacts the initial hosts used to discover the full set of servers. ',
        },
      },
    },

    security: {
      type: 'object',
      title: 'Security configuration',

      oneOf: [
        {
          title: 'Protocol PLAINTEXT',
          properties: {
            protocol: {
              const: 'PLAINTEXT',
            },
          },
          additionalProperties: false,
        },
        {
          title: 'Protocol SASL_PLAINTEXT',
          properties: {
            protocol: {
              const: 'SASL_PLAINTEXT',
            },
            sasl: {
              $ref: '#/definitions/securityProtocolSasl',
            },
          },
          additionalProperties: false,
          required: ['sasl'],
        },
        {
          title: 'Protocol SASL_SSL',
          properties: {
            protocol: {
              const: 'SASL_SSL',
            },
            sasl: {
              $ref: '#/definitions/securityProtocolSasl',
            },
            ssl: {
              $ref: '#/definitions/securityProtocolSsl',
            },
          },
          additionalProperties: false,
          required: ['sasl', 'ssl'],
        },
        {
          title: 'Protocol SSL',
          properties: {
            protocol: {
              const: 'SSL',
            },
            ssl: {
              $ref: '#/definitions/securityProtocolSsl',
            },
          },
          additionalProperties: false,
          required: ['ssl'],
        },
      ],
    },
    securityProtocolSasl: {
      type: 'object',
      title: 'SASL configuration',
      properties: {
        saslMechanism: {
          type: 'string',
          title: 'SASL mechanism (sasl.mechanism)',
          description: 'SASL mechanism used for client connections.',
          default: 'GSSAPI',
          enum: ['GSSAPI', 'OAUTHBEARER', 'PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'],
        },
        saslJaasConfig: {
          type: 'string',
          title: 'SASL JAAS Config  (sasl.jaas.config)',
          gioConfig: {
            banner: {
              title: 'SASL JAAS Config',
              text: 'JAAS login context parameters for SASL connections in the format used by JAAS configuration files. JAAS configuration file format is described here. The format for the value is: loginModuleClass controlFlag (optionName=optionValue)*;',
            },
          },
        },
      },
      additionalProperties: false,
      required: ['saslMechanism', 'saslJaasConfig'],
    },
    securityProtocolSsl: {
      type: 'object',
      title: 'SSL configuration',
      properties: {
        trustStore: {
          type: 'object',
          title: 'Truststore',
          oneOf: [
            {
              title: 'PEM with location',
              properties: {
                type: {
                  const: 'PEM',
                },
                location: {
                  $ref: '#/definitions/sslTrustStoreLocation',
                },
              },
              additionalProperties: false,
              required: ['location'],
            },
            {
              title: 'PEM with certificates',
              properties: {
                type: {
                  const: 'PEM',
                },
                certificates: {
                  $ref: '#/definitions/sslTrustStoreCertificates',
                },
              },
              additionalProperties: false,
              required: ['certificates'],
            },
            {
              title: 'JKS with location',
              properties: {
                type: {
                  const: 'JKS',
                },
                location: {
                  $ref: '#/definitions/sslTrustStoreLocation',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
              },
              additionalProperties: false,
              required: ['location', 'password'],
            },
            {
              title: 'JKS with certificates',
              properties: {
                type: {
                  const: 'JKS',
                },
                certificates: {
                  $ref: '#/definitions/sslTrustStoreCertificates',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
              },
              additionalProperties: false,
              required: ['certificates', 'password'],
            },
            {
              title: 'PKCS12 with location',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                location: {
                  $ref: '#/definitions/sslTrustStoreLocation',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
              },
              additionalProperties: false,
              required: ['location', 'password'],
            },
            {
              title: 'PKCS12 with certificates',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                certificates: {
                  $ref: '#/definitions/sslTrustStoreCertificates',
                },
                password: {
                  $ref: '#/definitions/sslTrustStorePassword',
                },
              },
              additionalProperties: false,
              required: ['certificates', 'password'],
            },
          ],
          required: ['type'],
        },
        keyStore: {
          type: 'object',
          title: 'KeyStore',
          oneOf: [
            {
              title: 'PEM with Location',
              properties: {
                type: {
                  const: 'PEM',
                },
                certificateChain: {
                  $ref: '#/definitions/sslKeyStoreCertificateChain',
                },
                location: {
                  $ref: '#/definitions/sslKeyStoreLocation',
                },
              },
              additionalProperties: false,
              required: ['certificateChain'],
            },
            {
              title: 'PEM with Key',
              properties: {
                type: {
                  const: 'PEM',
                },
                certificateChain: {
                  $ref: '#/definitions/sslKeyStoreCertificateChain',
                },
                key: {
                  $ref: '#/definitions/sslKeyStoreKey',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
              },
              additionalProperties: false,
              required: ['certificateChain', 'key', 'keyPassword'],
            },
            {
              title: 'JKS with Location',
              properties: {
                type: {
                  const: 'JKS',
                },
                location: {
                  $ref: '#/definitions/sslKeyStoreLocation',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
              },
              additionalProperties: false,
              required: ['location', 'password'],
            },
            {
              title: 'JKS with Key',
              properties: {
                type: {
                  const: 'JKS',
                },
                key: {
                  $ref: '#/definitions/sslKeyStoreKey',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
              },
              additionalProperties: false,
              required: ['key', 'keyPassword', 'password'],
            },
            {
              title: 'PKCS12 with Location',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                location: {
                  $ref: '#/definitions/sslKeyStoreLocation',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
              },
              additionalProperties: false,
              required: ['location', 'password'],
            },
            {
              title: 'PKCS12 with Key',
              properties: {
                type: {
                  const: 'PKCS12',
                },
                key: {
                  $ref: '#/definitions/sslKeyStoreKey',
                },
                keyPassword: {
                  $ref: '#/definitions/sslKeyStoreKeyPassword',
                },
                password: {
                  $ref: '#/definitions/sslKeyStorePassword',
                },
              },
              additionalProperties: false,
              required: ['key', 'keyPassword', 'password'],
            },
          ],
          required: ['type'],
        },
      },
      required: ['trustStore'],
    },

    sslTrustStoreCertificates: {
      title: 'Certificates (ssl.trustStore.certificates)',
      type: 'string',
      format: 'text',
      gioConfig: {
        banner: {
          title: 'SSL truststore certificated',
          text: "Trusted certificates in the format specified by 'ssl.truststore.type'. Default SSL engine factory supports only PEM format with X.509 certificates.",
        },
      },
    },
    sslTrustStoreLocation: {
      title: 'Location (ssl.trustStore.location)',
      description: 'The location of the trust store file.',
      type: 'string',
    },
    sslTrustStorePassword: {
      title: 'Password (ssl.trustStore.password)',
      type: 'string',
      format: 'password',
      gioConfig: {
        banner: {
          title: 'SSL truststore password',
          text: 'The password for the trust store file. If a password is not set, trust store file configured will still be used, but integrity checking is disabled. Trust store password is not supported for PEM format.',
        },
      },
    },

    sslKeyStoreCertificateChain: {
      title: 'Certificate chain (ssl.keystore.certificate.chain)',
      type: 'string',
      gioConfig: {
        banner: {
          title: 'SSL keystore certificate chain',
          text: "Certificate chain in the format specified by 'ssl.keystore.type'. Default SSL engine factory supports only PEM format with a list of X.509 certificates.",
        },
      },
    },
    sslKeyStoreLocation: {
      title: 'Location (ssl.keystore.location)',
      description: 'The location of the key store file. This is optional for client and can be used for two-way authentication for client.',
      type: 'string',
    },
    sslKeyStoreKey: {
      title: 'Key (ssl.keystore.key)',
      type: 'string',
      format: 'text',
      gioConfig: {
        banner: {
          title: 'SSL keystore private key',
          text: "Private key in the format specified by 'ssl.keystore.type'. Default SSL engine factory supports only PEM format with PKCS#8 keys. If the key is encrypted, key password must be specified using 'ssl.key.password'.",
        },
      },
    },
    sslKeyStoreKeyPassword: {
      title: 'Key password (ssl.key.password)',
      description: 'The password of the private key in the key store file. This is optional for client.',
      type: 'string',
      format: 'password',
    },
    sslKeyStorePassword: {
      title: 'Password (ssl.keystore.password)',
      type: 'string',
      format: 'password',
      gioConfig: {
        banner: {
          title: 'SSL keystore password',
          text: 'The store password for the key store file. This is optional for client and only needed if ssl.keystore.location is configured. Key store password is not supported for PEM format',
        },
      },
    },

    consumer: {
      type: 'object',
      title: 'Consumer',
      properties: {
        enabled: {
          const: true,
        },
        topics: {
          title: 'Topics',
          description: 'A list of kafka topics to use.',
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
        },
        encodeMessageId: {
          title: 'Encode message Id',
          description: 'This options allows encoding message id in base64.',
          type: 'boolean',
          default: true,
        },
        autoOffsetReset: {
          title: 'Auto offset reset (auto.offset.reset)',
          type: 'string',
          default: 'latest',
          enum: ['latest', 'earliest', 'none'],
          gioConfig: {
            banner: {
              title: 'Auto offset reset',
              text: "What to do when there is no initial offset in Kafka or if the current offset does not exist any more on the server (e.g. because that data has been deleted): <ul><li>earliest: automatically reset the offset to the earliest offset<li>latest: automatically reset the offset to the latest offset</li><li>none: throw exception to the consumer if no previous offset is found for the consumer's group</li><li>anything else: throw exception to the consumer.</li></ul>",
            },
          },
        },
      },
      additionalProperties: false,
      required: ['enabled', 'topics'],
    },
    producer: {
      type: 'object',
      title: 'Producer',
      properties: {
        enabled: {
          const: true,
        },
        topics: {
          title: 'Topics',
          description: 'A list of kafka topics to use.',
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
        },
      },
      additionalProperties: false,
      required: ['enabled', 'topics'],
    },
  },

  oneOf: [
    {
      title: 'Use Consumer',
      properties: {
        bootstrapServers: {
          $ref: '#/definitions/bootstrapServers',
        },
        security: {
          $ref: '#/definitions/security',
        },
        consumer: {
          $ref: '#/definitions/consumer',
        },
      },
      required: ['bootstrapServers', 'consumer'],
      additionalProperties: false,
    },
    {
      title: 'Use Producer',
      properties: {
        bootstrapServers: {
          $ref: '#/definitions/bootstrapServers',
        },
        security: {
          $ref: '#/definitions/security',
        },
        producer: {
          $ref: '#/definitions/producer',
        },
      },
      required: ['bootstrapServers', 'producer'],
      additionalProperties: false,
    },
    {
      title: 'Use Consumer and Producer',
      properties: {
        bootstrapServers: {
          $ref: '#/definitions/bootstrapServers',
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
      required: ['bootstrapServers', 'producer', 'consumer'],
      additionalProperties: false,
    },
  ],
};
