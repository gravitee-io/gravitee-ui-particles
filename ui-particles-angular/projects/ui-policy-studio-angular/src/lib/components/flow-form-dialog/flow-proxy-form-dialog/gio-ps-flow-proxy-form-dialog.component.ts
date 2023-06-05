/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { cloneDeep, uniqueId } from 'lodash';

import { FlowVM } from '../../../gio-policy-studio.model';
import { ConditionSelector, HttpMethod, HttpMethods, HttpSelector } from '../../../models';
import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';

export type GioPolicyStudioFlowProxyFormDialogData = {
  flow?: FlowVM;
};

type HttpMethodVM = HttpMethod | 'ALL';

const METHODS_AUTOCOMPLETE: HttpMethodVM[] = ['ALL', ...HttpMethods];

@Component({
  selector: 'gio-ps-flow-proxy-form-dialog',
  templateUrl: './gio-ps-flow-proxy-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-proxy-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowProxyFormDialogComponent {
  public flowFormGroup?: FormGroup;

  public existingFlow?: FlowVM;
  public mode: 'create' | 'edit' = 'create';
  public methods = METHODS_AUTOCOMPLETE;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowProxyFormDialogComponent, GioPolicyStudioFlowFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowProxyFormDialogData,
  ) {
    this.existingFlow = cloneDeep(flowDialogData?.flow);
    this.mode = this.existingFlow ? 'edit' : 'create';

    const httpSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
    const conditionSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;

    this.flowFormGroup = new FormGroup({
      name: new FormControl(flowDialogData?.flow?.name ?? ''),
      pathOperator: new FormControl(httpSelector?.pathOperator ?? 'EQUALS'),
      path: new FormControl(httpSelector?.path ?? ''),
      methods: new FormControl(sanitizeMethodFormValue(httpSelector?.methods)),
      condition: new FormControl(conditionSelector?.condition ?? ''),
    });
  }

  public onSubmit(): void {
    const httpSelectorToSave: HttpSelector = {
      type: 'HTTP',
      path: this.flowFormGroup?.get('path')?.value,
      pathOperator: this.flowFormGroup?.get('pathOperator')?.value,
      methods: sanitizeMethods(this.flowFormGroup?.get('methods')?.value),
    };

    const conditionValue: string = this.flowFormGroup?.get('condition')?.value;
    const conditionSelectorToSave: ConditionSelector | undefined = conditionValue
      ? {
          type: 'CONDITION',
          condition: conditionValue,
        }
      : undefined;

    const flowToSave: FlowVM = {
      // New id for new flow
      _id: uniqueId('flow_'),
      // If existing flow, keep root props
      ...this.existingFlow,
      // Mark as changed
      _hasChanged: true,
      // Add changes
      name: this.flowFormGroup?.get('name')?.value,
      selectors: conditionSelectorToSave ? [httpSelectorToSave, conditionSelectorToSave] : [httpSelectorToSave],
      enabled: true,
    };

    this.dialogRef.close({
      ...flowToSave,
    });
  }

  public tagValidationHook(tag: string, validationCb: (shouldAddTag: boolean) => void) {
    validationCb(METHODS_AUTOCOMPLETE.map(m => `${m}`).includes(tag.toUpperCase()));
  }
}

const sanitizeMethods: (value: HttpMethodVM[]) => HttpMethod[] = (value?: HttpMethodVM[]) => {
  if (!value || value.find(m => m === 'ALL')) return [];
  return value as HttpMethod[];
};

const sanitizeMethodFormValue: (methods?: HttpMethod[]) => HttpMethodVM[] = (methods?: HttpMethod[]) => {
  if (!methods || methods.length === 0) return ['ALL'];
  return methods;
};
