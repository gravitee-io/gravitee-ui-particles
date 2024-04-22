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
import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { set } from 'lodash';
import { Subject } from 'rxjs';

@Component({
  selector: 'gio-fjs-multi-schema-type',
  template: `
    <div class="wrapper">
      <div class="wrapper__title" *ngIf="props.label">{{ props.label }}</div>
      <p *ngIf="props.description">{{ props.description }}</p>
      <div class="wrapper__error gio-ng-invalid" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    </div>
  `,
  styleUrls: ['./multischema-type.component.scss'],
})
export class GioFjsMultiSchemaTypeComponent extends FieldType implements OnInit, OnDestroy, AfterViewChecked {
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  public ngOnInit(): void {
    set(this.field, 'fieldGroup[0].props.appearance', 'fill');
    set(this.field, 'fieldGroup[0].props.label', 'Select option');
  }

  public ngAfterViewChecked(): void {
    set(this.field, 'fieldGroup[0].props.disabled', this.formControl.disabled);
    this.cdr.detectChanges();
  }
}
