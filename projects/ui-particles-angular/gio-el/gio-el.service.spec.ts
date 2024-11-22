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
            type: 'string',
            map: {
              type: 'Map',
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
            type: 'string',
            map: {
              type: 'Map',
            },
          },
        ],
      },
    ]);

    let toExpect;
    service.getElPropertiesJsonSchema(['api', 'context']).subscribe(conditions => (toExpect = conditions));

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
            type: 'string',
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
            type: 'string',
          },
        },
      },
    });
  });
});

// eslint-disable-next-line
const jsonOutput = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $defs: {
    SSLPrincipal: {
      type: 'object',
      properties: {
        attributes: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        businessCategory: {
          type: 'string',
        },
        c: {
          type: 'string',
        },
        cn: {
          type: 'string',
        },
        countryOfCitizenship: {
          type: 'string',
        },
        countryOfResidence: {
          type: 'string',
        },
        dateOfBirth: {
          type: 'string',
        },
        dc: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        dmdName: {
          type: 'string',
        },
        dn: {
          type: 'string',
        },
        dnQualifier: {
          type: 'string',
        },
        e: {
          type: 'string',
        },
        emailAddress: {
          type: 'string',
        },
        gender: {
          type: 'string',
        },
        generation: {
          type: 'string',
        },
        givenname: {
          type: 'string',
        },
        initials: {
          type: 'string',
        },
        l: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        nameAtBirth: {
          type: 'string',
        },
        o: {
          type: 'string',
        },
        organizationIdentifier: {
          type: 'string',
        },
        ou: {
          type: 'string',
        },
        placeOfBirth: {
          type: 'string',
        },
        postalAddress: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
        pseudonym: {
          type: 'string',
        },
        role: {
          type: 'string',
        },
        serialnumber: {
          type: 'string',
        },
        st: {
          type: 'string',
        },
        street: {
          type: 'string',
        },
        surname: {
          type: 'string',
        },
        t: {
          type: 'string',
        },
        telephoneNumber: {
          type: 'string',
        },
        uid: {
          type: 'string',
        },
        uniqueIdentifier: {
          type: 'string',
        },
        unstructuredAddress: {
          type: 'string',
        },
      },
    },
    HttpHeaders: {
      type: 'object',
      additionalProperties: {
        type: 'string',
        enum: [
          'Accept',
          'Accept-Charset',
          'Accept-Encoding',
          'Accept-Language',
          'Accept-Ranges',
          'Access-Control-Allow-Credentials',
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Methods',
          'Access-Control-Allow-Origin',
          'Access-Control-Expose-Headers',
          'Access-Control-Max-Age',
          'Access-Control-Request-Headers',
          'Access-Control-Request-Method',
          'Age',
          'Allow',
          'Authorization',
          'Cache-Control',
          'Connection',
          'Content-Disposition',
          'Content-Encoding',
          'Content-ID',
          'Content-Language',
          'Content-Length',
          'Content-Location',
          'Content-MD5',
          'Content-Range',
          'Content-Type',
          'Cookie',
          'Date',
          'ETag',
          'Expires',
          'Expect',
          'Forwarded',
          'From',
          'Host',
          'If-Match',
          'If-Modified-Since',
          'If-None-Match',
          'If-Unmodified-Since',
          'Keep-Alive',
          'Last-Modified',
          'Location',
          'Link',
          'Max-Forwards',
          'MIME-Version',
          'Origin',
          'Pragma',
          'Proxy-Authenticate',
          'Proxy-Authorization',
          'Proxy-Connection',
          'Range',
          'Referer',
          'Retry-After',
          'Server',
          'Set-Cookie',
          'Set-Cookie2',
          'TE',
          'Trailer',
          'Transfer-Encoding',
          'Upgrade',
          'User-Agent',
          'Vary',
          'Via',
          'Warning',
          'WWW-Authenticate',
          'X-Forwarded-For',
          'X-Forwarded-Proto',
          'X-Forwarded-Server',
          'X-Forwarded-Host',
          'X-Forwarded-Port',
          'X-Forwarded-Prefix',
        ],
      },
    },
  },
  type: 'object',
  properties: {
    api: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        properties: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
        version: {
          type: 'string',
        },
      },
    },
    context: {
      type: 'object',
      properties: {
        attributes: {
          type: 'object',
          additionalProperties: {
            type: 'object',
          },
        },
      },
    },
    dictionaries: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'string',
        },
      },
    },
    node: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        shardingTags: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        tenant: {
          type: 'string',
        },
        version: {
          type: 'string',
        },
        zone: {
          type: 'string',
        },
      },
    },
    request: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
        },
        contextPath: {
          type: 'string',
        },
        headers: {
          $ref: '#/$defs/HttpHeaders',
        },
        host: {
          type: 'string',
        },
        id: {
          type: 'string',
        },
        jsonContent: {
          type: 'object',
          additionalProperties: {
            type: 'object',
          },
        },
        localAddress: {
          type: 'string',
        },
        method: {
          type: 'string',
        },
        params: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        path: {
          type: 'string',
        },
        pathInfo: {
          type: 'string',
        },
        pathInfos: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        pathParams: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        paths: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        remoteAddress: {
          type: 'string',
        },
        scheme: {
          type: 'string',
        },
        ssl: {
          type: 'object',
          properties: {
            client: {
              $ref: '#/$defs/SSLPrincipal',
            },
            clientHost: {
              type: 'string',
            },
            clientPort: {
              type: 'integer',
            },
            server: {
              $ref: '#/$defs/SSLPrincipal',
            },
          },
        },
        timestamp: {
          type: 'integer',
        },
        transactionId: {
          type: 'string',
        },
        uri: {
          type: 'string',
        },
        version: {
          type: 'string',
        },
        xmlContent: {
          type: 'object',
          additionalProperties: {
            type: 'object',
          },
        },
      },
    },
    response: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
        },
        headers: {
          $ref: '#/$defs/HttpHeaders',
        },
        jsonContent: {
          type: 'object',
          additionalProperties: {
            type: 'object',
          },
        },
        status: {
          type: 'integer',
        },
        xmlContent: {
          type: 'object',
          additionalProperties: {
            type: 'object',
          },
        },
      },
    },
    subscription: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        metadata: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
        type: {
          type: 'string',
          enum: ['STANDARD', 'PUSH'],
        },
      },
    },
  },
};

