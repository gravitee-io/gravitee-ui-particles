/*
 * Copyright (C) 2022 The Gravitee team (http://gravitee.io)
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
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { cloneDeep, differenceBy, flatten, isEqual, omit, unionBy, uniqueId } from 'lodash';
import { EMPTY, Subscription, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import {
  ConnectorInfo,
  Flow,
  FlowExecution,
  Plan,
  Policy,
  PolicyDocumentationFetcher,
  PolicySchemaFetcher,
  SaveOutput,
  SharedPolicyGroupPolicy,
  toGenericPolicies,
  GenericPolicy,
  PolicyInput,
  fromPolicyInput,
  ApiType,
} from '../models';
import { GioPolicyStudioFlowsMenuComponent } from '../components/flows-menu/gio-ps-flows-menu.component';
import { GioPolicyStudioDetailsComponent } from '../components/flow-details/gio-ps-flow-details.component';

import { FlowGroupVM, FlowVM } from './gio-policy-studio.model';
import { GioPolicyStudioService } from './gio-policy-studio.service';

@Component({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    GioIconsModule,
    GioPolicyStudioFlowsMenuComponent,
    GioPolicyStudioDetailsComponent,
  ],
  selector: 'gio-policy-studio',
  templateUrl: './gio-policy-studio.component.html',
  styleUrls: ['./gio-policy-studio.component.scss'],
})
export class GioPolicyStudioComponent implements OnChanges, OnDestroy {
  /**
   * May be set to `true` if the API is not manageable from the UI (e.g. kubernetes operator APIs)
   */
  @Input()
  public readOnly = false;

  /**
   * API type (required)
   */
  @Input()
  public apiType!: ApiType;

  /**
   * Flow execution config (required)
   */
  @Input()
  public flowExecution!: FlowExecution;

  /**
   * List of entrypoints to display
   */
  @Input()
  public entrypointsInfo: ConnectorInfo[] = [];

  /**
   * List of endpoints to display
   */
  @Input()
  public endpointsInfo: ConnectorInfo[] = [];

  /**
   * List of common flows to add to common flows group
   */
  @Input()
  public commonFlows: Flow[] = [];

  /**
   * List of plans with their flows
   */
  @Input()
  public plans: Plan[] = [];

  /**
   * List of policies usable in the policy studio
   */
  @Input({
    transform: (policies: unknown) => policies ?? [],
  })
  public set policies(value: (PolicyInput | Policy)[]) {
    this._policies = value.map(fromPolicyInput);
  }
  public get policies(): Policy[] {
    return this._policies;
  }
  private _policies: Policy[] = [];

  /**
   * List of SharedPolicyGroups usable in the studio
   */
  @Input()
  public sharedPolicyGroupPolicies: SharedPolicyGroupPolicy[] = [];

  /**
   * When a policy is not available with the current license,
   * this URL is used to redirect the user to the trial page.
   */
  @Input()
  public trialUrl?: string;

  /**
   * Loading state
   */
  @Input()
  public loading = false;

  /**
   * Called when Policy Studio needs to fetch the policy schema
   * @returns Observable of the policy schema
   */
  @Input()
  public policySchemaFetcher: PolicySchemaFetcher = () => EMPTY;

  /**
   * Called when Policy Studio needs to fetch the policy documentation
   * @returns Observable of the policy documentation
   */
  @Input()
  public policyDocumentationFetcher: PolicyDocumentationFetcher = () => EMPTY;

  /**
   * Return what is needed to save.
   **/
  @Output()
  public save = new EventEmitter<SaveOutput>();

  public connectorsTooltip = '';

  public selectedFlow?: FlowVM = undefined;

  public flowsGroups: FlowGroupVM[] = [];

  public disableSaveButton = true;

  public saving = false;

  // Used to keep track of initial flows groups to know if there are deleted flows
  private initialFlowsGroups: FlowGroupVM[] = [];

  private hasFlowExecutionChanged = false;

  private unSavingButtonSubscription?: Subscription;
  public enableSavingTimer = true;

  protected genericPolicies: GenericPolicy[] = [];

  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.entrypointsInfo || changes.endpointsInfo) {
      this.connectorsTooltip = `Entrypoints: ${(this.entrypointsInfo ?? []).map(e => e.name).join(', ')}\nEndpoints: ${(
        this.endpointsInfo ?? []
      )
        .map(e => e.name)
        .join(', ')}`;
    }

    if (changes.commonFlows || changes.plans) {
      this.disableSaveButton = true;
      this.flowsGroups = getFlowsGroups(this.apiType, this.commonFlows, this.plans);
      this.initialFlowsGroups = cloneDeep(this.flowsGroups);

      // Select first flow by default on first load
      this.selectedFlow = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows))[0];

      // Reset saving state when flowsGroups are updated
      this.saving = false;
      this.unSavingButtonSubscription?.unsubscribe();
    }

    if (changes.policySchemaFetcher) {
      this.policyStudioService.setPolicySchemaFetcher(this.policySchemaFetcher);
    }

    if (changes.policyDocumentationFetcher) {
      this.policyStudioService.setPolicyDocumentationFetcher(this.policyDocumentationFetcher);
    }

    if (changes.policies || changes.sharedPolicyGroupPolicies) {
      this.initGenericPolicies();
    }
  }

  public ngOnDestroy() {
    this.unSavingButtonSubscription?.unsubscribe();
  }

  public onFlowExecutionChange(flowExecution: FlowExecution): void {
    this.hasFlowExecutionChanged = !isEqual(this.flowExecution, flowExecution);
    if (this.hasFlowExecutionChanged) {
      this.disableSaveButton = false;
      this.flowExecution = flowExecution;
    }
  }

  public onFlowsGroupsChange(flowsGroups: FlowGroupVM[]): void {
    this.flowsGroups = cloneDeep(flowsGroups);
    this.disableSaveButton = false;
    if (this.selectedFlow) {
      this.onSelectFlow(this.selectedFlow._id);
    }
  }

  public onSelectedFlowChange(flow: FlowVM): void {
    this.flowsGroups = this.flowsGroups.map(flowGroup => ({
      ...flowGroup,
      flows: flowGroup.flows.map(f => (f._id === flow._id ? flow : f)),
    }));
    this.selectedFlow = flow;
    this.disableSaveButton = false;
  }

  public onSelectFlow(flowId: string): void {
    this.selectedFlow = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).find(f => f._id === flowId);
  }

  public onDeleteSelectedFlow(flow: FlowVM): void {
    // Define next selected flow and remove flow from flowsGroups
    const allFlowsId = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).map(f => f._id);
    const flowToDeleteIndex = allFlowsId.indexOf(flow._id);
    const nextSelectedFlow = allFlowsId[flowToDeleteIndex + 1] ?? allFlowsId[flowToDeleteIndex - 1];
    this.flowsGroups = this.flowsGroups.map(flowGroup => ({
      ...flowGroup,
      flows: flowGroup.flows.filter(f => f._id !== flow._id),
    }));

    this.selectedFlow = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).find(f => f._id === nextSelectedFlow);

    this.disableSaveButton = false;
  }

  public onSave(): void {
    // Emit common flows only if they have been updated
    const commonFlows = getCommonFlowsOutput(this.flowsGroups, this.initialFlowsGroups);

    // Emit plans only if they have been updated
    const plansToUpdate = getPlansChangeOutput(this.flowsGroups, this.initialFlowsGroups);
    this.save.emit({
      ...(commonFlows ? { commonFlows } : {}),
      ...(plansToUpdate ? { plansToUpdate } : {}),
      ...(this.hasFlowExecutionChanged ? { flowExecution: this.flowExecution } : {}),
    });
    this.saving = true;

    this.unSavingButtonSubscription?.unsubscribe();
    if (this.enableSavingTimer) {
      this.unSavingButtonSubscription = timer(5000).subscribe(() => {
        this.saving = false;
      });
    }
  }

  private initGenericPolicies(): void {
    this.genericPolicies = toGenericPolicies(this.policies ?? [], this.sharedPolicyGroupPolicies ?? []);
  }
}

