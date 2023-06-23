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
import { Injectable } from '@angular/core';
import { FormlyFieldConfig, FormlyFormBuilder } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from 'json-schema';

import { GioJsonSchema } from './model/GioJsonSchema';

@Injectable()
export class GioFormlyJsonSchemaService {
  constructor(private readonly formlyJsonschema: FormlyJsonschema, private readonly builder: FormlyFormBuilder) {}

  public toFormlyFieldConfig(jsonSchema: GioJsonSchema): FormlyFieldConfig {
    return this.formlyJsonschema.toFieldConfig(jsonSchema, {
      map: (mappedField: FormlyFieldConfig, mapSource: JSONSchema7) => {
        mappedField = this.uiTypeMap(mappedField, mapSource);
        mappedField = this.formatMap(mappedField, mapSource);
        mappedField = this.bannerMap(mappedField, mapSource);
        mappedField = this.toggleMap(mappedField, mapSource);
        mappedField = this.disabledMap(mappedField, mapSource);

        return mappedField;
      },
    });
  }

  private uiTypeMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    mappedField.type = mapSource.gioConfig?.uiType ?? mappedField.type;
    return mappedField;
  }

  private formatMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (mapSource.type === 'string' && mapSource.format === 'text') {
      mappedField.type = 'textarea';
      mappedField.props = {
        ...mappedField.props,
        autosize: true,
      };
    } else if (mapSource.type === 'string' && mapSource.format === 'password') {
      mappedField.props = {
        ...mappedField.props,
        type: 'password',
      };
    } else if (mapSource.type === 'string' && mapSource.format === 'gio-code-editor') {
      mappedField.type = 'gio-code-editor';
      mappedField.props = {
        ...mappedField.props,
        monacoEditorConfig: mapSource.gioConfig?.monacoEditorConfig,
      };
    }

    return mappedField;
  }

  private bannerMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    mappedField.props = {
      ...mappedField.props,
      ...(mapSource.gioConfig?.banner ? getBannerProperties(mapSource.gioConfig.banner) : {}),
    };

    return mappedField;
  }

  private toggleMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (mapSource.type === 'boolean') {
      mappedField.type = 'toggle';
    }

    return mappedField;
  }

  private disabledMap(mappedField: FormlyFieldConfig, _mapSource: JSONSchema7): FormlyFieldConfig {
    mappedField.expressions = {
      ...mappedField.expressions,
      'props.disabled': field => field.options?.formState.disabled === true || field.props?.disabled === true,
    };
    return mappedField;
  }
}

const getBannerProperties = (banner: { title: string; text: string } | { text: string }) => {
  return {
    bannerText: banner.text,
    bannerTitle: 'title' in banner ? banner.title : undefined,
  };
};
