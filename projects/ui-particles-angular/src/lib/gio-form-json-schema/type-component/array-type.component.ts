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
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'gio-fjs-array-type',
  template: `
    <div class="wrapper" [class.error]="formControl.touched && formControl.invalid" [class.noUiBorder]="classNoUiBorder">
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

      <div class="wrapper__error gio-ng-invalid" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <div [hidden]="collapse" class="wrapper__rows" [class.collapse-open]="collapse" [class.collapse-close]="!collapse">
        <div *ngFor="let field of field.fieldGroup; let i = index" class="wrapper__rows__row">
          <formly-field class="wrapper__rows__row__field" [field]="field"></formly-field>
          <div class="wrapper__rows__row__remove">
            <button type="button" mat-icon-button aria-label="Remove" [disabled]="this.formControl?.disabled ?? false" (click)="remove(i)">
              <mat-icon svgIcon="gio:cancel"></mat-icon>
            </button>
          </div>
        </div>

        <div>
          <button type="button" mat-stroked-button aria-label="Add" [disabled]="this.formControl?.disabled ?? false" (click)="add()">
            <mat-icon svgIcon="gio:plus"></mat-icon> Add
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./array-type.component.scss'],
})
export class GioFjsArrayTypeComponent extends FieldArrayType implements OnInit {
  public collapse = false;
  public classNoUiBorder = false;

  public ngOnInit() {
    this.classNoUiBorder = this.props.uiBorder === 'none';
  }
}