const getFlowsGroups = (apiType: ApiType, commonFlows: Flow[] = [], plans: Plan[] = []): FlowGroupVM[] => {
  const commFlowsGroup: FlowGroupVM = {
    _id: 'flowsGroup_commonFlow',
    name: apiType === 'NATIVE' ? 'Common' : 'Common flows',
    flows: commonFlows.map(flow => ({ ...flow, _id: uniqueId('flow_'), _hasChanged: false, _parentFlowGroupName: 'Common' })),
  };

  return [
    ...plans.map(plan => ({
      _id: uniqueId('flowsGroup_'),
      _icon: 'gio:shield',
      _planId: plan.id,
      name: plan.name,
      flows: plan.flows.map(flow => ({ ...flow, _id: uniqueId('flow_'), _hasChanged: false, _parentFlowGroupName: plan.name })),
    })),
    commFlowsGroup,
  ];
};

const getCommonFlowsOutput = (flowsGroups: FlowGroupVM[], initialFlowsGroups: FlowGroupVM[]): Flow[] | null => {
  const commonFlowsGroup = flowsGroups.find(flowGroup => flowGroup._id === 'flowsGroup_commonFlow');
  const initialCommonFlowsGroup = initialFlowsGroups.find(flowGroup => flowGroup._id === 'flowsGroup_commonFlow');
  // Check if common flows have been updated
  const hasChanged = commonFlowsGroup?.flows.some(flow => flow._hasChanged);

  // Check if common flows have been deleted
  const hasDeletedFlow = differenceBy(initialCommonFlowsGroup?.flows ?? [], commonFlowsGroup?.flows ?? [], '_id').length > 0;

  return hasChanged || hasDeletedFlow
    ? (commonFlowsGroup?.flows ?? []).map(flow => omit(flow, '_id', '_hasChanged', '_parentFlowGroupName'))
    : null;
};