/*
result = {HashMap@18830}  size = 11
 "request" -> {EvaluableRequest@18848}
  key = "request"
  value = {EvaluableRequest@18848}
   request = {VertxHttpServerRequest@18778}
    nativeRequest = {HttpServerRequest@18883} "io.vertx.core.http.impl.Http1xServerRequest@138bf167"
    isWebSocket = {Boolean@18884} false
    isStreaming = {Boolean@18884} false
    options = {VertxHttpServerRequest$VertxHttpServerRequestOptions@18885} "VertxHttpServerRequestOptions[clientAuthHeaderName=null]"
    bufferFlow = {BufferFlow@18886}
    messageFlow = null
    id = "917f84e9-62ba-498b-bf84-e962bac98bf6"
    transactionId = "917f84e9-62ba-498b-bf84-e962bac98bf6"
    clientIdentifier = "12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0"
    uri = "/703b2a9d-8c7b-4444-bb2a-9d8c7bf44465-echo-v2/"
    host = null
    originalHost = "localhost:8482"
    path = "/echo-v2/"
    pathInfo = "/"
    contextPath = "/echo-v2/"
    parameters = {LinkedMultiValueMap@18894}  size = 0
    pathParameters = {LinkedMultiValueMap@18895}  size = 0
    headers = {VertxHttpHeaders@18896}  size = 4
    method = {HttpMethod@18897} "OTHER"
    scheme = "http"
    version = {HttpVersion@24906} "HTTP_1_1"
    timestamp = 1729671155379
    remoteAddress = "127.0.0.1"
    localAddress = "127.0.0.1"
    sslSession = null
    tlsSession = {DefaultTlsSession@24907}
    ended = false
    webSocket = null
   content = null
   jsonContent = null
   xmlContent = null
 "node" -> {NodeProperties@18850}
  key = "node"
  value = {NodeProperties@18850}
   id = "4a8e8984-b371-4be3-8e89-84b371bbe3eb"
   version = "4.6.0-SNAPSHOT"
   tenant = null
   shardingTags = {Collections$EmptyList@24724}  size = 0
   zone = null
 "xpath" -> {Method@18852} "public static java.lang.Object io.gravitee.el.spel.function.xml.XPathFunction.evaluate(java.lang.Object,java.lang.String,java.lang.Object[])"
 "endpoints" -> {DefaultReferenceRegister$EndpointReferenceMap@18854}  size = 2
  key = "endpoints"
  value = {DefaultReferenceRegister$EndpointReferenceMap@18854}  size = 2
   "default" -> "default:"
    key = "default"
    value = "default:"
   "default-group" -> "default-group:"
    key = "default-group"
    value = "default-group:"
 "response" -> {EvaluableResponse@18856}
  key = "response"
  value = {EvaluableResponse@18856}
 "context" -> {EvaluableExecutionContext@18858}
  key = "context"
  value = {EvaluableExecutionContext@18858}
   executionContext = {DebugExecutionContext@18668}
 "jsonPath" -> {Method@18860} "public static java.lang.Object io.gravitee.el.spel.function.json.JsonPathFunction.evaluate(java.lang.Object,java.lang.String,com.jayway.jsonpath.Predicate[]) throws java.io.IOException"
 "subscription" -> {SubscriptionVariable@18862}
  key = "subscription"
  value = {SubscriptionVariable@18862}
   subscription = {Subscription@25183} "Subscription(id=127.0.0.1, api=8a2b2ab4-35ef-4f00-ab2a-b435ef0f00e8, plan=fb70e0c5-6582-4c77-b0e0-c565820c7788, application=1, clientId=null, clientCertificate=null, status=ACCEPTED, consumerStatus=STARTED, startingAt=null, endingAt=null, configuration=null, metadata=null, type=STANDARD, forceDispatch=false, environmentId=null)"
    id = "127.0.0.1"
    api = "8a2b2ab4-35ef-4f00-ab2a-b435ef0f00e8"
    plan = "fb70e0c5-6582-4c77-b0e0-c565820c7788"
    application = "1"
    clientId = null
    clientCertificate = null
    status = "ACCEPTED"
    consumerStatus = {Subscription$ConsumerStatus@25228} "STARTED"
    startingAt = null
    endingAt = null
    configuration = null
    metadata = null
    type = {Subscription$Type@25229} "STANDARD"
    forceDispatch = false
    environmentId = null
 "api" -> {ApiProperties@18864}
  key = "api"
  value = {ApiProperties@18864}
   api = {DebugApi@25163} "API id[8a2b2ab4-35ef-4f00-ab2a-b435ef0f00e8] name[echo-v2] version[echo-v2]"
    request = {HttpRequest@25165}
    response = null
    eventId = "703b2a9d-8c7b-4444-bb2a-9d8c7bf44465"
    definition = {DebugApi@18763} "Api{id='8a2b2ab4-35ef-4f00-ab2a-b435ef0f00e8', name='echo-v2', version='echo-v2'}"
    enabled = true
    deployedAt = {Date@25167} "Wed Oct 23 10:12:30 CEST 2024"
    environmentId = "DEFAULT"
    environmentHrid = "default"
    organizationId = "DEFAULT"
    organizationHrid = "default"
    definitionContext = {DefinitionContext@25172}
 "properties" -> {TemplatedValueHashMap@18866}  size = 0
  key = "properties"
  value = {TemplatedValueHashMap@18866}  size = 0
 "dictionaries" -> {HashMap@18868}  size = 0
  key = "dictionaries"
  value = {HashMap@18868}  size = 0
 */
