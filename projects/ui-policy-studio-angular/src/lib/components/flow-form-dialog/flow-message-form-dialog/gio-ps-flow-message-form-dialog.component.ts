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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GioBannerModule, GioElAssistantComponent, GioFormSlideToggleModule, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatInputModule } from '@angular/material/input';

import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { ChannelSelector, ConditionSelector, ConnectorInfo } from '../../../models';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';

export type GioPolicyStudioFlowMessageFormDialogData = {
  flow?: FlowVM;
  entrypoints?: ConnectorInfo[];
};

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
    GioElAssistantComponent
],
  selector: 'gio-ps-flow-message-form-dialog',
  templateUrl: './gio-ps-flow-message-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-message-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowMessageFormDialogComponent {
  public entrypoints: ConnectorInfo[] = [];
  public flowFormGroup?: UntypedFormGroup;

  public existingFlow?: FlowVM;
  public mode: 'create' | 'edit' = 'create';

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowMessageFormDialogComponent, GioPolicyStudioFlowFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowMessageFormDialogData,
  ) {
    this.entrypoints = flowDialogData?.entrypoints ?? [];

    this.existingFlow = cloneDeep(flowDialogData?.flow);
    this.mode = this.existingFlow ? 'edit' : 'create';

    const channelSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    const conditionSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;

    this.flowFormGroup = new UntypedFormGroup({
      name: new UntypedFormControl(flowDialogData?.flow?.name ?? ''),
      channelOperator: new UntypedFormControl(channelSelector?.channelOperator ?? 'EQUALS'),
      channel: new UntypedFormControl(channelSelector?.channel ?? ''),
      operations: new UntypedFormControl(channelSelector?.operations ?? []),
      entrypoints: new UntypedFormControl(channelSelector?.entrypoints ?? []),
      condition: new UntypedFormControl(conditionSelector?.condition ?? ''),
    });
  }

  public onSubmit(): void {
    const channelSelectorToSave: ChannelSelector = {
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
      // Mark as changed
      _hasChanged: true,
      // Add changes
      name: this.flowFormGroup?.get('name')?.value,
      selectors: conditionSelectorToSave ? [channelSelectorToSave, conditionSelectorToSave] : [channelSelectorToSave],
      enabled: this.existingFlow ? this.existingFlow.enabled : true,
    };

    this.dialogRef.close({
      ...flowToSave,
    });
  }
}
