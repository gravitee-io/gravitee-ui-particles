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

import { isFunction } from 'lodash';

import { ConnectorInfo } from './ConnectorsInfo';

export function fakeSSEMessageEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'sse',
    name: 'Server-Sent Events',
    supportedModes: ['SUBSCRIBE'],
    icon: 'gio:puzzle',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeWebsocketMessageEntrypoint(
  modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo),
): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'websocket',
    name: 'Websocket',
    supportedModes: ['PUBLISH', 'SUBSCRIBE'],
    icon: 'gio:websocket',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeHTTPPostMessageEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'http-post',
    name: 'HTTP POST',
    supportedModes: ['PUBLISH'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeHTTPGetMessageEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'http-get',
    name: 'HTTP Get',
    supportedModes: ['SUBSCRIBE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeWebhookMessageEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'webhook',
    name: 'Webhook',
    supportedModes: ['SUBSCRIBE'],
    icon: 'gio:webhook',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeHTTPProxyEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'http-proxy',
    name: 'HTTP Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeMockMessageEndpoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'mock',
    name: 'Mock',
    supportedModes: ['PUBLISH', 'SUBSCRIBE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeKafkaMessageEndpoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'kafka',
    name: 'Kafka',
    supportedModes: ['PUBLISH', 'SUBSCRIBE'],
    icon: 'gio:kafka',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeHTTPProxyEndpoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'http-proxy',
    name: 'HTTP Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeKafkaNativeEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'native-kafka',
    name: 'Client',
    supportedModes: ['INTERACT', 'PUBLISH', 'SUBSCRIBE', 'ENTRYPOINT_CONNECT'],
    icon: 'gio:kafka',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeKafkaNativeEndpoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'native-kafka',
    name: 'Broker',
    supportedModes: ['INTERACT', 'PUBLISH', 'SUBSCRIBE', 'ENTRYPOINT_CONNECT'],
    icon: 'gio:kafka',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeMCPProxyEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'mcp-proxy',
    name: 'MCP Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeMCPProxyEndpoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'mcp-proxy',
    name: 'MCP Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeLlmProxyEntrypoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'llm-proxy',
    name: 'LLM Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeLlmProxyEndpoint(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'llm-proxy',
    name: 'LLM Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeA2aProxyConnector(modifier?: Partial<ConnectorInfo> | ((base: ConnectorInfo) => ConnectorInfo)): ConnectorInfo {
  const base: ConnectorInfo = {
    type: 'a2a-proxy',
    name: 'A2A Proxy',
    supportedModes: ['REQUEST_RESPONSE'],
    icon: 'gio:language',
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export const fakeA2aProxyEntrypoint = fakeA2aProxyConnector;
export const fakeA2aProxyEndpoint = fakeA2aProxyConnector;
