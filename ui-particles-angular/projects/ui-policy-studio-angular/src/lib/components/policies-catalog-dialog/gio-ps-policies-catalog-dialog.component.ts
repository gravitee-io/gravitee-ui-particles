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

import { ApiType, ExecutionPhase, Policy } from '../../models';

export type GioPolicyStudioPoliciesCatalogDialogData = {
  policies: Policy[];
  executionPhase: ExecutionPhase;
  apiType: ApiType;
};

export type GioPolicyStudioPoliciesCatalogDialogResult = undefined | Policy;

const executionPhaseLabels: Record<ExecutionPhase, string> = {
  REQUEST: 'Request',
  RESPONSE: 'Response',
  MESSAGE_REQUEST: 'Publish',
  MESSAGE_RESPONSE: 'Subscribe',
};

@Component({
  selector: 'gio-ps-policies-catalog-dialog',
  templateUrl: './gio-ps-policies-catalog-dialog.component.html',
  styleUrls: ['./gio-ps-policies-catalog-dialog.component.scss'],
})
export class GioPolicyStudioPoliciesCatalogDialogComponent {
  public policies: Policy[] = [];

  public executionPhaseLabel!: string;

  private selectedPolicy?: Policy;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioPoliciesCatalogDialogComponent, GioPolicyStudioPoliciesCatalogDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioPoliciesCatalogDialogData,
  ) {
    this.policies = flowDialogData.policies.filter(policy => {
      if (flowDialogData.apiType === 'PROXY') {
        return policy.proxy?.includes(flowDialogData.executionPhase);
      }
      return policy.message?.includes(flowDialogData.executionPhase);
    });
    this.executionPhaseLabel = executionPhaseLabels[flowDialogData.executionPhase];
  }

  public onSelectPolicy(policy: Policy) {
    this.selectedPolicy = policy;
  }

  public onAddPolicy() {
    this.dialogRef.close(this.selectedPolicy);
  }
}
