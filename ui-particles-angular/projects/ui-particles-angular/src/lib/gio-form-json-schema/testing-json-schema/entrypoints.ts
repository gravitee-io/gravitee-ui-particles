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
// Last update : 19/01/2023
// To update the schemas, Just past output here:
export const entrypointsGetResponse = [
  {
    id: 'http-get',
    name: 'Entrypoint HTTP Get',
    description: 'Entrypoint that allows exposing AsyncAPI using HTTP Get',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: ['resume', 'limit'],
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:http:get:configuration:HttpGetEntrypointConnectorConfiguration",\n    "properties": {\n        "messagesLimitCount": {\n            "type": "integer",\n            "title": "Limit messages count",\n            "description": "Maximum number of messages to retrieve. Default is 500.",\n            "default": 500\n        },\n        "messagesLimitDurationMs": {\n            "type": "number",\n            "title": "Limit messages duration (in ms)",\n            "description": "Maximum duration in milliseconds to wait to retrieve the expected number of messages (See Limit messages count). The effective number of retrieved messages could be less than expected it maximum duration is reached.Default is 5000.",\n            "default": 5000\n        },\n        "headersInPayload": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages headers to client in payload.",\n            "description": "Allow sending messages headers to client in payload. Each header will be sent as extra field in payload. For JSON and XML, in a dedicated headers object. For plain text, following \'key=value\' format. Default is false."\n        },\n        "metadataInPayload": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages metadata to client in payload.",\n            "description": "Allow sending messages metadata to client in payload. Each metadata will be sent as extra field in the payload. For JSON and XML, in a dedicated metadata object. For plain text, following \'key=value\' format. Default is false."\n        }\n    },\n    "additionalProperties": false\n}\n',
  },
  {
    id: 'http-post',
    name: 'Entrypoint HTTP Post',
    description: 'Entrypoint that allows exposing AsyncAPI using HTTP Post',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['publish'],
    availableFeatures: [],
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
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:sse:configuration:SseEntrypointConnectorConfiguration",\n    "properties": {\n        "heartbeatIntervalInMs": {\n            "type": "integer",\n            "default": 5000,\n            "minimum": 2000,\n            "title": "Define the interval in which heartbeat are sent to client.",\n            "description": "Define the interval in which heartbeat are sent to client. Interval must be higher or equal than 2000ms. Each heartbeat will be sent as extra empty comment \':\'"\n        },\n        "metadataAsComment": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages metadata to client as SSE comments.",\n            "description": "Allow sending messages metadata to client as SSE comments. Each metadata will be sent as extra line following \':key=value\' format"\n        },\n        "headersAsComment": {\n            "type": "boolean",\n            "default": false,\n            "title": "Allow sending messages headers to client as SSE comments.",\n            "description": "Allow sending messages headers to client as SSE comments. Each header will be sent as extra line following \':key=value\' format"\n        }\n    }\n}\n',
  },
  {
    id: 'sse-advanced',
    name: 'Entrypoint SSE Advanced',
    description: 'Advanced entrypoint that allows exposing AsyncAPI using SSE connection',
    version: '2.0.0-alpha.5',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: [],
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
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebhookEntrypointConnectorConfiguration",\n    "properties": {},\n    "additionalProperties": false\n}\n',
  },
  {
    id: 'webhook-advanced',
    name: 'Entrypoint Webhook Advanced',
    description: 'Advanced entrypoint that allows exposing AsyncAPI using webhook connection',
    version: '1.0.0-alpha.1',
    supportedApiType: 'async',
    supportedModes: ['subscribe'],
    availableFeatures: ['dlq'],
    schema:
      '{\n  "type": "object",\n  "id": "urn:jsonschema:com:graviteesource:entrypoint:webhook:advanced:configuration:WebhookAdvancedConfiguration",\n  "properties": {},\n  "required": []\n}\n',
  },
  {
    id: 'websocket',
    name: 'Entrypoint Websocket',
    description: 'Entrypoint that allows exposing AsyncAPI using Websocket connection',
    version: '3.21.0-SNAPSHOT',
    supportedApiType: 'async',
    supportedModes: ['subscribe', 'publish'],
    availableFeatures: [],
    schema:
      '{\n    "type": "object",\n    "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebsocketEntrypointConnectorConfiguration",\n    "properties": {\n        "publisher": {\n            "type": "object",\n            "title": "Publisher configuration",\n            "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebsocketEntrypointConnectorConfiguration:Publisher",\n            "properties": {\n                "enabled": {\n                    "title": "Enable the publication capability",\n                    "description": "Allow to enable or disable the publication capability. By disabling it, you assume that the application will never be able to publish any message.",\n                    "type": "boolean",\n                    "default": true\n                }\n            }\n        },\n        "subscriber": {\n            "type": "object",\n            "title": "Subscriber configuration",\n            "id": "urn:jsonschema:io:gravitee:plugin:entrypoint:webhook:configuration:WebsocketEntrypointConnectorConfiguration:Subscriber",\n            "properties": {\n                "enabled": {\n                    "title": "Enable the subscription capability",\n                    "description": "Allow to enable or disable the subscription capability. By disabling it, you assume that the application will never receive any message.",\n                    "type": "boolean",\n                    "default": true\n                }\n            }\n        }\n    },\n    "required": []\n}\n',
  },
];

export const getEntrypointConnectorSchema = (id: string) => {
  const entrypoint = entrypointsGetResponse.find(entrypoint => entrypoint.id === id);
  return entrypoint ? JSON.parse(entrypoint.schema) : {};
};
