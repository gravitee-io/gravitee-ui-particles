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

export const fakeMixed: FormlyJSONSchema7 = {
  type: 'object',
  properties: {
    body: {
      title: 'XML content',
      description:
        'The body content to attach to the request or to the response. You can also make use of freemarker templating engine to map an incoming body content to a new one.',
      type: 'string',
    },
    el: {
      title: 'EL input',
      type: 'string',
      description: 'Add an Expression Language',
    },
    'body-with-el': {
      title: 'XML Content (accept EL)',
      type: 'string',
    },
    'path-operator': {
      title: 'Path operator',
      type: 'object',
      properties: {
        operator: {
          title: 'Operator path',
          description: 'The operator path',
          type: 'string',
          enum: ['EQUALS', 'STARTS_WITH'],
          default: 'STARTS_WITH',
        },
        path: {
          title: 'Path',
          description: 'The path of flow (must start by /)',
          type: 'string',
          pattern: '^/',
        },
      },
      required: ['path', 'operator'],
    },
    resources: {
      title: 'Async list of resource',
      description: "Special field that's dispatch an event after add in DOM, usefull for async load",
      type: 'string',
    },
    'another-list-resources': {
      title: 'Async list of resource',
      description: "Special field that's dispatch an event after add in DOM, usefull for async load",
      type: 'string',
    },
    attributes: {
      type: 'array',
      title: 'Assign context attributes',
      items: {
        type: 'object',
        title: 'Attribute',
        properties: {
          name: {
            title: 'Name',
            description: 'Name of the attribute',
            type: 'string',
          },
          value: {
            title: 'Value',
            description: 'Value of the attribute (support EL)',
            type: 'string',
          },
        },
        required: ['name', 'value'],
      },
    },
    timeToLiveSeconds: {
      title: 'Time to live (in seconds)',
      default: 600,
      description: 'Time to live of the element put in cache (Default to 10 minutes).',
      type: 'integer',
      minimum: 0,
      maximum: 1000,
    },
    useResponseCacheHeaders: {
      title: 'Use response headers',
      description: "Time to live based on 'Cache-Control' and / or 'Expires' headers from response.",
      type: 'boolean',
    },
    select: {
      title: 'Simple select',
      type: 'string',
      enum: ['a', 'b', 'c'],
    },
    multiselect: {
      title: 'Multi select',
      type: 'array',
      items: {
        type: 'string',
        enum: ['a', 'b', 'c'],
      },
    },
    cron: {
      title: 'Cron expression',
      type: 'string',
    },
    disabled: {
      title: "Disabled field if 'Simple select' is 'a'",
      type: 'string',
    },
    'hidden-with-condition': {
      title: "Hidden field if 'Simple select' is 'a'",
      type: 'string',
    },
    hidden: {
      title: 'Hidden field',
      type: 'string',
    },
    readonly: {
      title: 'Readonly field',
      default: 'Should not edit my value',
      description: 'Example for readonly',
      type: 'string',
      readOnly: true,
    },
    writeonly: {
      title: 'Write only field',
      default: 'Should not read my value',
      description: 'Example for writeonly',
      type: 'string',
      writeOnly: true,
    },
    whitelist: {
      title: 'Whitelist',
      type: 'array',
      items: {
        title: 'Rule',
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            title: 'Path pattern',
            description: 'Ant-style path patterns',
          },
          methods: {
            title: 'Methods',
            description: 'HTTP Methods',
            type: 'array',
            items: {
              type: 'string',
              enum: ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'],
            },
          },
        },
        required: ['pattern'],
      },
    },
  },
  required: ['multiselect', 'timeToLiveSeconds'],
  additionalProperties: false,
  patternProperties: {
    'property-to-keep': true,
  },
};
