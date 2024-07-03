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

export const displayIfExample: GioJsonSchema = {
  type: 'object',
  properties: {
    showStringField: {
      type: 'boolean',
      title: 'Show hidden "string field"',
      description: 'Show or hide the string field below',
    },
    stringField: {
      type: 'string',
      title: 'String field',
      gioConfig: {
        displayIf: {
          $eq: {
            'value.showStringField': true,
          },
        },
      },
    },
    showWithContextCondition: {
      type: 'boolean',
      title: 'Show because of context condition match',
      description: 'This field is displayed because the context condition match. Use Storybook Controls to change the context.',
      gioConfig: {
        displayIf: {
          $eq: {
            'context.currentUser': ['foo', 'bar'],
          },
        },
      },
    },
    hideWithContextCondition: {
      type: 'boolean',
      title: 'Hide because of context condition match',
      description: 'This field is hidden because the context condition match. Use Storybook Controls to change the context.',
      gioConfig: {
        displayIf: {
          $eq: {
            'context.currentUser': ['joe', 'bar'],
          },
        },
      },
    },
    showMultipleConditionsObject: {
      type: 'boolean',
      title: 'Enable multiple conditions',
      default: true,
    },
    multipleConditions: {
      type: 'object',
      title: 'Multiple conditions',
      description: 'This field is displayed if the two conditions match. Use Storybook Controls to change the context.',
      properties: {
        showField1: {
          type: 'boolean',
          title: 'Show field 1',
        },
        showField2: {
          type: 'boolean',
          title: 'Show field 2',
        },
        field: {
          type: 'string',
          title: 'Field',
          gioConfig: {
            displayIf: {
              $eq: {
                'value.multipleConditions.showField1': true,
                'value.multipleConditions.showField2': true,
              },
            },
          },
        },
      },
      gioConfig: {
        displayIf: {
          $eq: {
            'value.showMultipleConditionsObject': true,
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
