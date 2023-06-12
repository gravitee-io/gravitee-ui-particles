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

// 09/06/2023 - All API V4 available policies.
const POLICIES_SCHEMA: Record<string, unknown> = {
  'message-filtering': undefined,
  'test-policy': {
    type: 'object',
    properties: {
      test: {
        type: 'string',
        title: 'Test',
        description: 'Test Json Schema',
      },
    },
    required: ['test'],
  },
  'json-xml': {
    type: 'object',
    id: 'urn:jsonschema:io:gravitee:policy:json2xml:configuration:JsonToXMLTransformationPolicyConfiguration',
    properties: {
      scope: {
        title: 'Scope',
        description: 'Execute policy on <strong>request</strong> or <strong>response</strong> phase.',
        type: 'string',
        default: 'REQUEST',
        enum: ['REQUEST', 'RESPONSE'],
      },
      rootElement: {
        title: 'Root element',
        description: "Root element name that's enclose content",
        type: 'string',
        default: 'root',
        pattern: '^[a-z:_A-Z]+[a-zA-Z0-9:-_]*',
      },
    },
    required: ['rootElement'],
  },
  'avro-json': {
    type: 'object',
    oneOf: [
      {
        title: 'Json to Avro transformation using an inline schema',
        properties: {
          conversion: {
            const: 'json-to-avro',
            title: 'Conversion',
          },
          serializationFormat: {
            const: 'simple',
            title: 'Serialization format',
          },
          schemaLocation: {
            const: 'inline',
            title: 'Avro Schema Location',
          },
          schemaDefinition: {
            type: 'string',
            title: 'Schema Definition',
            default: '',
          },
        },
        required: ['conversion', 'serializationFormat', 'schemaLocation', 'schemaDefinition'],
      },
      {
        title: 'Avro to Json transformation using an inline schema',
        properties: {
          conversion: {
            const: 'avro-to-json',
            title: 'Conversion',
          },
          serializationFormat: {
            type: 'string',
            title: 'Serialization format',
            default: 'simple',
            enum: ['confluent', 'simple'],
          },
          schemaLocation: {
            const: 'inline',
            title: 'Avro Schema Location',
          },
          schemaDefinition: {
            type: 'string',
            title: 'Schema Definition',
            default: '',
          },
        },
        required: ['conversion', 'serializationFormat', 'schemaLocation', 'schemaDefinition'],
      },
      {
        title: 'Avro to Json transformation using a schema registry',
        properties: {
          conversion: {
            const: 'avro-to-json',
            title: 'Conversion',
          },
          serializationFormat: {
            type: 'string',
            title: 'Serialization format',
            default: 'confluent',
            enum: ['confluent', 'simple'],
          },
          schemaLocation: {
            const: 'schema-registry',
            title: 'Avro Schema Location',
          },
          resourceName: {
            type: 'string',
            title: 'The name of the Schema Registry resource',
            default: '',
          },
        },
        required: ['conversion', 'serializationFormat', 'schemaLocation', 'resourceName'],
      },
      {
        title: 'Json to Avro transformation using a schema registry',
        properties: {
          conversion: {
            const: 'json-to-avro',
            title: 'Conversion',
          },
          serializationFormat: {
            type: 'string',
            title: 'Serialization format',
            default: 'confluent',
            enum: ['confluent', 'simple'],
          },
          schemaLocation: {
            const: 'schema-registry',
            title: 'Avro Schema Location',
          },
          resourceName: {
            type: 'string',
            title: 'The name of the Schema Registry resource',
            default: '',
          },
        },
        oneOf: [
          {
            title: 'Inlined schema ID location',
            properties: {
              schemaIdLocation: {
                const: 'inline',
                title: 'Schema ID Location',
              },
              schemaIdValue: {
                type: 'integer',
                title: 'Schema ID',
              },
            },
          },
        ],
        required: ['conversion', 'serializationFormat', 'schemaLocation', 'resourceName', 'schemaIdLocation', 'schemaIdValue'],
      },
    ],
  },
  jwt: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      signature: {
        title: 'Signature',
        description: 'Define how the JSON Web Token must be signed.',
        type: 'string',
        default: 'RSA_RS256',
        enum: ['RSA_RS256', 'RSA_RS384', 'RSA_RS512', 'HMAC_HS256', 'HMAC_HS384', 'HMAC_HS512'],
        'x-schema-form': {
          type: 'select',
          titleMap: {
            RSA_RS256: 'RS256 - RSA signature with SHA-256',
            RSA_RS384: 'RS384 - RSA signature with SHA-384',
            RSA_RS512: 'RS512 - RSA signature with SHA-512',
            HMAC_HS256: 'HS256 - HMAC with SHA-256, requires 256+ bit secret',
            HMAC_HS384: 'HS384 - HMAC with SHA-384, requires 384+ bit secret',
            HMAC_HS512: 'HS512 - HMAC with SHA-512, requires 512+ bit secret',
          },
        },
      },
      publicKeyResolver: {
        title: 'JWKS resolver',
        description: 'Define how the JSON Web Key Set is retrieved',
        type: 'string',
        default: 'GIVEN_KEY',
        enum: ['GIVEN_KEY', 'GATEWAY_KEYS', 'JWKS_URL'],
        'x-schema-form': {
          type: 'select',
          titleMap: {
            GIVEN_KEY: 'GIVEN_KEY: You must provide a signature key as a resolver parameter according to the signature algorithm',
            GATEWAY_KEYS:
              'GATEWAY_KEYS: Look for signature key from API Gateway configuration according to issuer and kid from incoming JWT',
            JWKS_URL: "JWKS_URL: Retrieve JWKS from URL (Basically, URL ending with '/.well-known/jwks.json')",
          },
        },
        gioConfig: {
          banner: {
            title: 'JWKS resolver',
            text: "<ul><li>GIVEN_KEY: You must provide a signature key as a resolver parameter according to the signature algorithm</li><li>GATEWAY_KEYS: Look for signature key from API Gateway configuration according to issuer and kid from incoming JWT</li><li>JWKS_URL: Retrieve JWKS from URL (Basically, URL ending with '/.well-known/jwks.json')</li></ul>",
          },
        },
      },
      resolverParameter: {
        title: 'Resolver parameter',
        description: 'Set the signature key GIVEN_KEY or a JWKS_URL following selected resolver (support EL).',
        type: 'string',
        format: 'gio-code-editor',
        'x-schema-form': {
          type: 'codemirror',
          codemirrorOptions: {
            placeholder: 'Put signature key content here',
            lineWrapping: true,
            lineNumbers: true,
            allowDropFileTypes: true,
            autoCloseTags: true,
          },
          'expression-language': true,
        },
      },
      useSystemProxy: {
        title: 'Use system proxy',
        description: 'Use system proxy (make sense only when resolver is set to JWKS_URL)',
        type: 'boolean',
        default: false,
      },
      extractClaims: {
        title: 'Extract JWT Claims',
        description: "Put claims into the 'jwt.claims' context attribute.",
        type: 'boolean',
        default: false,
      },
      propagateAuthHeader: {
        title: 'Propagate Authorization header',
        description: 'Allows to propagate Authorization header to the target endpoints',
        type: 'boolean',
        default: true,
      },
      userClaim: {
        title: 'User claim',
        description: 'Claim where the user can be extracted',
        type: 'string',
        default: 'sub',
      },
      clientIdClaim: {
        title: 'Client ID claim',
        description: 'Claim where the client ID can be extracted. Configuring this field will override the standard behavior.',
        type: 'string',
      },
    },
    required: ['signature', 'publicKeyResolver'],
    additionalProperties: false,
  },
  'key-less': undefined,
  'api-key': {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      propagateApiKey: {
        title: 'Propagate API Key to upstream API',
        type: 'boolean',
      },
    },
    additionalProperties: false,
  },
  oauth2: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      oauthResource: {
        title: 'OAuth2 resource',
        description: 'OAuth2 resource used to validate token. Supports EL.',
        type: 'string',
        'x-schema-form': {
          event: {
            name: 'fetch-resources',
            regexTypes: '^oauth2',
          },
          placeholder: 'oauth-resource-name',
        },
        gioConfig: {
          uiType: 'plan-oauth2-resource',
        },
      },
      oauthCacheResource: {
        title: 'Cache resource',
        description: 'Cache resource used to store the tokens.',
        type: 'string',
        'x-schema-form': {
          event: {
            name: 'fetch-resources',
            regexTypes: '^cache',
          },
          placeholder: 'cache-resource-name',
        },
        gioConfig: {
          uiType: 'plan-cache-resource',
        },
      },
      extractPayload: {
        title: 'Extract OAuth2 payload',
        description: "Push the token endpoint payload into the 'oauth.payload' context attribute.",
        type: 'boolean',
        default: false,
      },
      checkRequiredScopes: {
        title: 'Check scopes',
        description: 'Check required scopes to access the resource',
        type: 'boolean',
        default: false,
      },
      requiredScopes: {
        type: 'array',
        title: 'Required scopes',
        description: 'List of required scopes to access the resource.',
        items: {
          type: 'string',
          title: 'Scope',
        },
      },
      modeStrict: {
        title: 'Mode strict',
        description: 'Check scopes with exactly those configured',
        type: 'boolean',
        default: true,
      },
      propagateAuthHeader: {
        title: 'Permit authorization header to the target endpoints',
        description: 'Allows to propagate Authorization header to the target endpoints',
        type: 'boolean',
        default: true,
      },
    },
    required: ['oauthResource'],
    additionalProperties: false,
  },
  'json-to-json': {
    type: 'object',
    id: 'urn:jsonschema:io:gravitee:policy:json2json:configuration:JsonToJsonTransformationPolicyConfiguration',
    properties: {
      scope: {
        title: 'Scope',
        description: 'Execute policy on <strong>request</strong> or <strong>response</strong> phase.',
        type: 'string',
        default: 'REQUEST',
        enum: ['REQUEST', 'RESPONSE'],
        deprecated: 'true',
      },
      overrideContentType: {
        title: 'Override the Content-Type',
        description: 'Enforce the Content-Type: application/json',
        type: 'boolean',
        default: true,
      },
      specification: {
        title: 'JOLT specification',
        type: 'string',
        'x-schema-form': {
          type: 'codemirror',
          codemirrorOptions: {
            placeholder: "Place your JOLT specification here or drag'n'drop your JOLT specification file",
            lineWrapping: true,
            lineNumbers: true,
            allowDropFileTypes: true,
            autoCloseTags: true,
            mode: 'javascript',
          },
          'expression-language': true,
        },
      },
    },
    required: ['specification'],
  },
};
/**
 * Try to find a policy schema from its id. if not found, return empty
 * @param policyId Id of known test policies
 * @returns
 */
export function fakePolicySchema(policyId: string): unknown {
  return POLICIES_SCHEMA[policyId] ?? {};
}
