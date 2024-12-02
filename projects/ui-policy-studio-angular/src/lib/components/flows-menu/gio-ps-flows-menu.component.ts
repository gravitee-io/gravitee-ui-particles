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
import { cloneDeep, flatten, isEmpty, uniqueId } from 'lodash';
import { GIO_DIALOG_WIDTH, GioIconsModule, GioLoaderModule } from '@gravitee/ui-particles-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import {
  GioPolicyStudioFlowMessageFormDialogComponent,
  GioPolicyStudioFlowMessageFormDialogData,
} from '../flow-form-dialog/flow-message-form-dialog/gio-ps-flow-message-form-dialog.component';
import { FlowGroupVM, FlowVM } from '../../policy-studio/gio-policy-studio.model';
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
import {
  GioPolicyStudioFlowNativeFormDialogComponent,
  GioPolicyStudioFlowNativeFormDialogData,
} from '../flow-form-dialog/flow-native-form-dialog/gio-ps-flow-native-form-dialog.component';

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
  standalone: true,
  imports: [GioIconsModule, MatTooltipModule, MatButtonModule, CommonModule, GioLoaderModule, MatMenuModule, DragDropModule],
  selector: 'gio-ps-flows-menu',
  templateUrl: './gio-ps-flows-menu.component.html',
  styleUrls: ['./gio-ps-flows-menu.component.scss'],
})
export class GioPolicyStudioFlowsMenuComponent implements OnChanges {
  @Input()
  public readOnly = false;

  @Input()
  public loading = false;

  @Input()
  public apiType!: ApiType;

  @Input()
  public flowExecution!: FlowExecution;

  @Input()
  public flowsGroups: FlowGroupVM[] = [];

  @Input()
  public selectedFlowId?: string = undefined;

  @Input()
  public entrypoints: ConnectorInfo[] = [];

  @Input()
  public entrypointsInfo: ConnectorInfo[] = [];

  @Output()
  public selectedFlowIdChange = new EventEmitter<string>();

  @Output()
  public flowsGroupsChange = new EventEmitter<FlowGroupVM[]>();

  @Output()
  public flowExecutionChange = new EventEmitter<FlowExecution>();

  @Output()
  public deleteFlow = new EventEmitter<FlowVM>();

  public flowGroupMenuItems: FlowGroupMenuVM[] = [];

