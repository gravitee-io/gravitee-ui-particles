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
import { isEmpty, toString } from 'lodash';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConditionForm } from '../../gio-el-condition-builder.component';
import { Operator } from '../../models/Operator';
import { ifMultiMapElProperty, isMapElProperty } from '../../../models/ElProperty';

type AutocompleteValue = { value: string; label: string };

@Component({
  selector: 'gio-el-condition-type-string',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './gio-el-condition-type-string.component.html',
  styleUrl: './gio-el-condition-type-string.component.scss',
})
export class GioElConditionTypeStringComponent implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input({
    required: true,
  })
  public conditionFormGroup!: FormGroup<ConditionForm>;

  protected operators: { label: string; value: Operator }[] = [
    { label: 'Equals', value: 'EQUALS' },
    { label: 'Not equals', value: 'NOT_EQUALS' },
  ];

  protected filteredOptions$ = new Observable<AutocompleteValue[]>();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.conditionFormGroup) {
      const field = this.conditionFormGroup.controls.field.value;
      if (
        isEmpty(field) ||
        !field ||
        (!isMapElProperty(field, 'string') && !ifMultiMapElProperty(field, 'string') && field.type !== 'string')
      ) {
        throw new Error('String field is required!');
      }

      this.conditionFormGroup.addControl('operator', new FormControl(null));
      this.conditionFormGroup.addControl('value', new FormControl(null));

      const fieldValues =
        isMapElProperty(field, 'string') || ifMultiMapElProperty(field, 'string') ? field.valueProperty?.values : field.values;

      const values = fieldValues?.map(value => (typeof value === 'string' ? { value, label: value } : value));
      if (values && !isEmpty(values)) {
        this.filteredOptions$ = this.conditionFormGroup.get('value')!.valueChanges.pipe(
          takeUntilDestroyed(this.destroyRef),
          startWith(''),
          map(value => filterValues(values, toString(value) ?? '')),
        );
      }
    }
  }
}

const filterValues = (values: AutocompleteValue[], value: string) => {
  const filterValue = value.toLowerCase();

  return values.filter(option => option.label.toLowerCase().includes(filterValue) || option.value.toLowerCase().includes(filterValue));
};
