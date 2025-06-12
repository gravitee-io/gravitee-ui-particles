/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { TestBed } from '@angular/core/testing';

import { GioElService } from './gio-el.service';

describe('GioElService', () => {
  let service: GioElService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GioElService],
    });
    service = TestBed.inject(GioElService);
  });

  it('should convert conditions to jsonSchema', () => {
    service.setElProperties('api', [
      {
        field: 'api',
        label: 'Api',
        properties: [
          {
            field: 'id',
            label: 'Id',
            type: 'string',
          },
          {
            field: 'name',
            label: 'Name',
            type: 'string',
          },
          {
            field: 'properties',
            label: 'Properties',
            type: 'Map',
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'version',
            label: 'Version',
            type: 'string',
          },
        ],
      },
    ]);

    service.setElProperties('context', [
      {
        field: 'context',
        label: 'Context',
        properties: [
          {
            field: 'attributes',
            label: 'Attributes',
            type: 'Map',
            valueProperty: {
              type: 'string',
            },
          },
        ],
      },
    ]);

    service.setElProperties('dictionaries', [
      {
        field: 'dictionaries',
        label: 'Dictionaries',
        type: 'MultiMap',
        valueProperty: {
          type: 'string',
        },
      },
    ]);

    service.setElProperties('node', [
      {
        field: 'node',
        label: 'Node',
        properties: [
          {
            field: 'id',
            label: 'Id',
            type: 'string',
          },
          {
            field: 'shardingTags',
            label: 'Shared Tags',
            type: 'Map', // FIXME: Array ?
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'tenant',
            label: 'Tenant',
            type: 'string',
          },
          {
            field: 'version',
            label: 'Version',
            type: 'string',
          },
          {
            field: 'zone',
            label: 'Zone',
            type: 'string',
          },
        ],
      },
    ]);

    service.setElProperties('request', [
      {
        field: 'request',
        label: 'Request',
        properties: [
          {
            field: 'id',
            label: 'Id',
            type: 'string',
          },
          {
            field: 'timestamp',
            label: 'Timestamp',
            type: 'number',
          },
          {
            field: 'content',
            label: 'Content',
            type: 'string',
          },
          {
            field: 'headers',
            label: 'HTTP Headers',
            type: 'MultiMap',
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'host',
            label: 'Host',
            type: 'string',
          },
          {
            field: 'method',
            label: 'Method',
            type: 'string',
          },
          {
            field: 'params',
            label: 'Params',
            type: 'MultiMap',
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'uri',
            label: 'URI',
            type: 'string',
          },
          {
            field: 'scheme',
            label: 'Scheme',
            type: 'string',
          },
          {
            field: 'path',
            label: 'Path',
            type: 'string',
          },
          {
            field: 'contextPath',
            label: 'Context Path',
            type: 'string',
          },
          {
            field: 'pathInfo',
            label: 'Path Info',
            type: 'string',
          },
          {
            field: 'pathInfos',
            label: 'Path Infos',
            type: 'Map',
            valueProperty: {
              type: 'string',
            }, // FIXME: Array ?
          },
          {
            field: 'pathParams',
            label: 'Path Params',
            type: 'MultiMap',
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'paths',
            label: 'Paths',
            type: 'Map',
            valueProperty: {
              type: 'string',
            }, // FIXME: Array ?
          },
          {
            field: 'transactionId',
            label: 'TransactionId',
            type: 'string',
          },
          {
            field: 'version',
            label: 'Version',
            type: 'string',
          },
          {
            field: 'localAddress',
            label: 'Local Address',
            type: 'string',
          },
          {
            field: 'remoteAddress',
            label: 'Remote Address',
            type: 'string',
          },
          {
            field: 'ssl',
            label: 'SSL',
            properties: [
              {
                field: 'client',
                label: 'Client',
                type: 'string', // FIXME: his is an object ?
              },
              {
                field: 'clientHost',
                label: 'Client Host',
                type: 'string',
              },
              {
                field: 'clientPort',
                label: 'Client Port',
                type: 'number',
              },
              {
                field: 'server',
                label: 'Server',
                type: 'string', // FIXME: his is an object ?
              },
            ],
          },
        ],
      },
    ]);

    service.setElProperties('response', [
      {
        field: 'response',
        label: 'Response',
        properties: [
          {
            field: 'content',
            label: 'Content',
            type: 'string',
          },
          {
            field: 'headers',
            label: 'HTTP Headers',
            type: 'MultiMap',
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'jsonContent',
            label: 'JSON Content',
            type: 'string', // FIXME: this is an object ?
          },
          {
            field: 'status',
            label: 'Status',
            type: 'number',
          },
          {
            field: 'xmlContent',
            label: 'XML Content',
            type: 'Map', // FIXME: this is an object ?
            valueProperty: {
              type: 'string',
            }, // FIXME: this is an object ?
          },
        ],
      },
    ]);

    service.setElProperties('subscription', [
      {
        field: 'subscription',
        label: 'Subscription',
        properties: [
          {
            field: 'id',
            label: 'Id',
            type: 'string',
          },
          {
            field: 'api',
            label: 'API Id',
            type: 'string',
          },
          {
            field: 'plan',
            label: 'Plan Id',
            type: 'string',
          },
          {
            field: 'metadata',
            label: 'Metadata',
            type: 'Map',
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'type',
            label: 'Type',
            type: 'string',
            values: ['STANDARD', 'PUSH'],
          },
        ],
      },
    ]);

    let toExpect;
    service
      .getElPropertiesJsonSchema(['api', 'context', 'dictionaries', 'node', 'request', 'response', 'subscription'])
      .subscribe(conditions => (toExpect = conditions));

    expect(toExpect).toEqual({
      api: {
        title: 'Api',
        type: 'object',
        properties: {
          id: {
            title: 'Id',
            type: 'string',
          },
          name: {
            title: 'Name',
            type: 'string',
          },
          properties: {
            title: 'Properties',
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          version: {
            title: 'Version',
            type: 'string',
          },
        },
      },
      context: {
        title: 'Context',
        type: 'object',
        properties: {
          attributes: {
            title: 'Attributes',
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
        },
      },
      dictionaries: {
        additionalProperties: {
          items: {
            type: 'string',
          },
          type: 'array',
        },
        title: 'Dictionaries',
        type: 'object',
      },
      node: {
        properties: {
          id: {
            title: 'Id',
            type: 'string',
          },
          shardingTags: {
            additionalProperties: {
              type: 'string',
            },
            title: 'Shared Tags',
            type: 'object',
          },
          tenant: {
            title: 'Tenant',
            type: 'string',
          },
          version: {
            title: 'Version',
            type: 'string',
          },
          zone: {
            title: 'Zone',
            type: 'string',
          },
        },
        title: 'Node',
        type: 'object',
      },
      request: {
        properties: {
          content: {
            title: 'Content',
            type: 'string',
          },
          contextPath: {
            title: 'Context Path',
            type: 'string',
          },
          headers: {
            additionalProperties: {
              items: {
                type: 'string',
              },
              type: 'array',
            },
            title: 'HTTP Headers',
            type: 'object',
          },
          host: {
            title: 'Host',
            type: 'string',
          },
          id: {
            title: 'Id',
            type: 'string',
          },
          localAddress: {
            title: 'Local Address',
            type: 'string',
          },
          method: {
            title: 'Method',
            type: 'string',
          },
          params: {
            additionalProperties: {
              items: {
                type: 'string',
              },
              type: 'array',
            },
            title: 'Params',
            type: 'object',
          },
          path: {
            title: 'Path',
            type: 'string',
          },
          pathInfo: {
            title: 'Path Info',
            type: 'string',
          },
          pathInfos: {
            additionalProperties: {
              type: 'string',
            },
            title: 'Path Infos',
            type: 'object',
          },
          pathParams: {
            additionalProperties: {
              items: {
                type: 'string',
              },
              type: 'array',
            },
            title: 'Path Params',
            type: 'object',
          },
          paths: {
            additionalProperties: {
              type: 'string',
            },
            title: 'Paths',
            type: 'object',
          },
          remoteAddress: {
            title: 'Remote Address',
            type: 'string',
          },
          scheme: {
            title: 'Scheme',
            type: 'string',
          },
          ssl: {
            properties: {
              client: {
                title: 'Client',
                type: 'string',
              },
              clientHost: {
                title: 'Client Host',
                type: 'string',
              },
              clientPort: {
                title: 'Client Port',
                type: 'number',
              },
              server: {
                title: 'Server',
                type: 'string',
              },
            },
            title: 'SSL',
            type: 'object',
          },
          timestamp: {
            title: 'Timestamp',
            type: 'number',
          },
          transactionId: {
            title: 'TransactionId',
            type: 'string',
          },
          uri: {
            title: 'URI',
            type: 'string',
          },
          version: {
            title: 'Version',
            type: 'string',
          },
        },
        title: 'Request',
        type: 'object',
      },
      response: {
        properties: {
          content: {
            title: 'Content',
            type: 'string',
          },
          headers: {
            additionalProperties: {
              items: {
                type: 'string',
              },
              type: 'array',
            },
            title: 'HTTP Headers',
            type: 'object',
          },
          jsonContent: {
            title: 'JSON Content',
            type: 'string',
          },
          status: {
            title: 'Status',
            type: 'number',
          },
          xmlContent: {
            additionalProperties: {
              type: 'string',
            },
            title: 'XML Content',
            type: 'object',
          },
        },
        title: 'Response',
        type: 'object',
      },
      subscription: {
        properties: {
          id: {
            title: 'Id',
            type: 'string',
          },
          api: {
            title: 'API Id',
            type: 'string',
          },
          plan: {
            title: 'Plan Id',
            type: 'string',
          },
          metadata: {
            additionalProperties: {
              type: 'string',
            },
            title: 'Metadata',
            type: 'object',
          },
          type: {
            title: 'Type',
            type: 'string',
          },
        },
        title: 'Subscription',
        type: 'object',
      },
    });
  });
});
