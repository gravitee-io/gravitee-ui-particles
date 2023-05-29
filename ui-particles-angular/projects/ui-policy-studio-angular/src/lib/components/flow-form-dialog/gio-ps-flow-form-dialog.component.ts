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
import { uniqueId } from 'lodash';

import { FlowVM } from '../../gio-policy-studio.model';
import { ChannelSelector, ConditionSelector } from '../../models';

export type GioPolicyStudioFlowFormDialogData = {
  flow?: FlowVM;
  entrypoints?: string[];
};

@Component({
  selector: 'gio-ps-flow-form-dialog',
  templateUrl: './gio-ps-flow-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowFormDialogComponent {
  public entrypoints: string[] = [];
  public flowFormGroup?: FormGroup;

  public existingFlow?: FlowVM;
  public mode: 'create' | 'edit' = 'create';

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowFormDialogComponent, FlowVM | false>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowFormDialogData,
  ) {
    this.entrypoints = flowDialogData?.entrypoints ?? [];

    this.existingFlow = flowDialogData?.flow;
    this.mode = this.existingFlow ? 'edit' : 'create';

    const channelSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    const conditionSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;

    this.flowFormGroup = new FormGroup({
      name: new FormControl(flowDialogData?.flow?.name ?? ''),
      channelOperator: new FormControl(channelSelector?.channelOperator ?? ''),
      channel: new FormControl(channelSelector?.channel ?? ''),
      operations: new FormControl(channelSelector?.operations ?? ''),
      entrypoints: new FormControl(channelSelector?.entrypoints ?? ''),
      condition: new FormControl(conditionSelector?.condition ?? ''),
    });
  }

  public onSubmit(): void {
    const chanelSelectorToSave: ChannelSelector = {
      type: 'CHANNEL',
      channel: this.flowFormGroup?.get('channel')?.value,
      channelOperator: this.flowFormGroup?.get('channelOperator')?.value,
      operations: this.flowFormGroup?.get('operations')?.value,
      entrypoints: this.flowFormGroup?.get('entrypoints')?.value,
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
      name: this.flowFormGroup?.get('name')?.value,
      selectors: conditionSelectorToSave ? [chanelSelectorToSave, conditionSelectorToSave] : [chanelSelectorToSave],
      enabled: true,
    };

    this.dialogRef.close({
      ...flowToSave,
    });
  }
}
