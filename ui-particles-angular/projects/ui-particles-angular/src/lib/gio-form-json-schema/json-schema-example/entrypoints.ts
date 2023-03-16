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
// Entrypoints plugin configuration
// Extracted from apim master (GET https://apim-master-api.team-apim.gravitee.dev/management/organizations/DEFAULT/environments/DEFAULT/v4/entrypoints?expand=schema)
// Last update : 15/02/2023
// To update the schemas, Just past output here:
export const entrypointsGetResponse = [
  {
    id: 'http-get',
    name: 'Entrypoint HTTP Get',
    description: 'Entrypoint that allows exposing AsyncAPI using HTTP Get',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: ['limit', 'resume'],
    supportedListenerType: 'http',
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:http:get:configuration:HttpGetEntrypointConnectorConfiguration",\n    "properties": {\n        "messagesLimitCount": {\n            "type": "integer",\n            "title": "Limit messages count",\n            "description": "Maximum number of messages to retrieve. Default is 500.",\n            "default": 500\n        },\n        "messagesLimitDurationMs": {\n            "type": "number",\n            "title": "Limit messages duration (in ms)",\n            "description": "Default is 5000.",\n            "default": 5000,\n            "gioConfig": {\n                "banner": {\n                    "title": "Limit messages duration",\n                    "text": "Maximum duration in milliseconds to wait to retrieve the expected number of messages (See Limit messages count). The effective number of retrieved messages could be less than expected it maximum duration is reached."\n                }\n            }\n        },\n        "headersInPayload": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages headers to client in payload",\n            "description": "Default is false.",\n            "gioConfig": {\n                "banner": {\n                    "title": "Allow sending messages headers to client in payload",\n                    "text": "Each header will be sent as extra field in payload. For JSON and XML, in a dedicated headers object. For plain text, following \'key=value\' format. Default is false."\n                }\n            }\n        },\n        "metadataInPayload": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages metadata to client in payload",\n            "description": "Default is false.",\n            "gioConfig": {\n                "banner": {\n                    "title": "Allow sending messages metadata to client in payload",\n                    "text": "Allow sending messages metadata to client in payload. Each metadata will be sent as extra field in the payload. For JSON and XML, in a dedicated metadata object. For plain text, following \'key=value\' format. Default is false."\n                }\n            }\n        }\n    },\n    "additionalProperties": false\n}\n',
  },
  {
    id: 'http-post',
    name: 'Entrypoint HTTP Post',
    description: 'Entrypoint that allows exposing AsyncAPI using HTTP Post',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['publish'],
    availableFeatures: [],
    supportedListenerType: 'http',
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:http:post:configuration:HttpPostEntrypointConnectorConfiguration",\n    "properties": {\n        "requestHeadersToMessage": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow add request Headers to the generated message.",\n            "description": "Allow add request Headers to the generated message. Each headers from incoming request will be added to the generated message headers."\n        }\n    },\n    "additionalProperties": false\n}\n',
  },
  {
    id: 'http-proxy',
    name: 'Entrypoint HTTP Proxy',
    description: 'Entrypoint that allows exposing Http SyncApi',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'sync',
    supportedModes: ['request_response'],
    availableFeatures: [],
    supportedListenerType: 'http',
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:http:proxy:configuration:HttpProxyEntrypointConnectorConfiguration",\n    "properties": {},\n    "additionalProperties": false\n}\n',
  },
  {
    id: 'sse',
    name: 'Entrypoint SSE',
    description: 'Entrypoint that allows exposing AsyncAPI using SSE connection',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: ['resume'],
    supportedListenerType: 'http',
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:sse:configuration:SseEntrypointConnectorConfiguration",\n    "properties": {\n        "heartbeatIntervalInMs": {\n            "type": "integer",\n            "default": 5000,\n            "minimum": 2000,\n            "title": "Define the interval in which heartbeat are sent to client.",\n            "description": "Define the interval in which heartbeat are sent to client. Interval must be higher or equal than 2000ms. Each heartbeat will be sent as extra empty comment \':\'"\n        },\n        "metadataAsComment": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages metadata to client as SSE comments.",\n            "description": "Allow sending messages metadata to client as SSE comments. Each metadata will be sent as extra line following \':key=value\' format"\n        },\n        "headersAsComment": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages headers to client as SSE comments.",\n            "description": "Allow sending messages headers to client as SSE comments. Each header will be sent as extra line following \':key=value\' format"\n        }\n    }\n}\n',
  },
  {
    id: 'sse-advanced',
    name: 'Entrypoint SSE Advanced',
    description: 'Advanced entrypoint that allows exposing AsyncAPI using SSE connection',
    version: '3.0.0-alpha.1',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: [],
    supportedListenerType: 'http',
    schema:
      '{\n  "type": "object",\n  "id": "urn:jsonschema:com:graviteesource:entrypoint:sse:configuration:SseEntrypointConnectorConfiguration",\n  "properties": {\n    "metadataAsComment": {\n      "type": "boolean",\n      "default": false,\n      "title": "Allow sending messages metadata to client as SSE comments.",\n      "description": "Allow sending messages metadata to client as SSE comments. Each metadata will be sent as extra line following \':key=value\' format"\n    },\n    "headersAsComment": {\n      "type": "boolean",\n      "default": false,\n      "title": "Allow sending messages headers to client as SSE comments.",\n      "description": "Allow sending messages headers to client as SSE comments. Each header will be sent as extra line following \':key=value\' format"\n    }\n  }\n}\n',
  },
  {
    id: 'webhook',
    name: 'Entrypoint Webhook',
    description: 'Entrypoint that allows exposing AsyncAPI using Webhook connection',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: [],
    supportedListenerType: 'subscription',
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebhookEntrypointConnectorConfiguration",\n    "properties": {\n        "http": {\n            "type": "object",\n            "title": "HTTP Options",\n            "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:HttpOptions",\n            "properties": {\n                "connectTimeout": {\n                    "type": "integer",\n                    "title": "Connect timeout (ms)",\n                    "description": "Maximum time to connect to the webhook in milliseconds.",\n                    "default": 3000\n                },\n                "readTimeout": {\n                    "type": "integer",\n                    "title": "Read timeout (ms)",\n                    "description": "Maximum time given to the webhook to complete the request (including response) in milliseconds.",\n                    "default": 10000\n                },\n                "idleTimeout": {\n                    "type": "integer",\n                    "title": "Idle timeout (ms)",\n                    "description": "Maximum time a connection will stay in the pool without being used in milliseconds. Once the timeout has elapsed, the unused connection will be closed, allowing to free the associated resources.",\n                    "default": 60000\n                }\n            }\n        },\n        "proxy": {\n            "type": "object",\n            "title": "Proxy Options",\n            "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:HttpProxyOptions",\n            "properties": {\n                "enabled": {\n                    "type": "boolean",\n                    "title": "Use proxy",\n                    "description": "Use proxy for client connections",\n                    "default": false\n                },\n                "type": {\n                    "type": "string",\n                    "title": "Proxy Type",\n                    "description": "The type of the proxy",\n                    "default": "HTTP",\n                    "enum": ["HTTP", "SOCKS4", "SOCKS5"],\n                    "x-schema-form": {\n                        "type": "select",\n                        "titleMap": {\n                            "HTTP": "HTTP CONNECT proxy",\n                            "SOCKS4": "SOCKS4/4a tcp proxy",\n                            "SOCKS5": "SOCKS5 tcp proxy"\n                        },\n                        "hidden": [\n                            {\n                                "$eq": {\n                                    "proxy.enabled": false\n                                }\n                            }\n                        ],\n                        "disabled": [\n                            {\n                                "$eq": {\n                                    "proxy.useSystemProxy": true\n                                }\n                            }\n                        ]\n                    }\n                },\n                "useSystemProxy": {\n                    "type": "boolean",\n                    "title": "Use system proxy",\n                    "description": "Use proxy configured at system level",\n                    "default": false,\n                    "x-schema-form": {\n                        "hidden": [\n                            {\n                                "$eq": {\n                                    "proxy.enabled": false\n                                }\n                            }\n                        ]\n                    }\n                },\n                "host": {\n                    "type": "string",\n                    "title": "Proxy host",\n                    "description": "Proxy host to connect to",\n                    "x-schema-form": {\n                        "hidden": [\n                            {\n                                "$eq": {\n                                    "proxy.enabled": false\n                                }\n                            }\n                        ],\n                        "disabled": [\n                            {\n                                "$eq": {\n                                    "proxy.useSystemProxy": true\n                                }\n                            }\n                        ]\n                    }\n                },\n                "port": {\n                    "type": "integer",\n                    "title": "Proxy port",\n                    "description": "Proxy port to connect to",\n                    "x-schema-form": {\n                        "hidden": [\n                            {\n                                "$eq": {\n                                    "proxy.enabled": false\n                                }\n                            }\n                        ],\n                        "disabled": [\n                            {\n                                "$eq": {\n                                    "proxy.useSystemProxy": true\n                                }\n                            }\n                        ]\n                    }\n                },\n                "username": {\n                    "type": "string",\n                    "title": "Proxy username",\n                    "description": "Optional proxy username",\n                    "x-schema-form": {\n                        "hidden": [\n                            {\n                                "$eq": {\n                                    "proxy.enabled": false\n                                }\n                            }\n                        ],\n                        "disabled": [\n                            {\n                                "$eq": {\n                                    "proxy.useSystemProxy": true\n                                }\n                            }\n                        ]\n                    }\n                },\n                "password": {\n                    "type": "string",\n                    "title": "Proxy password",\n                    "description": "Optional proxy password",\n                    "x-schema-form": {\n                        "type": "password",\n                        "hidden": [\n                            {\n                                "$eq": {\n                                    "proxy.enabled": false\n                                }\n                            }\n                        ],\n                        "disabled": [\n                            {\n                                "$eq": {\n                                    "proxy.useSystemProxy": true\n                                }\n                            }\n                        ]\n                    }\n                }\n            },\n            "oneOf": [\n                {\n                    "properties": { "enabled": { "const": false } }\n                },\n                {\n                    "properties": { "useSystemProxy": { "const": true } }\n                },\n                {\n                    "properties": { "enabled": { "const": true }, "useSystemProxy": { "const": false } },\n                    "required": ["host", "port"]\n                }\n            ]\n        }\n    },\n    "additionalProperties": false\n}\n',
  },
  {
    id: 'webhook-advanced',
    name: 'Entrypoint Webhook Advanced',
    description: 'Advanced entrypoint that allows exposing AsyncAPI using webhook connection',
    version: '1.0.0-alpha.3',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: ['dlq'],
    supportedListenerType: 'subscription',
    schema:
      '{\n  "type": "object",\n  "id": "urn:jsonschema:com:graviteesource:entrypoint:webhook:advanced:configuration:WebhookAdvancedConfiguration",\n  "properties": {\n    "http": {\n      "type": "object",\n      "title": "HTTP Options",\n      "id": "urn:jsonschema:com:graviteesource:entrypoint:webhook:advanced:configuration:HttpOptions",\n      "properties": {\n        "connectTimeout": {\n          "type": "integer",\n          "title": "Connect timeout (ms)",\n          "description": "Maximum time to connect to the webhook in milliseconds.",\n          "default": 3000\n        },\n        "readTimeout": {\n          "type": "integer",\n          "title": "Read timeout (ms)",\n          "description": "Maximum time given to the webhook to complete the request (including response) in milliseconds.",\n          "default": 10000\n        },\n        "idleTimeout": {\n          "type": "integer",\n          "title": "Idle timeout (ms)",\n          "description": "Maximum time a connection will stay in the pool without being used in milliseconds. Once the timeout has elapsed, the unused connection will be closed, allowing to free the associated resources.",\n          "default": 60000\n        }\n      }\n    },\n    "proxy": {\n      "type": "object",\n      "title": "Proxy Options",\n      "id": "urn:jsonschema:com:graviteesource:entrypoint:webhook:advanced:configuration:HttpProxyOptions",\n      "properties": {\n        "enabled": {\n          "type": "boolean",\n          "title": "Use proxy",\n          "description": "Use proxy for client connections",\n          "default": false\n        },\n        "type": {\n          "type": "string",\n          "title": "Proxy Type",\n          "description": "The type of the proxy",\n          "default": "HTTP",\n          "enum": ["HTTP", "SOCKS4", "SOCKS5"],\n          "x-schema-form": {\n            "type": "select",\n            "titleMap": {\n              "HTTP": "HTTP CONNECT proxy",\n              "SOCKS4": "SOCKS4/4a tcp proxy",\n              "SOCKS5": "SOCKS5 tcp proxy"\n            },\n            "hidden": [\n              {\n                "$eq": {\n                  "proxy.enabled": false\n                }\n              }\n            ],\n            "disabled": [\n              {\n                "$eq": {\n                  "proxy.useSystemProxy": true\n                }\n              }\n            ]\n          }\n        },\n        "useSystemProxy": {\n          "type": "boolean",\n          "title": "Use system proxy",\n          "description": "Use proxy configured at system level",\n          "default": false,\n          "x-schema-form": {\n            "hidden": [\n              {\n                "$eq": {\n                  "proxy.enabled": false\n                }\n              }\n            ]\n          }\n        },\n        "host": {\n          "type": "string",\n          "title": "Proxy host",\n          "description": "Proxy host to connect to",\n          "x-schema-form": {\n            "hidden": [\n              {\n                "$eq": {\n                  "proxy.enabled": false\n                }\n              }\n            ],\n            "disabled": [\n              {\n                "$eq": {\n                  "proxy.useSystemProxy": true\n                }\n              }\n            ]\n          }\n        },\n        "port": {\n          "type": "integer",\n          "title": "Proxy port",\n          "description": "Proxy port to connect to",\n          "x-schema-form": {\n            "hidden": [\n              {\n                "$eq": {\n                  "proxy.enabled": false\n                }\n              }\n            ],\n            "disabled": [\n              {\n                "$eq": {\n                  "proxy.useSystemProxy": true\n                }\n              }\n            ]\n          }\n        },\n        "username": {\n          "type": "string",\n          "title": "Proxy username",\n          "description": "Optional proxy username",\n          "x-schema-form": {\n            "hidden": [\n              {\n                "$eq": {\n                  "proxy.enabled": false\n                }\n              }\n            ],\n            "disabled": [\n              {\n                "$eq": {\n                  "proxy.useSystemProxy": true\n                }\n              }\n            ]\n          }\n        },\n        "password": {\n          "type": "string",\n          "title": "Proxy password",\n          "description": "Optional proxy password",\n          "x-schema-form": {\n            "type": "password",\n            "hidden": [\n              {\n                "$eq": {\n                  "proxy.enabled": false\n                }\n              }\n            ],\n            "disabled": [\n              {\n                "$eq": {\n                  "proxy.useSystemProxy": true\n                }\n              }\n            ]\n          }\n        }\n      },\n      "oneOf": [\n        {\n          "properties": { "enabled": { "const": false } }\n        },\n        {\n          "properties": { "useSystemProxy": { "const": true } }\n        },\n        {\n          "properties": { "enabled": { "const": true }, "useSystemProxy": { "const": false } },\n          "required": ["host", "port"]\n        }\n      ]\n    }\n  },\n  "required": []\n}\n',
  },
  {
    id: 'websocket',
    name: 'Entrypoint Websocket',
    description: 'Entrypoint that allows exposing AsyncAPI using Websocket connection',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['subscribe', 'publish'],
    availableFeatures: [],
    supportedListenerType: 'http',
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebsocketEntrypointConnectorConfiguration",\n    "properties": {\n        "publisher": {\n            "type": "object",\n            "title": "Publisher configuration",\n            "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebsocketEntrypointConnectorConfiguration:Publisher",\n            "properties": {\n                "enabled": {\n                    "title": "Enable the publication capability",\n                    "description": "Allow to enable or disable the publication capability. By disabling it, you assume that the application will never be able to publish any message.",\n                    "type": "boolean",\n                    "default": true\n                }\n            }\n        },\n        "subscriber": {\n            "type": "object",\n            "title": "Subscriber configuration",\n            "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebsocketEntrypointConnectorConfiguration:Subscriber",\n            "properties": {\n                "enabled": {\n                    "title": "Enable the subscription capability",\n                    "description": "Allow to enable or disable the subscription capability. By disabling it, you assume that the application will never receive any message.",\n                    "type": "boolean",\n                    "default": true\n                }\n            }\n        }\n    },\n    "required": []\n}\n',
  },
];

export const getEntrypointConnectorSchema = (id: string) => {
  const entrypoint = entrypointsGetResponse.find(entrypoint => entrypoint.id === id);
  return entrypoint ? JSON.parse(entrypoint.schema) : {};
};
