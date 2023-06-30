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

import { FormHeaderFieldMapper } from '../../gio-form-headers/gio-form-headers.component';

type HeadersProps = FormlyFieldProps & {
  // The key and value names of the output array
  // Default: { keyName: 'name', valueName: 'value' }
  // 📝 Note : For now this config is not editable by json-schema gioConfig. If it becomes
  //           necessary it is possible to change the GioUiTypeConfig to pass this config.
  outputConfig: {
    keyName: string;
    valueName: string;
  };
};

@Component({
  selector: 'gio-fjs-headers-type',
  template: `
    <div class="wrapper">
      <div class="wrapper__header">
        <div class="wrapper__header__text">
          <div class="wrapper__header__text__title" *ngIf="to.label">{{ to.label }}</div>
          <p *ngIf="to.description">{{ to.description }}</p>
        </div>
        <div class="wrapper__header__collapse">
          <button type="button" mat-icon-button aria-label="Collapse" (click)="collapse = !collapse">
            <mat-icon [class.collapse-open]="collapse" [class.collapse-close]="!collapse" svgIcon="gio:nav-arrow-down"></mat-icon>
          </button>
        </div>
      </div>
      <div class="wrapper__error" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <div *ngIf="!collapse" class="wrapper__rows" [class.collapse-open]="collapse" [class.collapse-close]="!collapse">
        <gio-form-headers [headerFieldMapper]="outputConfig" [formControl]="formControl"></gio-form-headers>
      </div>
    </div>
  `,
  styleUrls: ['./headers-type.component.scss'],
})
export class GioFjsHeadersTypeComponent extends FieldType<FieldTypeConfig<HeadersProps>> {
  public override defaultOptions?: Partial<FieldTypeConfig<HeadersProps>> | undefined = {
    props: {
      outputConfig: this.outputConfig,
    },
  };

  public collapse = false;

  public get outputConfig(): FormHeaderFieldMapper {
    return {
      keyName: 'name',
      valueName: 'value',
    };
  }
}
