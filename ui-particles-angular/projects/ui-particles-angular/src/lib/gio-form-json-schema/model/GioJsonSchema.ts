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

/**
 * GioConfig is used to add some custom configuration to the JSONSchema7
 * ⚠️ Keep updated with the GioJsonSchema.json to have the same interface ⚠️
 */
export interface GioConfig {
  banner?: GioBannerConfig;
  uiType?: GioUiTypeConfig;
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
type GioUiTypeConfig = 'gio-headers-array' | string;

/**
 * Override the JSONSchema7 interface to add gioConfig
 * Use this way because the JSONSchema7 interface is recursive
 * And export with new name `GioJsonSchema` to make it more clear
 */
declare module 'json-schema' {
  export interface JSONSchema7 {
    gioConfig?: GioConfig;
  }
}

import { JSONSchema7 } from 'json-schema';

export type GioJsonSchema = JSONSchema7;
