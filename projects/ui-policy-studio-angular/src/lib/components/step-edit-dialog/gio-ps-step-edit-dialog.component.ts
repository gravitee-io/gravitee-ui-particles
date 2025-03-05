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
import { GioIconsModule } from '@gravitee/ui-particles-angular';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { FlowPhase, Step, GenericPolicy, ApiType } from '../../models';
import { GioPolicyStudioStepFormComponent } from '../step-form/gio-ps-step-form.component';

export type GioPolicyStudioStepEditDialogData = {
  genericPolicy: GenericPolicy;
  step: Step;
  flowPhase: FlowPhase;
  apiType: ApiType;
  readOnly?: boolean;
};

export type GioPolicyStudioStepEditDialogResult = undefined | Step;

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, GioIconsModule, GioPolicyStudioStepFormComponent],
  selector: 'gio-ps-step-edit-dialog',
  templateUrl: './gio-ps-step-edit-dialog.component.html',
  styleUrls: ['./gio-ps-step-edit-dialog.component.scss'],
})
export class GioPolicyStudioStepEditDialogComponent {
  public genericPolicy!: GenericPolicy;
  public step!: Step;
  public flowPhase!: FlowPhase;
  public apiType!: ApiType;

  public isValid = false;
  public readOnly = false;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioStepEditDialogComponent, GioPolicyStudioStepEditDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioStepEditDialogData,
  ) {
    this.flowPhase = flowDialogData.flowPhase;
    this.apiType = flowDialogData.apiType;
    this.genericPolicy = flowDialogData.genericPolicy;
    this.step = flowDialogData.step;
    this.readOnly = Boolean(flowDialogData.readOnly);
  }

  public onSave(): void {
    this.dialogRef.close({
      ...this.step,
    });
  }
}
