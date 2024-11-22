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
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { GioIconsModule } from '@gravitee/ui-particles-angular';

import { GioElConditionTypeBooleanComponent } from '../gio-el-condition-types/gio-el-condition-type-boolean/gio-el-condition-type-boolean.component';
import { GioElConditionTypeDateComponent } from '../gio-el-condition-types/gio-el-condition-type-date/gio-el-condition-type-date.component';
import { GioElConditionTypeNumberComponent } from '../gio-el-condition-types/gio-el-condition-type-number/gio-el-condition-type-number.component';
import { GioElConditionTypeStringComponent } from '../gio-el-condition-types/gio-el-condition-type-string/gio-el-condition-type-string.component';
import { ConditionForm, ConditionGroupForm } from '../gio-el-condition-builder.component';
import { ElProperties } from '../../models/ElProperties';
import { GioElFieldComponent } from '../gio-el-field/gio-el-field.component';

@Component({
  selector: 'gio-el-condition-group',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    GioIconsModule,
    GioElConditionTypeBooleanComponent,
    GioElConditionTypeDateComponent,
    GioElConditionTypeStringComponent,
    GioElConditionTypeNumberComponent,
    GioElFieldComponent,
  ],
  templateUrl: './gio-el-condition-group.component.html',
  styleUrl: './gio-el-condition-group.component.scss',
})
export class GioElConditionGroupComponent {
  @Input({
    required: true,
  })
  public conditionGroupFormGroup!: FormGroup<ConditionGroupForm>;

  /**
   * El properties to generate the fields for the conditions.
   */
  @Input({
    required: true,
  })
  public elProperties: ElProperties = [];

  /**
   * Level of the node in the tree. Useful for testing with Harness to limit the scope of the query.
   */
  @Input()
  @HostBinding('attr.node-lvl')
  public nodeLvl = 0;

  @Output()
  public remove = new EventEmitter<void>();

  protected addConditionGroup() {
    this.conditionGroupFormGroup.controls.conditions.push(newConditionGroupFormGroup(), { emitEvent: true });
    this.checkMultipleCondition();
  }

  protected addCondition() {
    this.conditionGroupFormGroup.controls.conditions.push(newConditionFormGroup());
    this.checkMultipleCondition();
  }

  protected removeCondition(conditionIndex: number) {
    this.conditionGroupFormGroup.controls.conditions.removeAt(conditionIndex);
    this.checkMultipleCondition();
  }

  protected removeConditionGroup() {
    this.remove.emit();
    this.checkMultipleCondition();
  }

  protected isConditionGroupForm(
    formGroup: FormGroup<ConditionForm> | FormGroup<ConditionGroupForm>,
  ): formGroup is FormGroup<ConditionGroupForm> {
    return 'condition' in formGroup.controls && 'conditions' in formGroup.controls;
  }

  private checkMultipleCondition(): void {
    if (this.conditionGroupFormGroup.controls.conditions.length > 1) {
      this.conditionGroupFormGroup.controls.condition.enable();
    } else {
      this.conditionGroupFormGroup.controls.condition.disable();
    }
  }
}

const newConditionGroupFormGroup = (): FormGroup<ConditionGroupForm> => {
  return new FormGroup<ConditionGroupForm>({
    condition: new FormControl({ value: 'AND', disabled: true }, { nonNullable: true, validators: Validators.required }),
    conditions: new FormArray<FormGroup<ConditionForm> | FormGroup<ConditionGroupForm>>([]),
  });
};

const newConditionFormGroup = (): FormGroup<ConditionForm> => {
  return new FormGroup<ConditionForm>({
    field: new FormControl(null),
    operator: new FormControl(null),
    value: new FormControl(null),
  });
};
