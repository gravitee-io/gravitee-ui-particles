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

import { FlowGroupVM, FlowVM } from '../../gio-policy-studio.model';

interface FlowGroupMenuVM extends FlowGroupVM {
  flows: FlowMenuVM[];
}

interface FlowMenuVM extends FlowVM {
  selected: boolean;
  mouseOver: boolean;
}

@Component({
  selector: 'gio-ps-flows-menu',
  templateUrl: './gio-ps-flows-menu.component.html',
  styleUrls: ['./gio-ps-flows-menu.component.scss'],
})
export class GioPolicyStudioFlowsMenuComponent implements OnChanges {
  @Input()
  public flowsGroups: FlowGroupVM[] = [];

  @Input()
  public selectedFlow?: FlowVM = undefined;

  @Output()
  public selectedFlowChange = new EventEmitter<FlowVM>();

  public flowGroupVMSelected: FlowGroupMenuVM[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.flowsGroups || changes.selectedFlow) {
      this.flowGroupVMSelected = this.flowsGroups.map(flowGroup => {
        return {
          ...flowGroup,
          flows: flowGroup.flows.map(flow => {
            return {
              ...flow,
              selected: this.selectedFlow?._id === flow._id,
              mouseOver: false,
            };
          }),
        };
      });
    }
  }

  public selectFlow(flow: FlowVM): void {
    this.selectedFlowChange.emit(flow);
  }
}
