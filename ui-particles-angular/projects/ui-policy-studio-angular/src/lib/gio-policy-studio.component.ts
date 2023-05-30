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
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { capitalize, flatten, uniqueId } from 'lodash';

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

  public connectorsTooltip = '';

  public selectedFlow?: FlowVM = undefined;

  public flowsGroups: FlowGroupVM[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.entrypointsInfo || changes.endpointsInfo) {
      this.connectorsTooltip = `Entrypoints: ${(this.entrypointsInfo ?? []).map(e => capitalize(e.type)).join(', ')}\nEndpoints: ${(
        this.endpointsInfo ?? []
      )
        .map(e => capitalize(e.type))
        .join(', ')}`;
    }

    if (changes.commonFlows || changes.plans) {
      this.flowsGroups = getFlowsGroups(this.commonFlows, this.plans);

      // Select first flow by default on first load
      if (changes.commonFlows?.isFirstChange() || changes.plans?.isFirstChange()) {
        this.selectedFlow = this.flowsGroups[0].flows[0];
      }
    }
  }

  public onFlowsGroupsChange(flowsGroups: FlowGroupVM[]): void {
    this.flowsGroups = flowsGroups;
  }

  public onSelectedFlowChange(flow: FlowVM): void {
    this.flowsGroups = this.flowsGroups.map(flowGroup => ({
      ...flowGroup,
      flows: flowGroup.flows.map(f => (f._id === flow._id ? flow : f)),
    }));
    this.selectedFlow = flow;
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
  }
}

const getFlowsGroups = (commonFlows: Flow[] = [], plans: Plan[] = []): FlowGroupVM[] => {
  const commFlowsGroup: FlowGroupVM = {
    _id: 'flowsGroup_commonFlow',
    name: 'Common flows',
    flows: commonFlows.map(flow => ({ ...flow, _id: uniqueId('flow_') })),
  };

  return [
    ...plans.map(plan => ({
      _id: uniqueId('flowsGroup_'),
      name: plan.name,
      icon: 'gio:shield',
      flows: plan.flows.map(flow => ({ ...flow, _id: uniqueId('flow_') })),
    })),
    commFlowsGroup,
  ];
};
