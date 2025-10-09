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
import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'gio-fjs-object-type',
  template: `
    <div class="wrapper">
      @if (to.label) {
        <div class="wrapper__title">{{ to.label }}</div>
      }
      @if (to.description) {
        <p>{{ to.description }}</p>
      }
      @if (showError && formControl.errors) {
        <div class="wrapper__error gio-ng-invalid">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      }
      <div class="wrapper__fields" [class.noUiBorder]="classNoUiBorder">
        @for (f of field.fieldGroup; track f) {
          @if (f.type) {
            <formly-field class="wrapper__fields__field" [field]="f"></formly-field>
          }
        }
      </div>
    </div>
    `,
  styleUrls: ['./object-type.component.scss'],
  standalone: false,
})
export class GioFjsObjectTypeComponent extends FieldType implements OnInit {
  public classNoUiBorder = false;

  public ngOnInit() {
    this.classNoUiBorder = this.props.uiBorder === 'none';
  }
}
