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
import { castArray, get, isArray, isEmpty, isNil, isObject, set } from 'lodash';
import { Observable } from 'rxjs';

import { GioIfConfig, GioJsonSchema } from './model/GioJsonSchema';
import { GioJsonSchemaContext } from './model/GioJsonSchemaContext';

@Injectable()
export class GioFormlyJsonSchemaService {
  constructor(
    private readonly formlyJsonschema: FormlyJsonschema,
    private readonly builder: FormlyFormBuilder,
  ) {}

  public toFormlyFieldConfig(jsonSchema: GioJsonSchema, context?: GioJsonSchemaContext): FormlyFieldConfig {
    return this.formlyJsonschema.toFieldConfig(jsonSchema, {
      map: (mappedField: FormlyFieldConfig, mapSource: JSONSchema7) => {
        mappedField = this.uiTypeMap(mappedField, mapSource); // Keep first in order to correctly construct tree
        mappedField = this.displayIfMap(mappedField, mapSource, context);
        mappedField = this.uiBorder(mappedField, mapSource);
        mappedField = this.formatMap(mappedField, mapSource);
        mappedField = this.bannerMap(mappedField, mapSource);
        mappedField = this.toggleMap(mappedField, mapSource);
        mappedField = this.disableIfMap(mappedField, mapSource, context);
        mappedField = this.enumLabelMap(mappedField, mapSource);
        mappedField = this.sanitizeOneOf(mappedField, mapSource);
        mappedField = this.deprecatedMap(mappedField, mapSource);

        return mappedField;
      },
    });
  }

  private displayIfMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7, context?: GioJsonSchemaContext): FormlyFieldConfig {
    const displayIf = getGioIf(mapSource.gioConfig?.displayIf);
    if (displayIf) {
      mappedField.expressions = {
        ...mappedField.expressions,
        hide: field => {
          let parentField = field;
          while (parentField.parent) {
            parentField = parentField.parent;
          }

          try {
            return !displayIf({
              value: parentField.model,
              context,
            });
          } catch (e) {
            // Ignore the error and display the field
            return false;
          }
        },
      };
    }

    return mappedField;
  }

  private uiTypeMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (mapSource.gioConfig?.uiType) {
      // Clean the field to avoid conflict and init simple one with given type
      mappedField = {
        key: mappedField.key,
        type: mapSource.gioConfig?.uiType,
        props: {
          ...mappedField.props,
          ...mapSource.gioConfig?.uiTypeProps,
        },
      };
    }

    return mappedField;
  }

  private uiBorder(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (mapSource.gioConfig?.uiBorder) {
      mappedField = {
        ...mappedField,
        props: {
          ...mappedField.props,
          uiBorder: mapSource.gioConfig?.uiBorder,
        },
      };
    }

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
    } else if (mapSource.type === 'string' && mapSource.format === 'gio-cron') {
      mappedField.type = 'gio-cron';
      mappedField.props = {
        ...mappedField.props,
      };
    } else if (
      mapSource.type === 'string' &&
      mapSource.format &&
      ['gio-el-input', 'gio-el-textarea'].includes(mapSource.format) &&
      get(mapSource, '["x-schema-form"].expression-language')
    ) {
      mappedField.type = mapSource.format;
      mappedField.props = {
        ...mappedField.props,
        elConfig: mapSource.gioConfig?.elConfig,
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

  private disableIfMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7, context?: GioJsonSchemaContext): FormlyFieldConfig {
    const disableIf = getGioIf(mapSource.gioConfig?.disableIf);
    if (disableIf) {
      const propsDisabled: ((field: FormlyFieldConfig) => boolean) | Observable<boolean> = field => {
        const isReadOnly = field.props?.readonly === true;
        const isParentDisabled = field.options?.formState?.parentDisabled === true;
        if (isParentDisabled || isReadOnly) {
          // Useful when field is readonly to avoid to enable it
          field.formControl?.disable({ emitEvent: false });
          return true;
        }

        let parentField = field;
        while (parentField.parent) {
          parentField = parentField.parent;
        }

        try {
          const isDisabled = disableIf({
            value: parentField.model,
            context,
          });
          // Useful when full form is re-enabled to sync the fromControl enable/disable state
          isDisabled ? field.formControl?.disable({ emitEvent: false }) : field.formControl?.enable({ emitEvent: false });
          return isDisabled;
        } catch (e) {
          // Ignore the error and keep default value
          return field.props?.disabled || false;
        }
      };

      mappedField.expressions = {
        ...mappedField.expressions,
        'props.disabled': propsDisabled,
      };
    }

    return mappedField;
  }

  private enumLabelMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (!isArray(mappedField.props?.options)) {
      return mappedField;
    }

    const enumLabelMapInObject =
      mapSource.enum && !isEmpty(mapSource.enum) && mapSource.gioConfig?.enumLabelMap ? mapSource.gioConfig?.enumLabelMap : null;
    const enumLabelMapInArrayItem =
      mapSource.items &&
      mapSource.type === 'array' &&
      !isEmpty((mapSource.items as JSONSchema7).enum) &&
      (mapSource.items as JSONSchema7)?.gioConfig?.enumLabelMap
        ? (mapSource.items as JSONSchema7)?.gioConfig?.enumLabelMap
        : null;

    if (enumLabelMapInObject || enumLabelMapInArrayItem) {
      mappedField.props = {
        ...mappedField.props,
        options: mappedField.props?.options?.map(({ value }) => {
          return {
            label: (enumLabelMapInObject || enumLabelMapInArrayItem)?.[value] ?? value,
            value: value,
          };
        }),
      };
    }

    return mappedField;
  }

  /**
   * Remove the label of the oneOf fields to avoid to display it twice (with the select and the object title)
   */
  private sanitizeOneOf(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (!mapSource.oneOf || !mappedField.fieldGroup || mappedField.fieldGroup.length < 1) {
      return mappedField;
    }

    const parentFieldGroup = mappedField.fieldGroup[mappedField.fieldGroup.length - 1];
    if (!parentFieldGroup || parentFieldGroup?.type != 'multischema') {
      return mappedField;
    }

    const contentFieldGroup = get(parentFieldGroup, 'fieldGroup[1]');
    if (!contentFieldGroup) {
      return mappedField;
    }

    contentFieldGroup.fieldGroup?.forEach((field: FormlyFieldConfig) => {
      set(field, 'props.label', undefined);
    });

    return mappedField;
  }

  private deprecatedMap(mappedField: FormlyFieldConfig, mapSource: JSONSchema7): FormlyFieldConfig {
    if (mapSource.deprecated) {
      return {};
    }

    return mappedField;
  }
}

const getBannerProperties = (banner: { title: string; text: string } | { text: string }) => {
  return {
    bannerText: banner.text,
    bannerTitle: 'title' in banner ? banner.title : undefined,
  };
};

const getGioIf = (
  gioIf?: GioIfConfig,
): ((objectToCheck?: { value?: FormlyFieldConfig['model']; context?: Record<string, unknown> }) => boolean) | undefined => {
  const $eq = gioIf?.$eq;
  if (isNil($eq) || !isObject($eq)) {
    return undefined;
  }

  return objectToCheck => {
    if (isEmpty(objectToCheck)) {
      return false;
    }

    return Object.entries($eq)
      .map(([k, v]) => ({ path: k, eqValue: castArray(v) }))
      .every(({ path, eqValue }) => {
        const value = get(objectToCheck, path);

        return eqValue.includes(value);
      });
  };
};
