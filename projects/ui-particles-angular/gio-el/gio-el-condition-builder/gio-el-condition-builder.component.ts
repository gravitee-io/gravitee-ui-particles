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
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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

import { ElProperty, ElPropertyType } from '../models/ElProperty';
import { ElProperties } from '../models/ElProperties';

import { ExpressionLanguageBuilder } from './models/ExpressionLanguageBuilder';
import { ConditionGroup } from './models/ConditionGroup';
import { Condition } from './models/Condition';
import { Operator } from './models/Operator';
import { GioElConditionGroupComponent } from './gio-el-condition-group/gio-el-condition-group.component';

export type ConditionForm = {
  field: FormControl<ElProperty | null>;
  operator: FormControl<Operator | null>;
  value: FormControl<string | boolean | Date | number | null>;
};

export type ConditionGroupForm = {
  condition: FormControl<'AND' | 'OR'>;
  conditions: FormArray<FormGroup<ConditionForm> | FormGroup<ConditionGroupForm>>;
};

@Component({
  selector: 'gio-el-condition-builder',
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
    GioElConditionGroupComponent,
  ],
  templateUrl: './gio-el-condition-builder.component.html',
  styleUrl: './gio-el-condition-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioElConditionBuilderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true })
  public elProperties: ElProperties = [];

  @Output()
  public elChange = new EventEmitter<string>();

  protected conditionGroupFormGroup = newConditionGroupFormGroup();

  protected elOutput?: string;

  public ngOnInit() {
    this.conditionGroupFormGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => this.conditionGroupFormGroup.getRawValue()),
        map(value => {
          type ConditionGroupValue = typeof value;
          type ConditionValue = Exclude<ConditionGroupValue['conditions'], undefined>[number];

          const toCondition = (conditionValue: ConditionValue): Condition<ElPropertyType> | ConditionGroup | null => {
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
            let field: Condition<ElPropertyType>['field'] = conditionValue.field.field;

            if (conditionValue.field.type === 'Map') {
              field = {
                field: conditionValue.field.field,
                key1: conditionValue.field.key ?? undefined,
              };
            }
            if (conditionValue.field.type === 'MultiMap') {
              field = {
                field: conditionValue.field.field,
                key1: conditionValue.field.key1 ?? undefined,
                key2: conditionValue.field.key2 ?? undefined,
              };
            }

            return new Condition(field, conditionValue.field.type, conditionValue.operator, conditionValue.value);
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
            this.elChange.emit(this.elOutput);
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
  field: ElProperty;
  operator: Operator;
  value: string | boolean | Date | number;
} => {
  return !!value && has(value, 'field') && has(value, 'operator') && has(value, 'value');
};
