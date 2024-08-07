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

export const codeEditorExample: GioJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    codeEditor: {
      title: 'Code editor',
      description: 'String with monaco editor',
      type: 'string',
      format: 'gio-code-editor',
    },
    jsonCodeEditor: {
      title: 'Json code editor',
      type: 'string',
      format: 'gio-code-editor',
      gioConfig: {
        monacoEditorConfig: {
          language: 'json',
        },
      },
    },
  },
  required: ['codeEditor'],
};
