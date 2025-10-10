/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isDate, isEmpty } from 'lodash';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Operator } from '../../../models/Operator';
import { ConditionForm } from '../../gio-el-editor.component';

@Component({
  selector: 'gio-el-editor-type-date',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './gio-el-editor-type-date.component.html',
  styleUrl: './gio-el-editor-type-date.component.scss',
})
export class GioElEditorTypeDateComponent implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  @Input({
    required: true,
  })
  public conditionFormGroup!: FormGroup<ConditionForm>;

  protected operators: { label: string; value: Operator }[] = [
    { label: 'Equals', value: 'EQUALS' },
    { label: 'Not equals', value: 'NOT_EQUALS' },
    { label: 'Less than', value: 'LESS_THAN' },
    { label: 'Less than or equals', value: 'LESS_THAN_OR_EQUALS' },
    { label: 'Greater than', value: 'GREATER_THAN' },
    { label: 'Greater than or equals', value: 'GREATER_THAN_OR_EQUALS' },
  ];

  protected datepickerControl = new FormControl();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.conditionFormGroup) {
      const field = this.conditionFormGroup.controls.field.value;
      if (isEmpty(field) || field?.type !== 'date') {
        throw new Error('Date field is required!');
      }
      this.conditionFormGroup.addControl('operator', new FormControl(null));
      this.conditionFormGroup.addControl('value', new FormControl(true));

      this.datepickerControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
        if (!isDate(value)) {
          return;
        }
        // Convert date to UTC ignoring timezone
        const dateUtc = Date.UTC(
          value.getFullYear(),
          value.getMonth(),
          value.getDate(),
          value.getHours(),
          value.getMinutes(),
          value.getSeconds(),
        );
        this.conditionFormGroup.controls.value.setValue(new Date(dateUtc));
      });
    }
  }
}