const getPlansChangeOutput = (flowsGroups: FlowGroupVM[], initialFlowsGroups: FlowGroupVM[]): Plan[] | null => {
  const plansGroups = flowsGroups.filter(flowGroup => flowGroup._id !== 'flowsGroup_commonFlow');
  const initialPlansGroups = initialFlowsGroups.filter(flowGroup => flowGroup._id !== 'flowsGroup_commonFlow');

  // Get plans with changed flows
  const plansGroupsWithChangedFlows = plansGroups.filter(plan => plan.flows.some(flow => flow._hasChanged));

  // Get plans with deleted flows
  const plansGroupsWithDeletedFlows: FlowGroupVM[] = [];

  // Check if there are deleted flows in initial initialPlansGroups
  initialPlansGroups.forEach(plan => {
    const planGroupToCompare = plansGroups.find(p => p._planId === plan._planId);
    if (planGroupToCompare && differenceBy(plan.flows, planGroupToCompare?.flows ?? [], '_id').length > 0) {
      // If there are deleted flows, we need to return the complete plan with the new flows
      plansGroupsWithDeletedFlows.push(planGroupToCompare);
    }
  });

  // Merge plans with changed flows and plans with deleted flows
  const plansWithChangedFlowsOutput = unionBy([...plansGroupsWithChangedFlows, ...plansGroupsWithDeletedFlows], '_planId').map(plan => ({
    ...omit(plan, '_id', '_icon', '_planId'),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- planId is always defined
    id: plan._planId!,
    flows: plan.flows.map(flow => omit(flow, '_id', '_hasChanged', '_parentFlowGroupName')),
  }));

  return plansWithChangedFlowsOutput.length > 0 ? plansWithChangedFlowsOutput : null;
};
