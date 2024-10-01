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
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { has, isEmpty, isNil } from 'lodash';
import { GioIconsModule } from '@gravitee/ui-particles-angular';

import { ConditionModel } from '../models/ConditionModel';
import { ConditionsModel, isConditionModel } from '../models/ConditionsModel';
import { ExpressionLanguageBuilder } from '../models/ExpressionLanguageBuilder';
import { ConditionGroup } from '../models/ConditionGroup';
import { Condition } from '../models/Condition';
import { Operator } from '../models/Operator';

import { GioElEditorTypeStringComponent } from './gio-el-type/gio-el-editor-type-string/gio-el-editor-type-string.component';
import { GioElEditorTypeBooleanComponent } from './gio-el-type/gio-el-editor-type-boolean/gio-el-editor-type-boolean.component';
import { GioElEditorTypeNumberComponent } from './gio-el-type/gio-el-editor-type-number/gio-el-editor-type-number.component';
import { GioElEditorTypeDateComponent } from './gio-el-type/gio-el-editor-type-date/gio-el-editor-type-date.component';
import { GioElEditorConditionGroupComponent } from './gio-el-editor-condition-group/gio-el-editor-condition-group.component';

export type ConditionForm = {
  field: FormControl<ConditionModel | null>;
  operator: FormControl<Operator | null>;
  value: FormControl<string | boolean | Date | number | null>;
};

export type ConditionGroupForm = {
  condition: FormControl<'AND' | 'OR'>;
  conditions: FormArray<FormGroup<ConditionForm> | FormGroup<ConditionGroupForm>>;
};

@Component({
  selector: 'gio-el-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatButtonModule,
    GioIconsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    GioElEditorTypeStringComponent,
    GioElEditorTypeBooleanComponent,
    GioElEditorTypeNumberComponent,
    GioElEditorTypeDateComponent,
    GioElEditorConditionGroupComponent,
  ],
  templateUrl: './gio-el-editor.component.html',
  styleUrl: './gio-el-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioElEditorComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true })
  public conditionsModel: ConditionsModel = [];

  protected conditionsGroupFormArray = new FormArray<FormGroup<ConditionGroupForm>>([]);
  protected conditionGroupFormGroup = newConditionGroupFormGroup();

  protected fields: ConditionModel[] = [];

  protected elOutput?: string;

  public ngOnInit() {
    for (const conditionModel of this.conditionsModel) {
      if (isConditionModel(conditionModel)) {
        // TOTO: Impl Deep Tree for conditions Limit to fist Node for fist impl
        this.fields.push(conditionModel);
      }
    }

    this.conditionGroupFormGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => this.conditionGroupFormGroup.getRawValue()),
        map(value => {
          type ConditionGroupValue = typeof value;
          type ConditionValue = Exclude<ConditionGroupValue['conditions'], undefined>[number];

          const toCondition = (
            conditionValue: ConditionValue,
          ): Condition<'string' | 'number' | 'date' | 'boolean'> | ConditionGroup | null => {
            if (isConditionGroupValue(conditionValue)) {
              return toConditionGroup(conditionValue as ConditionGroupValue);
            }
            if (
              !isConditionValue(conditionValue) ||
              isNil(conditionValue.field) ||
              isNil(conditionValue.operator) ||
              isNil(conditionValue.value)
            ) {
              return null;
            }
            return new Condition(conditionValue.field.field, conditionValue.field.type, conditionValue.operator, conditionValue.value);
          };

          const toConditionGroup = (conditionGroupValue: ConditionGroupValue): ConditionGroup | null => {
            const conditions: ConditionGroup['conditions'] = [];
            if (!conditionGroupValue.condition || !conditionGroupValue.conditions || isEmpty(conditionGroupValue.conditions)) {
              return null;
            }
            for (const conditionValue of conditionGroupValue.conditions) {
              const condition = toCondition(conditionValue);
              if (condition) {
                conditions.push(condition);
              }
            }
            if (isEmpty(conditions)) {
              return null;
            }

            return new ConditionGroup(conditionGroupValue.condition, conditions);
          };

          const conditionGroupValue = toConditionGroup(value);
          if (conditionGroupValue) {
            this.elOutput = new ExpressionLanguageBuilder(conditionGroupValue).build();
          }
        }),
      )
      .subscribe();
  }
}

const newConditionGroupFormGroup = (): FormGroup<ConditionGroupForm> => {
  return new FormGroup<ConditionGroupForm>({
    condition: new FormControl({ value: 'AND', disabled: true }, { nonNullable: true, validators: Validators.required }),
    conditions: new FormArray<FormGroup<ConditionForm> | FormGroup<ConditionGroupForm>>([]),
  });
};

const isConditionGroupValue = (
  value: unknown,
): value is {
  condition: 'AND' | 'OR';
  conditions: unknown[];
} => {
  return !!value && has(value, 'condition') && has(value, 'conditions');
};

const isConditionValue = (
  value: unknown,
): value is {
  field: ConditionModel;
  operator: Operator;
  value: string | boolean | Date | number;
} => {
  return !!value && has(value, 'field') && has(value, 'operator') && has(value, 'value');
};
