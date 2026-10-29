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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  GioBannerModule,
  GioElAssistantComponent,
  GioFormSlideToggleModule,
  GioFormTagsInputModule,
  GioFormAutocompleteInputModule,
  GioIconsModule,
} from '@gravitee/ui-particles-angular';

import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { ConditionSelector, HttpMethod, HttpSelector } from '../../../models';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';

export type GioPolicyStudioFlowLlmFormDialogData = {
  flow?: FlowVM;
};

type HttpMethodVM = HttpMethod;

const METHODS_AUTOCOMPLETE: HttpMethodVM[] = ['POST', 'GET'];
const LLM_PATHS: string[] = ['/chat/completions', '/embeddings', '/models'];

@Component({
  imports: [
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
    GioFormAutocompleteInputModule,

    GioElAssistantComponent,
  ],
  selector: 'gio-ps-flow-llm-form-dialog',
  templateUrl: './gio-ps-flow-llm-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-llm-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowLlmFormDialogComponent {
  public flowFormGroup?: UntypedFormGroup;

  public existingFlow?: FlowVM;
  public mode: 'create' | 'edit' = 'create';
  public methods = METHODS_AUTOCOMPLETE;
  public paths = LLM_PATHS;
  public availableMethods: HttpMethodVM[] = ['POST', 'GET'];

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowLlmFormDialogComponent, GioPolicyStudioFlowFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowLlmFormDialogData,
  ) {
    this.existingFlow = cloneDeep(flowDialogData?.flow);
    const httpSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
    const conditionSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;

    this.flowFormGroup = new UntypedFormGroup({
      name: new UntypedFormControl(flowDialogData?.flow?.name ?? ''),
      pathOperator: new UntypedFormControl(httpSelector?.pathOperator ?? 'EQUALS'),
      path: new UntypedFormControl(sanitizePathFormValue(httpSelector?.path)),
      methods: new UntypedFormControl(sanitizeMethodFormValue(httpSelector?.methods)),
      condition: new UntypedFormControl(conditionSelector?.condition ?? ''),
    });
    // Subscribe to path changes to update methods
    this.flowFormGroup.get('path')?.valueChanges.subscribe((path: string) => {
      const fullPath = sanitizePath(path);

      switch (fullPath) {
        case '/chat/completions':
          this.availableMethods = ['POST'];
          break;
        case '/embeddings':
          this.availableMethods = ['POST'];
          break;
        case '/models':
          this.availableMethods = ['GET'];
          break;
        default:
          this.availableMethods = [];
          break;
      }
      this.flowFormGroup?.get('methods')?.setValue([]);
    });
    const selectedPath = this.flowFormGroup.get('path')?.value;
    switch (selectedPath) {
      case '/chat/completions':
        if (this.methods.includes('POST')) this.availableMethods = [];
        else this.availableMethods = ['POST'];
        break;
      case '/embeddings':
        if (this.methods.includes('POST')) this.availableMethods = [];
        else this.availableMethods = ['POST'];
        break;
      case '/models':
        if (this.methods.includes('GET')) this.availableMethods = [];
        else this.availableMethods = ['GET'];
        break;
      default:
        this.availableMethods = [];
        break;
    }
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
  if (!value) return [];
  return value as HttpMethod[];
};

const sanitizeMethodFormValue: (methods?: HttpMethod[]) => HttpMethodVM[] = (methods?: HttpMethod[]) => {
  if (!methods || methods.length === 0) return [];

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
