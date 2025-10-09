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
import { capitalize, cloneDeep, isEmpty, trim, uniqueId } from 'lodash';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GioBannerModule, GioFormSlideToggleModule, GioFormTagsInputModule, GioIconsModule } from '@gravitee/ui-particles-angular';

import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';

export type GioPolicyStudioFlowNativeFormDialogData = {
  flow?: FlowVM;
  parentGroupName?: string;
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
    GioFormTagsInputModule
],
  selector: 'gio-ps-flow-native-form-dialog',
  templateUrl: './gio-ps-flow-native-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-native-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowNativeFormDialogComponent {
  public flowFormGroup?: UntypedFormGroup;

  public existingFlow?: FlowVM;
  public mode: 'create' | 'edit' = 'create';

  private defaultFlowName;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowNativeFormDialogComponent, GioPolicyStudioFlowFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowNativeFormDialogData,
  ) {
    this.existingFlow = cloneDeep(flowDialogData?.flow);
    this.mode = this.existingFlow ? 'edit' : 'create';

    this.flowFormGroup = new UntypedFormGroup({
      name: new UntypedFormControl(flowDialogData?.flow?.name ?? ''),
    });

    this.defaultFlowName = capitalize(flowDialogData.parentGroupName) + ' flow';
  }

  public onSubmit(): void {
    const flowToSave: FlowVM = {
      // New id for new flow
      _id: uniqueId('flow_'),
      // If existing flow, keep root props
      ...this.existingFlow,
      // Mark as changed
      _hasChanged: true,
      // Add changes
      name: this.getFlowName(),
      enabled: this.existingFlow ? this.existingFlow.enabled : true,
    };

    this.dialogRef.close({
      ...flowToSave,
    });
  }

  private getFlowName(): string {
    const inputName = trim(this.flowFormGroup?.get('name')?.value);
    return isEmpty(inputName) ? this.defaultFlowName : inputName;
  }
}
