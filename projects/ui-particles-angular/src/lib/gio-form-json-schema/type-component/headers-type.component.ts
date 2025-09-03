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
import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';

import { FormHeaderFieldMapper, isFormHeaderElConfig } from '../../gio-form-headers/gio-form-headers.component';
import { ElColumns, GioUiTypeConfig } from '../model/GioJsonSchema';

type HeadersProps = FormlyFieldProps & {
  // The key and value names of the output array
  // Default: { keyName: 'name', valueName: 'value' }
  // 📝 Note : For now this config is not editable by json-schema gioConfig. If it becomes
  //           necessary it is possible to change the GioUiTypeConfig to pass this config.
  outputConfig: {
    keyName: string;
    valueName: string;
  };
  config: GioUiTypeConfig['uiTypeProps'];
};

@Component({
  selector: 'gio-fjs-headers-type',
  template: `
    <div class="wrapper">
      <div class="wrapper__header">
        <div class="wrapper__header__text">
          @if (props.label) {
            <div class="wrapper__header__text__title">{{ props.label }}</div>
          }
          @if (props.description) {
            <p>{{ props.description }}</p>
          }
        </div>
        <div class="wrapper__header__collapse">
          <button type="button" mat-icon-button aria-label="Collapse" (click)="collapse = !collapse">
            <mat-icon [class.collapse-open]="collapse" [class.collapse-close]="!collapse" svgIcon="gio:nav-arrow-down" />
          </button>
        </div>
      </div>
      @if (showError && formControl.errors) {
        <formly-validation-message [field]="field" />
      }
      @if (!collapse) {
        <div class="wrapper__rows" [class.collapse-open]="collapse" [class.collapse-close]="!collapse">
          <gio-form-headers [headerFieldMapper]="outputConfig" [config]="{ elColumns: elConfig }" [formControl]="formControl" />
        </div>
      }
    </div>
  `,
  styleUrls: ['./headers-type.component.scss'],
  standalone: false,
})
export class GioFjsHeadersTypeComponent extends FieldType<FieldTypeConfig<HeadersProps>> {
  public override defaultOptions?: Partial<FieldTypeConfig<HeadersProps>> | undefined = {
    props: {
      outputConfig: this.outputConfig,
      config: {
        elColumns: 'neither',
      },
    },
  };

  public collapse = false;

  public get outputConfig(): FormHeaderFieldMapper {
    return {
      keyName: 'name',
      valueName: 'value',
    };
  }

  public get elConfig(): ElColumns {
    const elConfig: GioUiTypeConfig['uiTypeProps'] = JSON.parse(JSON.stringify(this.props));
    return isFormHeaderElConfig(elConfig?.elColumns) ? elConfig?.elColumns : 'neither';
  }
}
