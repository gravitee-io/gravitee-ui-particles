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
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isEmpty } from 'lodash';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


import { ConditionForm } from '../../gio-el-editor.component';
import { Operator } from '../../../models/Operator';

@Component({
  selector: 'gio-el-editor-type-number',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './gio-el-editor-type-number.component.html',
  styleUrl: './gio-el-editor-type-number.component.scss',
})
export class GioElEditorTypeNumberComponent implements OnChanges {
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

  protected min: number | null = null;
  protected max: number | null = null;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.conditionFormGroup) {
      const field = this.conditionFormGroup.controls.field.value;
      if (isEmpty(field) || field?.type !== 'number') {
        throw new Error('Number field is required!');
      }
      if (field.min) {
        this.min = field.min;
      }
      if (field.max) {
        this.max = field.max;
      }

      this.conditionFormGroup.addControl('operator', new FormControl(null));
      this.conditionFormGroup.addControl('value', new FormControl(true));
    }
  }
}
