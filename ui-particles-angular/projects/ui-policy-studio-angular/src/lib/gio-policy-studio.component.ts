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
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { capitalize, flatten, omit, uniqueId } from 'lodash';

import { ApiType, ConnectorsInfo, Flow, Plan } from './models';
import { FlowGroupVM, FlowVM } from './gio-policy-studio.model';

@Component({
  selector: 'gio-policy-studio',
  templateUrl: './gio-policy-studio.component.html',
  styleUrls: ['./gio-policy-studio.component.scss'],
})
export class GioPolicyStudioComponent implements OnChanges {
  @Input()
  public apiType!: ApiType;

  /**
   * List of entrypoints to display
   */
  @Input()
  public entrypointsInfo: ConnectorsInfo[] = [];

  /**
   * List of endpoints to display
   */
  @Input()
  public endpointsInfo: ConnectorsInfo[] = [];

  @Input()
  public commonFlows: Flow[] = [];

  @Input()
  public plans: Plan[] = [];

  /**
   * Return common flows if they have been updated.
   */
  @Output()
  public commonFlowsChange = new EventEmitter<Flow[]>();

  /**
   * Return the list of plans with updated flows. Plans with no updated flows are not returned.
   **/
  @Output()
  public plansToUpdate = new EventEmitter<Plan[]>();

  public connectorsTooltip = '';

  public selectedFlow?: FlowVM = undefined;

  public flowsGroups: FlowGroupVM[] = [];

  public entrypointsType: string[] = [];

  public disableSaveButton = true;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.entrypointsInfo || changes.endpointsInfo) {
      this.connectorsTooltip = `Entrypoints: ${(this.entrypointsInfo ?? []).map(e => capitalize(e.type)).join(', ')}\nEndpoints: ${(
        this.endpointsInfo ?? []
      )
        .map(e => capitalize(e.type))
        .join(', ')}`;

      this.entrypointsType = (this.entrypointsInfo ?? []).map(e => e.type);
    }

    if (changes.commonFlows || changes.plans) {
      this.disableSaveButton = true;
      this.flowsGroups = getFlowsGroups(this.commonFlows, this.plans);

      // Select first flow by default on first load
      if (changes.commonFlows?.isFirstChange() || changes.plans?.isFirstChange()) {
        this.selectedFlow = this.flowsGroups[0].flows[0];
      }
    }
  }

  public onFlowsGroupsChange(flowsGroups: FlowGroupVM[]): void {
    this.flowsGroups = flowsGroups;
    this.disableSaveButton = false;
  }

  public onSelectedFlowChange(flow: FlowVM): void {
    this.flowsGroups = this.flowsGroups.map(flowGroup => ({
      ...flowGroup,
      flows: flowGroup.flows.map(f => (f._id === flow._id ? flow : f)),
    }));
    this.selectedFlow = flow;
    this.disableSaveButton = false;
  }

  public onDeleteSelectedFlow(flow: FlowVM): void {
    // Define next selected flow and remove flow from flowsGroups
    const allFLowsId = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).map(f => f._id);
    const flowToDeleteIndex = allFLowsId.indexOf(flow._id);
    const nextSelectedFlow = allFLowsId[flowToDeleteIndex + 1] ?? allFLowsId[flowToDeleteIndex - 1];
    this.flowsGroups = this.flowsGroups.map(flowGroup => ({
      ...flowGroup,
      flows: flowGroup.flows.filter(f => f._id !== flow._id),
    }));
    this.selectedFlow = this.flowsGroups
      .find(flowGroup => flowGroup.flows.some(f => f._id === nextSelectedFlow))
      ?.flows.find(f => f._id === nextSelectedFlow);

    this.disableSaveButton = false;
  }

  public onSave(): void {
    // Emit common flows only if they have been updated
    const commonFlows = getCommonFlowsOutput(this.flowsGroups);
    if (commonFlows != null) {
      this.commonFlowsChange.emit(commonFlows);
    }
    // Emit plans only if they have been updated
    const plans = getPlansChangeOutput(this.flowsGroups);
    if (plans != null) {
      this.plansToUpdate.emit(plans);
    }
  }
}

const getFlowsGroups = (commonFlows: Flow[] = [], plans: Plan[] = []): FlowGroupVM[] => {
  const commFlowsGroup: FlowGroupVM = {
    _id: 'flowsGroup_commonFlow',
    name: 'Common flows',
    flows: commonFlows.map(flow => ({ ...flow, _id: uniqueId('flow_'), _hasChanged: false })),
  };

  return [
    ...plans.map(plan => ({
      _id: uniqueId('flowsGroup_'),
      _icon: 'gio:shield',
      name: plan.name,
      flows: plan.flows.map(flow => ({ ...flow, _id: uniqueId('flow_'), _hasChanged: false })),
    })),
    commFlowsGroup,
  ];
};

const getCommonFlowsOutput = (flowsGroups: FlowGroupVM[]): Flow[] | null => {
  const commonFlowsGroup = flowsGroups.find(flowGroup => flowGroup._id === 'flowsGroup_commonFlow');
  const hasChanged = commonFlowsGroup?.flows.some(flow => flow._hasChanged);

  return hasChanged ? (commonFlowsGroup?.flows ?? []).map(flow => omit(flow, '_id', '_hasChanged')) : null;
};

const getPlansChangeOutput = (flowsGroups: FlowGroupVM[]): Plan[] | null => {
  const plans = flowsGroups.filter(flowGroup => flowGroup._id !== 'flowsGroup_commonFlow');
  const plansWithChangedFlows = plans.filter(plan => plan.flows.some(flow => flow._hasChanged));
  const plansWithChangedFlowsOutput = plansWithChangedFlows.map(plan => ({
    ...omit(plan, '_id', '_icon'),
    flows: plan.flows.map(flow => omit(flow, '_id', '_hasChanged')),
  }));

  return plansWithChangedFlowsOutput.length > 0 ? plansWithChangedFlowsOutput : null;
};
