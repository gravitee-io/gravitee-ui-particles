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

import { ExecutionPhase, Policy, Step } from '../../models';

export type GioPolicyStudioStepEditDialogData = {
  policy: Policy;
  step: Step;
  executionPhase: ExecutionPhase;
  readOnly?: boolean;
};

export type GioPolicyStudioStepEditDialogResult = undefined | Step;

@Component({
  selector: 'gio-ps-step-edit-dialog',
  templateUrl: './gio-ps-step-edit-dialog.component.html',
  styleUrls: ['./gio-ps-step-edit-dialog.component.scss'],
})
export class GioPolicyStudioStepEditDialogComponent {
  public policy!: Policy;
  public step!: Step;
  public executionPhase!: ExecutionPhase;

  public isValid = false;
  public readOnly = false;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioStepEditDialogComponent, GioPolicyStudioStepEditDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioStepEditDialogData,
  ) {
    this.executionPhase = flowDialogData.executionPhase;
    this.policy = flowDialogData.policy;
    this.step = flowDialogData.step;
    this.readOnly = Boolean(flowDialogData.readOnly);
  }

  public onSave(): void {
    this.dialogRef.close({
      ...this.step,
    });
  }
}
