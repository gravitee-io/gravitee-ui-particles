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
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import {
  GioPolicyStudioFlowFormDialogComponent,
  GioPolicyStudioFlowFormDialogData,
  GioPolicyStudioFlowFormDialogResult,
} from '../flow-form-dialog/gio-ps-flow-form-dialog.component';
import { FlowGroupVM, FlowVM } from '../../gio-policy-studio.model';
import { ChannelSelector, HttpSelector, Operation } from '../../models';

interface FlowGroupMenuVM extends FlowGroupVM {
  flows: FlowMenuVM[];
}

interface FlowMenuVM extends FlowVM {
  selected: boolean;
  mouseOver: boolean;
  badges: {
    label: string;
    class: string;
  }[];
  pathOrChannelLabel: string;
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

  @Output()
  public flowsGroupsChange = new EventEmitter<FlowGroupVM[]>();

  public flowsGroupsVMSelected: FlowGroupMenuVM[] = [];

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.flowsGroups || changes.selectedFlow) {
      this.flowsGroupsVMSelected = this.flowsGroups.map(flowGroup => {
        return {
          ...flowGroup,
          flows: flowGroup.flows.map(flow => {
            const badges: FlowMenuVM['badges'] = [];
            let pathOrChannelLabel = '';
            const channelSelector = flow.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
            if (channelSelector) {
              const operationToBadge: Record<Operation, string> = {
                PUBLISH: 'PUB',
                SUBSCRIBE: 'SUB',
              };
              const operationBadges = (channelSelector.operations ?? []).map(operation => ({
                label: operationToBadge[operation],
                class: 'gio-badge-neutral',
              }));
              operationBadges && badges.push(...operationBadges);
              pathOrChannelLabel = `${channelSelector.channel}${channelSelector.channelOperator === 'STARTS_WITH' ? '**' : ''}`;
            }

            const httpSelector = flow.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
            if (httpSelector) {
              // Keep only 2 first http methods and add +X badge if there are more
              const httpMethodsToKeep = httpSelector.methods?.slice(0, 2);
              const httpMethodsLength = httpSelector.methods?.length;
              httpMethodsToKeep &&
                badges.push(...httpMethodsToKeep.map(method => ({ label: method, class: `gio-method-badge-${method.toLowerCase()}` })));
              if (httpMethodsLength && httpMethodsLength > 2) {
                badges?.push({
                  label: `+${httpMethodsLength - 2}`,
                  class: 'gio-badge-neutral',
                });
              }
              if (httpMethodsLength === 0) {
                badges?.push({
                  label: 'ALL',
                  class: 'gio-badge-neutral',
                });
              }

              pathOrChannelLabel = `${httpSelector.path}${httpSelector.pathOperator === 'STARTS_WITH' ? '/**' : ''}`;
            }

            return {
              ...flow,
              selected: this.selectedFlow?._id === flow._id,
              mouseOver: false,
              badges,
              pathOrChannelLabel,
            };
          }),
        };
      });
    }
  }

  public selectFlow(flow: FlowVM): void {
    this.selectedFlowChange.emit(flow);
  }

  public onAddFlow(flowGroup: FlowGroupVM): void {
    this.matDialog
      .open<GioPolicyStudioFlowFormDialogComponent, GioPolicyStudioFlowFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowFormDialogComponent,
        {
          data: {
            flow: undefined,
            entrypoints: [],
          },
          role: 'alertdialog',
          id: 'gioPsFlowFormDialog',
        },
      )
      .afterClosed()
      .pipe(
        tap(createdOrEdited => {
          if (!createdOrEdited) {
            return;
          }
          const editedFlowsGroups = cloneDeep(this.flowsGroups);

          const flowsGroupToEdit = editedFlowsGroups.find(fg => fg._id === flowGroup._id);
          if (!flowsGroupToEdit) {
            throw new Error(`Flow group ${flowGroup._id} not found`);
          }
          flowsGroupToEdit.flows.push(createdOrEdited);

          this.flowsGroupsChange.emit(editedFlowsGroups);
          this.selectedFlowChange.emit(createdOrEdited);
        }),
      )
      .subscribe();
  }
}
