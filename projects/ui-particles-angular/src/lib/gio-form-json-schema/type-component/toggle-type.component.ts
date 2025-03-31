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

type ToggleProps = FormlyFieldProps;

@Component({
  selector: 'gio-fjs-toggle-type',
  template: `
    <gio-form-slide-toggle>
      <gio-form-label>{{ props.label }}</gio-form-label>
      {{ props.description }}
      <mat-slide-toggle
        gioFormSlideToggle
        [id]="id"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [tabIndex]="props.tabindex"
      ></mat-slide-toggle>
    </gio-form-slide-toggle>
  `,
  standalone: false,
})
export class GioFjsToggleTypeComponent extends FieldType<FieldTypeConfig<ToggleProps>> {}
