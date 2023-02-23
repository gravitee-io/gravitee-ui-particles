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
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'gio-fjs-object-type',
  template: `
    <div class="wrapper">
      <div class="wrapper__title" *ngIf="to.label">{{ to.label }}</div>
      <p *ngIf="to.description">{{ to.description }}</p>
      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    </div>
  `,
  styleUrls: ['./object-type.component.scss'],
})
export class GioFjsObjectTypeComponent extends FieldType {
  public defaultOptions = {
    defaultValue: {},
  };
}
