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
import { CommonModule } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { Operator } from '../../../models/Operator';
import { ConditionForm } from '../../gio-el-editor.component';

@Component({
  selector: 'gio-el-editor-type-boolean',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatSlideToggle],
  templateUrl: './gio-el-editor-type-boolean.component.html',
  styleUrl: './gio-el-editor-type-boolean.component.scss',
})
export class GioElEditorTypeBooleanComponent implements OnChanges {
  @Input({
    required: true,
  })
  public conditionFormGroup!: FormGroup<ConditionForm>;

  protected operators: { label: string; value: Operator }[] = [
    { label: 'Equals', value: 'EQUALS' },
    { label: 'Not equals', value: 'NOT_EQUALS' },
  ];

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.conditionFormGroup) {
      const field = this.conditionFormGroup.controls.field.value;
      if (isEmpty(field) || field?.type !== 'boolean') {
        throw new Error('Boolean field is required!');
      }

      this.conditionFormGroup.addControl('operator', new FormControl(null));
      this.conditionFormGroup.addControl('value', new FormControl(null));
      this.conditionFormGroup.get('value')?.setValue(true);
    }
  }
}
