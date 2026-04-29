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

import { GioJsonSchema } from '../model/GioJsonSchema';

export const disableIfExample: GioJsonSchema = {
  type: 'object',
  definitions: {
    simpleString: {
      type: 'string',
      title: 'String field in ref',
    },
  },
  properties: {
    disableStringField: {
      type: 'boolean',
      title: 'Disable "string field" and "array field"',
      description: 'Enable or disable field below',
    },
    stringField: {
      type: 'string',
      title: 'String field',
      gioConfig: {
        disableIf: {
          $eq: {
            'value.disableStringField': true,
          },
        },
      },
    },
    arrayField: {
      type: 'array',
      title: 'Array field',
      items: {
        type: 'string',
      },
      gioConfig: {
        disableIf: {
          $eq: {
            'value.disableStringField': true,
          },
        },
      },
    },
    objectWithRef: {
      $ref: '#/definitions/simpleString',
      gioConfig: {
        disableIf: {
          $eq: {
            'value.disableStringField': true,
          },
        },
      },
    },
    disableWithContextCondition: {
      type: 'boolean',
      title: 'Disable because of context condition match',
      description: 'This field is disabled because the context condition match. Use Storybook Controls to change the context.',
      gioConfig: {
        disableIf: {
          $eq: {
            'context.currentUser': ['foo', 'bar'],
          },
        },
      },
    },
    enableWithContextCondition: {
      type: 'boolean',
      title: 'Enable because of context condition not match',
      description: 'This field is enabled because the context condition not match. Use Storybook Controls to change the context.',
      gioConfig: {
        disableIf: {
          $eq: {
            'context.currentUser': ['joe', 'bar'],
          },
        },
      },
    },
    enableWithReadOnlyProperty: {
      type: 'boolean',
      title: 'Enable with read-only property',
      description: 'Never enabled because of the read-only property',
      readOnly: true,
      gioConfig: {
        disableIf: {
          $eq: {
            'value.disableStringField': false,
          },
        },
      },
    },
    arrayWithDisableIf: {
      type: 'array',
      title: 'Array — relative disableIf inside item',
      description: 'Each item: the toggle disables a sibling field in the SAME row, using the relative path "./disableField".',
      items: {
        type: 'object',
        properties: {
          disableField: {
            type: 'boolean',
            title: 'Disable "field" in this row',
          },
          field: {
            type: 'string',
            title: 'Field',
            gioConfig: {
              disableIf: {
                $eq: {
                  './disableField': true,
                },
              },
            },
          },
        },
      },
    },
    arrayWithNestedDisableIf: {
      type: 'array',
      title: 'Array — relative disableIf inside a sub-object',
      description: 'Each item has a sub-object whose field references the item-level toggle via "../disableField" (one level up).',
      items: {
        type: 'object',
        properties: {
          disableField: {
            type: 'boolean',
            title: 'Disable nested "field"',
          },
          sub: {
            type: 'object',
            title: 'Sub-object',
            properties: {
              field: {
                type: 'string',
                title: 'Field',
                gioConfig: {
                  disableIf: {
                    $eq: {
                      '../disableField': true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  gioConfig: {
    banner: {
      text: 'Be careful, this condition are not validated by the backend. It is only a UI feature. To be aligned with the required fields and other JsonSchema validations',
    },
  },
};
