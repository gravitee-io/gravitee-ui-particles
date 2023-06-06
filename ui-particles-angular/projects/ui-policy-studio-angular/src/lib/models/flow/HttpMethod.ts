/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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

export const HttpMethods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE', 'OTHER'] as const;
export type HttpMethod = (typeof HttpMethods)[number];

export const toHttpMethod: (value: string) => HttpMethod | undefined = (value: string) => {
  switch (value) {
    case 'CONNECT':
      return 'CONNECT';
    case 'DELETE':
      return 'DELETE';
    case 'GET':
      return 'GET';
    case 'HEAD':
      return 'HEAD';
    case 'OPTIONS':
      return 'OPTIONS';
    case 'PATCH':
      return 'PATCH';
    case 'POST':
      return 'POST';
    case 'PUT':
      return 'PUT';
    case 'TRACE':
      return 'TRACE';
    case 'OTHER':
      return 'OTHER';
    default:
      return undefined;
  }
};
