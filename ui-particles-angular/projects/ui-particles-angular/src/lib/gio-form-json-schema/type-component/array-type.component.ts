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
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'gio-fjs-array-type',
  template: `
    <div>
      <legend *ngIf="to.label">{{ to.label }}</legend>
      <p *ngIf="to.description">{{ to.description }}</p>

      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <div *ngFor="let field of field.fieldGroup; let i = index" class="row">
        <formly-field [field]="field"></formly-field>
        <div>
          <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
        </div>
      </div>

      <div>
        <button class="btn btn-primary" type="button" (click)="add()">+</button>
      </div>
    </div>
  `,
})
export class GioFjsArrayTypeComponent extends FieldArrayType {}
