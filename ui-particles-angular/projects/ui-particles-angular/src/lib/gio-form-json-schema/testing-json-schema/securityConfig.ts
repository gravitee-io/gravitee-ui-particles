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

export const fakeSecurityConfig: FormlyJSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  definitions: {
    contentOrPath: {
      oneOf: [
        {
          title: 'Content',
          properties: {
            content: {
              title: 'Content',
              description: 'Binary content as Base64',
              type: 'string',
            },
          },
          required: ['content'],
        },
        {
          title: 'Path to trust store',
          properties: {
            path: {
              title: 'Path to trust store',
              description: 'Path to the trust store file',
              type: 'string',
            },
          },
          required: ['path'],
        },
      ],
    },
    certContent: {
      properties: {
        certContent: {
          type: 'string',
          title: 'Certificate',
        },
      },
      required: ['certContent'],
    },
    certPath: {
      properties: {
        certPath: {
          type: 'string',
          title: 'Path to cert file',
          description: 'Path to cert file (.PEM)',
        },
      },
      required: ['certPath'],
    },
    keyContent: {
      properties: {
        keyContent: {
          type: 'string',
          title: 'Private key',
        },
      },
      required: ['keyContent'],
    },
    keyPath: {
      properties: {
        keyPath: {
          type: 'string',
          title: 'Path to private key file',
          description: 'Path to private key file (.PEM)',
        },
      },
      required: ['keyPath'],
    },
    certContentOrPath: {
      oneOf: [
        {
          title: 'With certificate content',
          properties: {
            certContent: {
              type: 'string',
              title: 'Certificate',
            },
          },
          required: ['certContent'],
        },
        {
          title: 'With certificate path',
          properties: {
            certPath: {
              type: 'string',
              title: 'Path to cert file',
              description: 'Path to cert file (.PEM)',
            },
          },
          required: ['certPath'],
        },
      ],
    },
    keyContentOrPath: {
      oneOf: [
        {
          title: 'With key content',
          properties: {
            keyContent: {
              type: 'string',
              title: 'Private key',
            },
          },
          required: ['keyContent'],
        },
        {
          title: 'With key path',
          properties: {
            keyPath: {
              type: 'string',
              title: 'Path to private key file',
              description: 'Path to private key file (.PEM)',
            },
          },
          required: ['keyPath'],
        },
      ],
    },
  },

  properties: {
    security: {
      type: 'object',
      title: 'Security configuration',
      properties: {
        ssl: {
          type: 'object',
          title: 'SSL configuration',
          properties: {
            trustStore: {
              type: 'object',
              title: 'Trust Store',
              properties: {
                type: {
                  title: 'Type',
                  description: 'The type of the trust store',
                  default: '',
                  // enum: ['', 'JKS', 'PKCS12', 'PEM'],

                  oneOf: [
                    { const: 'JKS', title: 'Java Trust Store (.jks)' },
                    { const: 'PKCS12', title: 'PKCS#12 (.p12) / PFX (.pfx)' },
                    { const: 'PEM', title: 'PEM (.pem)' },
                  ],
                },
              },
              dependencies: {
                type: {
                  oneOf: [
                    {
                      properties: {
                        type: {
                          const: '',
                        },
                      },
                    },
                    {
                      properties: {
                        type: {
                          const: 'PEM',
                        },
                      },
                      $ref: '#/definitions/contentOrPath',
                    },
                    {
                      properties: {
                        type: {
                          const: 'JKS',
                        },
                        password: {
                          type: 'string',
                          title: 'Password',
                          description: 'Trust store password',
                        },
                      },
                      $ref: '#/definitions/contentOrPath',
                      required: ['password'],
                    },
                    {
                      properties: {
                        type: {
                          const: 'PKCS12',
                        },
                        password: {
                          type: 'string',
                          title: 'Password',
                          description: 'Trust store password',
                        },
                      },
                      $ref: '#/definitions/contentOrPath',
                      required: ['password'],
                    },
                  ],
                },
              },

              //   oneOf: [
              //     {
              //       properties: {
              //         type: {
              //           const: '',
              //         },
              //       },
              //     },
              //     {
              //       properties: {
              //         type: {
              //           const: 'PEM',
              //         },
              //       },
              //       required: ['content'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           const: 'PEM',
              //         },
              //       },
              //       required: ['path'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           pattern: 'JKS|PKCS12',
              //         },
              //       },
              //       required: ['content', 'password'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           pattern: 'JKS|PKCS12',
              //         },
              //       },
              //       required: ['path', 'password'],
              //     },
              //   ],
            },
            keyStore: {
              type: 'object',
              title: 'Key store',
              properties: {
                type: {
                  title: 'Type',
                  description: 'The type of the key store',
                  default: null,
                  enum: [null, 'JKS', 'PKCS12', 'PEM'],
                },
                // password: {
                //   type: 'string',
                //   title: 'Password',
                //   description: 'Key store password',
                // },
                // path: {
                //   type: 'string',
                //   title: 'Path to key store',
                //   description: 'Path to the key store file',
                // },
                // content: {
                //   type: 'string',
                //   title: 'Content',
                //   description: 'Binary content as Base64',
                // },
                // certPath: {
                //   type: 'string',
                //   title: 'Path to cert file',
                //   description: 'Path to cert file (.PEM)',
                // },
                // certContent: {
                //   type: 'string',
                //   title: 'Certificate',
                // },
                // keyPath: {
                //   type: 'string',
                //   title: 'Path to private key file',
                //   description: 'Path to private key file (.PEM)',
                // },
                // keyContent: {
                //   type: 'string',
                //   title: 'Private key',
                // },
              },
              dependencies: {
                type: {
                  oneOf: [
                    {
                      properties: {
                        type: {
                          const: null,
                        },
                      },
                    },
                    {
                      properties: {
                        type: {
                          const: 'PEM',
                        },
                      },
                      oneOf: [
                        {
                          title: 'With cert and key content',
                          allOf: [{ $ref: '#/definitions/certContent' }, { $ref: '#/definitions/keyContent' }],
                        },
                        {
                          title: 'With cert and key path',
                          allOf: [{ $ref: '#/definitions/certPath' }, { $ref: '#/definitions/keyPath' }],
                        },
                        {
                          title: 'With cert path and key content',
                          allOf: [{ $ref: '#/definitions/certPath' }, { $ref: '#/definitions/keyContent' }],
                        },
                        {
                          title: 'With cert content and key path',
                          allOf: [{ $ref: '#/definitions/certContent' }, { $ref: '#/definitions/keyPath' }],
                        },
                      ],
                    },
                    {
                      properties: {
                        type: {
                          const: 'JKS',
                        },
                      },
                      allOf: [
                        {
                          properties: {
                            password: {
                              type: 'string',
                              title: 'Password',
                              description: 'Trust store password',
                            },
                          },
                        },
                        { $ref: '#/definitions/contentOrPath' },
                      ],
                      required: ['password'],
                    },
                    {
                      properties: {
                        type: {
                          const: 'PKCS12',
                        },
                      },
                      allOf: [
                        {
                          properties: {
                            password: {
                              type: 'string',
                              title: 'Password',
                              description: 'Trust store password',
                            },
                          },
                        },
                        { $ref: '#/definitions/contentOrPath' },
                      ],
                      required: ['password'],
                    },
                  ],
                },
              },
              //   oneOf: [
              //     {
              //       properties: {
              //         type: {
              //           const: '',
              //         },
              //       },
              //     },
              //     {
              //       properties: {
              //         type: {
              //           const: 'PEM',
              //         },
              //       },
              //       required: ['certContent', 'keyContent'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           const: 'PEM',
              //         },
              //       },
              //       required: ['certPath', 'keyPath'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           const: 'PEM',
              //         },
              //       },
              //       required: ['certContent', 'keyPath'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           const: 'PEM',
              //         },
              //       },
              //       required: ['certPath', 'keyContent'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           pattern: 'JKS|PKCS12',
              //         },
              //       },
              //       required: ['content', 'password'],
              //     },
              //     {
              //       properties: {
              //         type: {
              //           pattern: 'JKS|PKCS12',
              //         },
              //       },
              //       required: ['path', 'password'],
              //     },
              //   ],
            },
          },
        },
      },
    },
  },
  required: [],
};
