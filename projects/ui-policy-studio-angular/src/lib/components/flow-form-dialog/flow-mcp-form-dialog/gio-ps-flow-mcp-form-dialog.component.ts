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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { capitalize, cloneDeep, isEmpty, trim, uniqueId } from 'lodash';
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
  GioIconsModule,
} from '@gravitee/ui-particles-angular';

import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';
import { ConditionSelector, McpSelector } from '../../../models';

export type GioPolicyStudioFlowMcpFormDialogData = {
  flow?: FlowVM;
  parentGroupName?: string;
};

const MCP_METHODS: {
  groupLabel: string;
  groupOptions: { value: string; label: string }[];
}[] = [
  {
    groupLabel: 'Lifecycle Methods',
    groupOptions: [
      { value: 'initialize', label: 'initialize' },
      { value: 'notifications/initialized', label: 'notifications/initialized' },
      { value: 'ping', label: 'ping' },
      { value: 'notifications/progress', label: 'notifications/progress' },
      { value: 'completion/complete', label: 'completion/complete' },
    ],
  },
  {
    groupLabel: 'Tool Methods',
    groupOptions: [
      { value: 'tools/list', label: 'tools/list' },
      { value: 'tools/call', label: 'tools/call' },
      { value: 'notifications/tools/list_changed', label: 'notifications/tools/list_changed' },
    ],
  },
  {
    groupLabel: 'Resources Methods',
    groupOptions: [
      { value: 'resources/list', label: 'resources/list' },
      { value: 'resources/read', label: 'resources/read' },
      { value: 'notifications/resources/list_changed', label: 'notifications/resources/list_changed' },
      { value: 'notifications/resources/updated', label: 'notifications/resources/updated' },
      { value: 'resources/templates/list', label: 'resources/templates/list' },
      { value: 'resources/subscribe', label: 'resources/subscribe' },
      { value: 'resources/unsubscribe', label: 'resources/unsubscribe' },
    ],
  },
  {
    groupLabel: 'Prompt Methods',
    groupOptions: [
      { value: 'prompts/list', label: 'prompts/list' },
      { value: 'prompts/get', label: 'prompts/get' },
      { value: 'notifications/prompts/list_changed', label: 'notifications/prompts/list_changed' },
    ],
  },
  {
    groupLabel: 'Logging Methods',
    groupOptions: [
      { value: 'logging/setLevel', label: 'logging/setLevel' },
      { value: 'notifications/message', label: 'notifications/message' },
    ],
  },
  {
    groupLabel: 'Roots Methods',
    groupOptions: [
      { value: 'roots/list', label: 'roots/list' },
      { value: 'notifications/roots/list_changed', label: 'notifications/roots/list_changed' },
    ],
  },
  {
    groupLabel: 'Sampling Methods',
    groupOptions: [{ value: 'sampling/createMessage', label: 'sampling/createMessage' }],
  },
  {
    groupLabel: 'Elicitation Methods',
    groupOptions: [{ value: 'elicitation/create', label: 'elicitation/create' }],
  },
];

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
    GioElAssistantComponent,
  ],
  selector: 'gio-ps-flow-mcp-form-dialog',
  templateUrl: './gio-ps-flow-mcp-form-dialog.component.html',
  styleUrls: ['./gio-ps-flow-mcp-form-dialog.component.scss'],
})
export class GioPolicyStudioFlowMcpFormDialogComponent {
  public flowFormGroup?: FormGroup<{
    name: FormControl<string | null>;
    mcpMethods: FormControl<string[] | null>;
    condition: FormControl<string | null>;
  }>;

  public existingFlow?: FlowVM;
  public mode: 'create' | 'edit' = 'create';
  public methods = MCP_METHODS;

  private defaultFlowName;

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioFlowMcpFormDialogComponent, GioPolicyStudioFlowFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioFlowMcpFormDialogData,
  ) {
    this.existingFlow = cloneDeep(flowDialogData?.flow);
    this.mode = this.existingFlow ? 'edit' : 'create';

    const mcpSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'MCP') as McpSelector;
    const conditionSelector = flowDialogData?.flow?.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;

    this.flowFormGroup = new FormGroup({
      name: new FormControl(flowDialogData?.flow?.name ?? ''),
      mcpMethods: new FormControl(mcpSelector?.methods ?? []),
      condition: new FormControl(conditionSelector?.condition ?? ''),
    });

    this.defaultFlowName = capitalize(flowDialogData.parentGroupName) + ' flow';
  }

  public onSubmit(): void {
    const mcpSelectorToSave: McpSelector = {
      type: 'MCP',
      methods: this.flowFormGroup?.get('mcpMethods')?.value ?? undefined,
    };

    const conditionValue = this.flowFormGroup?.get('condition')?.value ?? undefined;
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
      name: this.getFlowName(),
      enabled: this.existingFlow ? this.existingFlow.enabled : true,
      selectors: conditionSelectorToSave ? [mcpSelectorToSave, conditionSelectorToSave] : [mcpSelectorToSave],
    };

    this.dialogRef.close({
      ...flowToSave,
    });
  }

  private getFlowName(): string {
    const inputName = trim(this.flowFormGroup?.get('name')?.value ?? '');
    return isEmpty(inputName) ? this.defaultFlowName : inputName;
  }

  public tagValidationHook(tag: string, validationCb: (shouldAddTag: boolean) => void) {
    validationCb(
      MCP_METHODS.flatMap(group => group.groupOptions.map(m => m.value))
        .map(m => `${m}`)
        .includes(tag),
    );
  }
}
