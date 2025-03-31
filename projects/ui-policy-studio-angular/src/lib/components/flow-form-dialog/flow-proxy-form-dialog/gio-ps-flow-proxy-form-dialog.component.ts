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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { cloneDeep, uniqueId } from 'lodash';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GioBannerModule, GioFormSlideToggleModule, GioFormTagsInputModule, GioIconsModule } from '@gravitee/ui-particles-angular';

import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { ConditionSelector, HttpMethod, HttpMethods, HttpSelector } from '../../../models';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';

export type GioPolicyStudioFlowProxyFormDialogData = {
  flow?: FlowVM;
};

type HttpMethodVM = HttpMethod | 'ALL';

const METHODS_AUTOCOMPLETE: HttpMethodVM[] = ['ALL', ...HttpMethods];

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    GioFormSlideToggleModule,
    GioBannerModule,
    GioIconsModule,
    GioFormTagsInputModule,
  ],
  selector: 'gio-ps-flow-proxy-form-dialog',
  templateUrl: './gio-ps-flow-proxy-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-proxy-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowProxyFormDialogComponent {
  public flowFormGroup?: UntypedFormGroup;

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

    this.flowFormGroup = new UntypedFormGroup({
      name: new UntypedFormControl(flowDialogData?.flow?.name ?? ''),
      pathOperator: new UntypedFormControl(httpSelector?.pathOperator ?? 'EQUALS'),
      path: new UntypedFormControl(sanitizePathFormValue(httpSelector?.path)),
      methods: new UntypedFormControl(sanitizeMethodFormValue(httpSelector?.methods)),
      condition: new UntypedFormControl(conditionSelector?.condition ?? ''),
    });
  }

  public onSubmit(): void {
    const httpSelectorToSave: HttpSelector = {
      type: 'HTTP',
      path: sanitizePath(this.flowFormGroup?.get('path')?.value),
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
      enabled: this.existingFlow ? this.existingFlow.enabled : true,
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

export const sanitizePath = (path: string) => {
  if (!path || !path.startsWith('/')) {
    return `/${path}`;
  }
  return path;
};

const sanitizePathFormValue = (path: string | undefined) => {
  if (path && path.startsWith('/')) {
    return path.substring(1);
  }
  return path ?? '';
};
