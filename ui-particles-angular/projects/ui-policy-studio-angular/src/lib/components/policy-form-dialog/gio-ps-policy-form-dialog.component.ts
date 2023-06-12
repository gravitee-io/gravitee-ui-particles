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

import { Policy } from '../../models';

export type GioPolicyStudioPolicyFormDialogData = {
  policy: Policy;
};

export type GioPolicyStudioPolicyFormDialogResult = undefined;

@Component({
  selector: 'gio-ps-policy-form-dialog',
  templateUrl: './gio-ps-policy-form-dialog.component.html',
  styleUrls: ['./gio-ps-policy-form-dialog.component.scss'],
})
export class GioPolicyStudioPolicyFormDialogComponent {
  public policy?: Policy;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioPolicyFormDialogComponent, GioPolicyStudioPolicyFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioPolicyFormDialogData,
  ) {
    this.policy = flowDialogData.policy;
  }
}
