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
import { cloneDeep } from 'lodash';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GioBannerModule, GioFormSlideToggleModule, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FlowExecution } from '../../models';

export type GioPolicyStudioFlowExecutionFormDialogData = {
  flowExecution?: FlowExecution;
  readOnly?: boolean;
};

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    GioFormSlideToggleModule,
    GioBannerModule,
    GioIconsModule,
  ],
  selector: 'gio-ps-flow-execution-form-dialog',
  templateUrl: './gio-ps-flow-execution-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-execution-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowExecutionFormDialogComponent {
  public flowExecutionFormGroup?: UntypedFormGroup;

  public existingFlowExecution?: FlowExecution;

  public readOnly = false;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowExecutionFormDialogComponent, FlowExecution | undefined>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowExecutionFormDialogData,
  ) {
    this.existingFlowExecution = cloneDeep(flowDialogData?.flowExecution);

    this.flowExecutionFormGroup = new UntypedFormGroup({
      mode: new UntypedFormControl(flowDialogData?.flowExecution?.mode ?? 'DEFAULT'),
      matchRequired: new UntypedFormControl(flowDialogData?.flowExecution?.matchRequired ?? false),
    });

    this.readOnly = Boolean(flowDialogData.readOnly);

    if (this.readOnly) {
      this.flowExecutionFormGroup.disable({ emitEvent: false });
    }
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
