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

import { JSONSchema7 } from 'json-schema';

import { GioMonacoEditorConfig } from '../type-component/code-editor-type.component';

/**
 * GioConfig is used to add some custom configuration to the JSONSchema7
 * ⚠️ Keep updated with the GioJsonSchema.json to have the same interface ⚠️
 */
export interface GioConfig extends GioUiTypeConfig {
  displayIf?: GioIfConfig;
  disableIf?: GioIfConfig;
  banner?: GioBannerConfig;
  monacoEditorConfig?: GioMonacoEditorConfig;
  enumLabelMap?: Record<string, string>;
  uiBorder?: 'none' | 'full';
}

type GioBannerConfig =
  | {
      title: string;
      text: string;
    }
  | {
      text: string;
    };
/**
 * Used to override the default formly type. It's useful when we want to use a custom component.
 */
type GioUiTypeConfig = {
  uiType?: 'gio-headers-array' | string;
  uiTypeProps?: Record<string, unknown>;
};

/*
 * Condition
 * The condition is a JSON object with the context key and the value to compare.
 * Example: { $eq: { 'field': 'value' } }
 */
export type GioIfConfig = {
  $eq: Record<string, string | number | boolean | Array<string | number | boolean>>;
};

/**
 * Override the JSONSchema7 interface to add gioConfig
 * Use this way because the JSONSchema7 interface is recursive
 * And export with new name `GioJsonSchema` to make it more clear
 */
declare module 'json-schema' {
  export interface JSONSchema7 {
    gioConfig?: GioConfig;
    deprecated?: boolean;
  }
}

export type GioJsonSchema = JSONSchema7;
