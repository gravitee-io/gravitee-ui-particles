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
import { isEmpty } from 'lodash';
import { GIO_DIALOG_WIDTH, GioBannerModule, GioIconsModule, GioLoaderModule } from '@gravitee/ui-particles-angular';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlowVM } from '../../policy-studio/gio-policy-studio.model';
import {
  GioPolicyStudioFlowMessageFormDialogComponent,
  GioPolicyStudioFlowMessageFormDialogData,
} from '../flow-form-dialog/flow-message-form-dialog/gio-ps-flow-message-form-dialog.component';
import { ApiType, ChannelSelector, ConnectorInfo, Operation, Policy, Step, GenericPolicy } from '../../models';
import {
  GioPolicyStudioFlowProxyFormDialogComponent,
  GioPolicyStudioFlowProxyFormDialogData,
} from '../flow-form-dialog/flow-proxy-form-dialog/gio-ps-flow-proxy-form-dialog.component';
import { GioPolicyStudioFlowFormDialogResult } from '../flow-form-dialog/gio-ps-flow-form-dialog-result.model';
import { GioPolicyStudioDetailsPhaseComponent } from '../flow-details-phase/gio-ps-flow-details-phase.component';
import { GioFilterConnectorsByModePipe } from '../filter-pipe/gio-flter-connectors-by-mode.pipe';
import { GioPolicyStudioDetailsInfoBarComponent } from '../flow-details-info-bar/gio-ps-flow-details-info-bar.component';
import {
  GioPolicyStudioFlowNativeFormDialogComponent,
  GioPolicyStudioFlowNativeFormDialogData,
} from '../flow-form-dialog/flow-native-form-dialog/gio-ps-flow-native-form-dialog.component';

@Component({
  imports: [
    MatTabsModule,
    MatButtonModule,
    GioIconsModule,
    GioPolicyStudioDetailsPhaseComponent,
    GioFilterConnectorsByModePipe,
    GioLoaderModule,
    GioPolicyStudioDetailsInfoBarComponent,
    MatTooltipModule,
    GioBannerModule,
  ],
  selector: 'gio-ps-flow-details',
  templateUrl: './gio-ps-flow-details.component.html',
  styleUrls: ['./gio-ps-flow-details.component.scss'],
})
export class GioPolicyStudioDetailsComponent implements OnChanges {
  @Input()
  public readOnly = false;

  @Input()
  public loading = false;

  @Input()
  public apiType!: ApiType;

  @Input()
  public flow?: FlowVM = undefined;

  @Input()
  public entrypointsInfo: ConnectorInfo[] = [];

  @Input()
  public endpointsInfo: ConnectorInfo[] = [];

  @Input()
  public policies: Policy[] = [];

  @Input()
  public genericPolicies: GenericPolicy[] = [];

  @Input()
  public trialUrl?: string;

  @Output()
  public flowChange = new EventEmitter<FlowVM>();

  @Output()
  public deleteFlow = new EventEmitter<FlowVM>();

  public messageFlowEntrypointsInfo: ConnectorInfo[] = [];

  public operations: Operation[] = [];

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.entrypointsInfo || changes.flow) {
      const channelSelector = this.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;

      this.operations = channelSelector?.operations ?? [];

      if (!channelSelector) {
        // If no channel selector found. Keep default value
        this.messageFlowEntrypointsInfo = [];
        return;
      }

      this.messageFlowEntrypointsInfo =
        this.entrypointsInfo?.filter(
          e =>
            // If not entrypoints are defined, all entrypoints are valid
            !channelSelector.entrypoints || isEmpty(channelSelector.entrypoints) || channelSelector.entrypoints?.includes(e.type),
        ) ?? [];
    }
  }

  public onEditFlow(): void {
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
              flow: this.flow,
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
                flow: this.flow,
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
                flow: this.flow,
                parentGroupName: this.flow!._parentFlowGroupName,
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
        tap(createdOrEdited => {
          if (!createdOrEdited) {
            return;
          }
          this.flowChange.emit(createdOrEdited);
        }),
      )
      .subscribe();
  }

  public onDeleteFlow(): void {
    this.deleteFlow.emit(this.flow);
  }

  public onEnableDisableFlow(): void {
    if (!this.flow) {
      return;
    }

    this.flowChange.emit({
      ...this.flow,
      enabled: !this.flow.enabled,
      _hasChanged: true,
    });
  }

  public onStepsChange(flowPhase: 'connect' | 'interact' | 'request' | 'response' | 'publish' | 'subscribe', steps: Step[]): void {
    if (!this.flow) {
      return;
    }

    this.flowChange.emit({
      ...this.flow,
      [flowPhase]: steps,
      _hasChanged: true,
    });
  }
}
