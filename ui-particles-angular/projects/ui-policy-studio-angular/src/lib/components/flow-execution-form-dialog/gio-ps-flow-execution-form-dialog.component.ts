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
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';

import { FlowExecution } from '../../models';

export type GioPolicyStudioFlowExecutionFormDialogData = {
  flowExecution?: FlowExecution;
};

@Component({
  selector: 'gio-ps-flow-execution-form-dialog',
  templateUrl: './gio-ps-flow-execution-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-execution-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowExecutionFormDialogComponent {
  public flowExecutionFormGroup?: UntypedFormGroup;

  public existingFlowExecution?: FlowExecution;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowExecutionFormDialogComponent, FlowExecution | undefined>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowExecutionFormDialogData,
  ) {
    this.existingFlowExecution = cloneDeep(flowDialogData?.flowExecution);

    this.flowExecutionFormGroup = new UntypedFormGroup({
      mode: new UntypedFormControl(flowDialogData?.flowExecution?.mode ?? 'DEFAULT'),
      matchRequired: new UntypedFormControl(flowDialogData?.flowExecution?.matchRequired ?? false),
    });
  }

  public onSubmit(): void {
    const flowExecutionToSave: FlowExecution = {
      ...this.existingFlowExecution,
      mode: this.flowExecutionFormGroup?.get('mode')?.value,
      matchRequired: this.flowExecutionFormGroup?.get('matchRequired')?.value,
    };

    this.dialogRef.close({
      ...flowExecutionToSave,
    });
  }
}
