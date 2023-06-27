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
import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { FormlyValueChangeEvent } from '@ngx-formly/core/lib/models';

@Component({
  selector: 'gio-fjs-array-type',
  template: `
    <div class="wrapper" [class.error]="formControl.touched && formControl.invalid">
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
          <formly-field class="wrapper__rows__row__field" [field]="field" (focusin)="onFocusIn()"></formly-field>
          <div class="wrapper__rows__row__remove">
            <button type="button" mat-icon-button aria-label="Remove" [disabled]="this.form?.disabled ?? false" (click)="remove(i)">
              <mat-icon svgIcon="gio:cancel"></mat-icon>
            </button>
          </div>
        </div>

        <div>
          <button type="button" mat-stroked-button aria-label="Add" [disabled]="this.form?.disabled ?? false" (click)="add()">
            <mat-icon svgIcon="gio:plus"></mat-icon> Add
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./array-type.component.scss'],
})
export class GioFjsArrayTypeComponent extends FieldArrayType implements AfterViewChecked {
  public collapse = false;

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  /**
   * This method is here to ensure that all fields of the array are disabled or enabled when the form is disabled or enabled.
   */
  public ngAfterViewChecked(): void {
    this.field.props.disabled = this.form.disabled;
    this.field.fieldGroup?.forEach(f => {
      if (f && f.props) f.props.disabled = this.form.disabled;
    });
    this.cdr.detectChanges();
  }

  /**
   * This method fix an issue with the fieldChanges Subject which can be undefined when we enable or disable the form.
   */
  public onFocusIn() {
    if (this.field && this.field.options && this.field.options.fieldChanges === undefined) {
      this.field.options.fieldChanges = new Subject<FormlyValueChangeEvent>();
    }
  }

  /**
   * This method fix an issue with the fieldChanges Subject which can be undefined when we enable or disable the form
   * and then try to add a new field.
   */
  public add() {
    if (this.field && this.field.options && this.field.options.fieldChanges === undefined) {
      this.field.options.fieldChanges = new Subject<FormlyValueChangeEvent>();
    }
    super.add();
  }
}
