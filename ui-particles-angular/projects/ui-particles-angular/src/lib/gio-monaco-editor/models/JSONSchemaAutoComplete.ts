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
export interface PropertySuggestion {
  type: string;
  name: string;
  enum?: string[];
}

export interface IndexableSuggestion {
  type?: string;
  enum?: string[];
  additionalProperties?: IndexableSuggestion;
  items?: IndexableSuggestion;
}

export interface Suggestions {
  properties: PropertySuggestion[];
  additionalProperties: IndexableSuggestion;
  items: IndexableSuggestion;
}

export interface JSONSchema {
  properties?: JSONSchemaProperties;
  $defs?: JSONSchemaProperties;
}

export interface JSONSchemaProperty {
  type?: string;
  $ref?: string;
  additionalProperties?: JSONSchemaProperty;
  items?: JSONSchemaProperty;
  properties?: JSONSchemaProperties;
}

export type JSONSchemaPropertyWithDefs = JSONSchema & JSONSchemaProperty;

export interface JSONSchemaProperties {
  [key: string]: JSONSchemaProperty;
}

const SCHEMA_REF_BASE = '#/$defs/';

export function getKeywords(schema: JSONSchemaPropertyWithDefs, keywords = new Set<string>()): string[] {
  const properties = schema.properties || {};
  const defs = schema.$defs || {};
  for (const property of Object.values(defs)) {
    if (property.properties) {
      getKeywords(property, keywords);
    }
  }
  for (const [name, property] of Object.entries(properties)) {
    keywords.add(name);
    if (property.properties) {
      getKeywords(property, keywords);
    }
  }
  return Array.from(keywords);
}
/**
 * Build suggestions for autocompletion based on a JSON schema definition and a property path
 *
 * @param schema an object model defined as a JSON schema following the 2020-12 specification
 * @param path the property path to inspect. If the property path contains '.', then root properties will be returned
 */
export function getSuggestions(schema: JSONSchema, path: string[]): Suggestions {
  const propertyNames = [...path];
  const propertyName = propertyNames.shift();

  if (propertyName === '.') {
    return buildSuggestions(schema, schema);
  }

  const property = getProperty(schema, propertyName);
  if (!property) {
    return {
      properties: [],
      additionalProperties: {},
      items: {},
    };
  }

  const newSchema = mergeSchemaWithProperties(schema, property);
  if (propertyNames.length > 0) {
    return getSuggestions(newSchema, propertyNames);
  }

  return buildSuggestions(newSchema, property);
}

function resolveReference(ref: string, defs: JSONSchemaProperties = {}): JSONSchemaProperty {
  const refName = ref.substring(SCHEMA_REF_BASE.length);
  const resolved = defs[refName];
  if (resolved && resolved.$ref) {
    return resolveReference(resolved.$ref, defs);
  }
  return resolved || {};
}

function resolveType(property: JSONSchemaProperty, defs?: JSONSchemaProperties): string {
  if (property.$ref) {
    const resolved = resolveReference(property.$ref, defs);
    return resolveType(resolved, defs);
  }
  if (property.additionalProperties || property.items) {
    const stringMap = 'map<string, ';
    const array = 'array<';
    let type = property.additionalProperties ? stringMap : array;
    let copy = property.additionalProperties || (property.items as JSONSchemaProperty);
    while (copy.additionalProperties || copy.items) {
      type += copy.additionalProperties ? stringMap : array;
      copy = copy.additionalProperties || (copy.items as JSONSchemaProperty);
    }
    return `${type}${copy.type}>`;
  }
  return property.type as string;
}

function getProperty(schema: JSONSchemaPropertyWithDefs, propertyName = String()): JSONSchemaProperty {
  if (schema.properties && schema.properties[propertyName]) {
    return schema.properties[propertyName];
  }

  if (schema.$ref && schema.$defs) {
    const property = resolveReference(schema.$ref, schema.$defs);
    if (property && property.properties) {
      return property.properties[propertyName];
    }
  }
  return {};
}

function buildIndexableSuggestion(property: JSONSchemaProperty): Suggestions {
  return {
    properties: [],
    additionalProperties: property.additionalProperties || {},
    items: property.items || {},
  };
}

function buildSuggestions(schema: JSONSchemaPropertyWithDefs, property: JSONSchemaProperty): Suggestions {
  if (property.$ref && schema.$defs) {
    const ref = resolveReference(property.$ref, schema.$defs);
    return buildSuggestions(schema, ref);
  }

  if (property.additionalProperties || property.items) {
    return buildIndexableSuggestion(property);
  }

  const properties = property.properties || {};
  return {
    properties: mapSuggestions(properties, schema.$defs),
    additionalProperties: {},
    items: {},
  };
}

function mapSuggestions(properties: JSONSchemaProperties, defs?: JSONSchemaProperties): PropertySuggestion[] {
  return Object.entries(properties).map(([name, property]) => {
    return {
      name,
      type: resolveType(property, defs),
    };
  });
}

function mergeSchemaWithProperties(schema: JSONSchema, property: JSONSchemaProperty): JSONSchemaPropertyWithDefs {
  return { ...schema, ...property };
}