  public enterPredicate: (drag: CdkDrag<FlowGroupMenuVM>, drop: CdkDropList<FlowGroupMenuVM>) => boolean = () => true;

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.flowsGroups || changes.selectedFlowId) {
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
              // If no operations are selected, all operations are valid
              const operationBadges = (
                !channelSelector.operations || isEmpty(channelSelector.operations)
                  ? (['PUBLISH', 'SUBSCRIBE'] as const)
                  : channelSelector.operations
              )
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
              const httpMethodsLength = httpSelector.methods?.length ?? 0;
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
              selected: this.selectedFlowId === flow._id,
              mouseOver: false,
              badges,
              pathOrChannelLabel,
              hasCondition,
            };
          }),
        };
      });

      this.enterPredicate = (_drag: CdkDrag<FlowGroupMenuVM>, drop: CdkDropList<FlowGroupMenuVM>) => {
        if (this.apiType === 'NATIVE') {
          return isEmpty(drop.data.flows);
        }
        return true;
      };
    }
  }

  public selectFlow(groupId: string, flowId: string): void {
    const flow = this.flowsGroups.find(fg => fg._id === groupId)?.flows.find(f => f._id === flowId);
    if (flow) {
      this.selectedFlowIdChange.emit(flow._id);
    }
  }

  public onAddFlow(flowGroup: FlowGroupVM): void {
    let dialogResult;

    switch (this.apiType) {
      case 'MESSAGE':
        dialogResult = this.matDialog
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
            width: GIO_DIALOG_WIDTH.MEDIUM,
          })
          .afterClosed();
        break;
      case 'PROXY':
        dialogResult = this.matDialog
          .open<GioPolicyStudioFlowProxyFormDialogComponent, GioPolicyStudioFlowProxyFormDialogData, GioPolicyStudioFlowFormDialogResult>(
            GioPolicyStudioFlowProxyFormDialogComponent,
            {
              data: {
                flow: undefined,
              },
              role: 'alertdialog',
              id: 'gioPsFlowFormDialog',
              width: GIO_DIALOG_WIDTH.MEDIUM,
            },
          )
          .afterClosed();
        break;
      case 'NATIVE':
        dialogResult = this.matDialog
          .open<GioPolicyStudioFlowNativeFormDialogComponent, GioPolicyStudioFlowNativeFormDialogData, GioPolicyStudioFlowFormDialogResult>(
            GioPolicyStudioFlowNativeFormDialogComponent,
            {
              data: {
                parentGroupName: flowGroup.name,
                flow: undefined,
              },
              role: 'alertdialog',
              id: 'gioPsFlowFormDialog',
              width: GIO_DIALOG_WIDTH.MEDIUM,
            },
          )
          .afterClosed();
        break;
      default:
        throw new Error(`Unsupported API type ${this.apiType}`);
    }

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
          this.selectedFlowIdChange.emit(createdOrEdited._id);
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
            readOnly: this.readOnly,
          },
          role: 'alertdialog',
          id: 'gioPsFlowExecutionFormDialog',
          width: GIO_DIALOG_WIDTH.MEDIUM,
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

  public onDisableFlow(flowId: string): void {
    const flowToEdit = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).find(f => f._id === flowId);
    if (!flowToEdit) {
      throw new Error(`Flow ${flowId} not found`);
    }
    flowToEdit.enabled = !flowToEdit.enabled;
    this.flowsGroupsChange.emit(this.flowsGroups);
  }

  public onDropFlow(event: CdkDragDrop<FlowGroupMenuVM>): void {
    if (event.previousContainer === event.container) {
      // Move inside the same group
      const flowsGroupToEdit = this.flowsGroups.find(fg => fg._id === event.container.data._id);
      if (!flowsGroupToEdit) {
        throw new Error(`Flow group ${event.container.data._id} not found`);
      }
      moveItemInArray(flowsGroupToEdit.flows, event.previousIndex, event.currentIndex);
      this.flowsGroupsChange.emit(this.flowsGroups);
    } else {
      // Move from a group to another
      const previousFlowsGroupToEdit = this.flowsGroups.find(fg => fg._id === event.previousContainer.data._id);
      const flowsGroupToEdit = this.flowsGroups.find(fg => fg._id === event.container.data._id);
      if (!previousFlowsGroupToEdit || !flowsGroupToEdit) {
        throw new Error(`Flow group ${event.previousContainer.data._id} or ${event.container.data._id} not found`);
      }
      transferArrayItem(previousFlowsGroupToEdit.flows, flowsGroupToEdit.flows, event.previousIndex, event.currentIndex);
      this.flowsGroupsChange.emit(this.flowsGroups);
    }
  }

  public onEditFlow(flowId: string): void {
    const flowToEdit = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).find(f => f._id === flowId);

    let dialogResult;

    switch (this.apiType) {
      case 'MESSAGE':
        dialogResult = this.matDialog
          .open<
            GioPolicyStudioFlowMessageFormDialogComponent,
            GioPolicyStudioFlowMessageFormDialogData,
            GioPolicyStudioFlowFormDialogResult
          >(GioPolicyStudioFlowMessageFormDialogComponent, {
            data: {
              flow: flowToEdit,
              entrypoints: this.entrypointsInfo ?? [],
            },
            role: 'alertdialog',
            id: 'gioPsFlowMessageFormDialog',
            width: GIO_DIALOG_WIDTH.MEDIUM,
          })
          .afterClosed();
        break;
      case 'PROXY':
        dialogResult = this.matDialog
          .open<GioPolicyStudioFlowProxyFormDialogComponent, GioPolicyStudioFlowProxyFormDialogData, GioPolicyStudioFlowFormDialogResult>(
            GioPolicyStudioFlowProxyFormDialogComponent,
            {
              data: {
                flow: flowToEdit,
              },
              role: 'alertdialog',
              id: 'gioPsFlowProxyFormDialog',
              width: GIO_DIALOG_WIDTH.MEDIUM,
            },
          )
          .afterClosed();
        break;
      case 'NATIVE':
        dialogResult = this.matDialog
          .open<GioPolicyStudioFlowNativeFormDialogComponent, GioPolicyStudioFlowNativeFormDialogData, GioPolicyStudioFlowFormDialogResult>(
            GioPolicyStudioFlowNativeFormDialogComponent,
            {
              data: {
                parentGroupName: flowToEdit!._parentFlowGroupName,
                flow: flowToEdit,
              },
              role: 'alertdialog',
              id: 'gioPsFlowNativeFormDialog',
              width: GIO_DIALOG_WIDTH.MEDIUM,
            },
          )
          .afterClosed();
        break;
      default:
        throw new Error(`Unsupported API type ${this.apiType}`);
    }

    dialogResult
      .pipe(
        tap(editedFlow => {
          if (!editedFlow) {
            return;
          }
          this.flowsGroups = this.flowsGroups.map(fg => ({
            ...fg,
            flows: fg.flows.map(f => (f._id === editedFlow._id ? editedFlow : f)),
          }));
          this.flowsGroupsChange.emit(this.flowsGroups);
        }),
      )
      .subscribe();
  }

  public onDeleteFlow(flowId: string): void {
    const flowToEdit = flatten(this.flowsGroups.map(flowGroup => flowGroup.flows)).find(f => f._id === flowId);
    this.deleteFlow.emit(flowToEdit);
  }

  public onDuplicateFlow(flowGroupId: string, flowId: string): void {
    const flowsGroupToEdit = this.flowsGroups.find(fg => fg._id === flowGroupId);
    if (!flowsGroupToEdit) {
      throw new Error(`Flow group ${flowGroupId} not found`);
    }
    const flowToDuplicate = flowsGroupToEdit.flows.find(f => f._id === flowId);
    if (!flowToDuplicate) {
      throw new Error(`Flow ${flowId} not found`);
    }
    const duplicatedFlow = cloneDeep(flowToDuplicate);
    duplicatedFlow._id = uniqueId('flow_');
    duplicatedFlow.name = `${duplicatedFlow.name} - Copy`;
    const index = flowsGroupToEdit.flows.indexOf(flowToDuplicate);
    flowsGroupToEdit.flows.splice(index + 1, 0, duplicatedFlow);
    this.flowsGroupsChange.emit(this.flowsGroups);
    this.selectedFlowIdChange.emit(duplicatedFlow._id);
  }
}
