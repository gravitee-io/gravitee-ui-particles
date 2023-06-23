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
  GioPolicyStudioFlowMessageFormDialogComponent,
  GioPolicyStudioFlowMessageFormDialogData,
} from '../flow-form-dialog/flow-message-form-dialog/gio-ps-flow-message-form-dialog.component';
import { FlowGroupVM, FlowVM } from '../../gio-policy-studio.model';
import { ApiType, ChannelSelector, ConditionSelector, ConnectorInfo, FlowExecution, HttpSelector, Operation } from '../../models';
import {
  GioPolicyStudioFlowProxyFormDialogComponent,
  GioPolicyStudioFlowProxyFormDialogData,
} from '../flow-form-dialog/flow-proxy-form-dialog/gio-ps-flow-proxy-form-dialog.component';
import { GioPolicyStudioFlowFormDialogResult } from '../flow-form-dialog/gio-ps-flow-form-dialog-result.model';
import {
  GioPolicyStudioFlowExecutionFormDialogComponent,
  GioPolicyStudioFlowExecutionFormDialogData,
} from '../flow-execution-form-dialog/gio-ps-flow-execution-form-dialog.component';

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
  hasCondition: boolean;
}

@Component({
  selector: 'gio-ps-flows-menu',
  templateUrl: './gio-ps-flows-menu.component.html',
  styleUrls: ['./gio-ps-flows-menu.component.scss'],
})
export class GioPolicyStudioFlowsMenuComponent implements OnChanges {
  @Input()
  public loading = false;

  @Input()
  public apiType!: ApiType;

  @Input()
  public flowExecution!: FlowExecution;

  @Input()
  public flowsGroups: FlowGroupVM[] = [];

  @Input()
  public selectedFlow?: FlowVM = undefined;

  @Input()
  public entrypoints: ConnectorInfo[] = [];

  @Output()
  public selectedFlowChange = new EventEmitter<FlowVM>();

  @Output()
  public flowsGroupsChange = new EventEmitter<FlowGroupVM[]>();

  @Output()
  public flowExecutionChange = new EventEmitter<FlowExecution>();

  public flowGroupMenuItems: FlowGroupMenuVM[] = [];

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.flowsGroups || changes.selectedFlow) {
      this.flowGroupMenuItems = cloneDeep(this.flowsGroups).map(flowGroup => {
        return {
          ...flowGroup,
          flows: flowGroup.flows.map(flow => {
            const badges: FlowMenuVM['badges'] = [];
            let pathOrChannelLabel = '';
            let hasCondition = false;

            // MESSAGE API - CHANNEL
            const channelSelector = flow.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
            if (channelSelector) {
              const operationToBadge: Record<Operation, string> = {
                PUBLISH: 'PUB',
                SUBSCRIBE: 'SUB',
              };
              const operationBadges = (channelSelector.operations ?? [])
                .map(operation => ({
                  label: operationToBadge[operation],
                  class: 'gio-badge-neutral',
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
              operationBadges && badges.push(...operationBadges);
              pathOrChannelLabel = `${channelSelector.channel}${channelSelector.channelOperator === 'STARTS_WITH' ? '**' : ''}`;
            }

            // HTTP API - HTTP
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

            const conditionSelector = flow.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;
            if (conditionSelector && conditionSelector.condition) {
              hasCondition = true;
            }

            return {
              ...flow,
              selected: this.selectedFlow?._id === flow._id,
              mouseOver: false,
              badges,
              pathOrChannelLabel,
              hasCondition,
            };
          }),
        };
      });
    }
  }

  public selectFlow(groupId: string, flowId: string): void {
    const flow = this.flowsGroups.find(fg => fg._id === groupId)?.flows.find(f => f._id === flowId);
    if (flow) {
      this.selectedFlowChange.emit(flow);
    }
  }

  public onAddFlow(flowGroup: FlowGroupVM): void {
    const dialogResult =
      this.apiType === 'MESSAGE'
        ? this.matDialog
            .open<
              GioPolicyStudioFlowMessageFormDialogComponent,
              GioPolicyStudioFlowMessageFormDialogData,
              GioPolicyStudioFlowFormDialogResult
            >(GioPolicyStudioFlowMessageFormDialogComponent, {
              data: {
                flow: undefined,
                entrypoints: this.entrypoints,
              },
              role: 'alertdialog',
              id: 'gioPsFlowFormDialog',
            })
            .afterClosed()
        : this.matDialog
            .open<GioPolicyStudioFlowProxyFormDialogComponent, GioPolicyStudioFlowProxyFormDialogData, GioPolicyStudioFlowFormDialogResult>(
              GioPolicyStudioFlowProxyFormDialogComponent,
              {
                data: {
                  flow: undefined,
                },
                role: 'alertdialog',
                id: 'gioPsFlowFormDialog',
              },
            )
            .afterClosed();

    dialogResult
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

  public onConfigureExecution(flowExecution: FlowExecution): void {
    const dialogResult = this.matDialog
      .open<GioPolicyStudioFlowExecutionFormDialogComponent, GioPolicyStudioFlowExecutionFormDialogData, FlowExecution | undefined>(
        GioPolicyStudioFlowExecutionFormDialogComponent,
        {
          data: {
            flowExecution,
          },
          role: 'alertdialog',
          id: 'gioPsFlowExecutionFormDialog',
        },
      )
      .afterClosed();

    dialogResult
      .pipe(
        tap(edited => {
          if (!edited) {
            return;
          }
          this.flowExecutionChange.emit(edited);
        }),
      )
      .subscribe();
  }
}
