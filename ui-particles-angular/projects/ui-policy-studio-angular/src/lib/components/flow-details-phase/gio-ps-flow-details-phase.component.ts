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
import { isEmpty } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { GIO_DIALOG_WIDTH } from '@gravitee/ui-particles-angular';

import { ApiType, ConnectorInfo, ExecutionPhase, Policy, Step } from '../../models';
import {
  GioPolicyStudioPoliciesCatalogDialogComponent,
  GioPolicyStudioPoliciesCatalogDialogData,
  GioPolicyStudioPoliciesCatalogDialogResult,
} from '../policies-catalog-dialog/gio-ps-policies-catalog-dialog.component';

type StepVM =
  | {
      type: 'connectors';
      connectors: {
        name?: string;
        icon?: string;
      }[];
    }
  | {
      type: 'step';
      step: Step;
      index: number;
    };

@Component({
  selector: 'gio-ps-flow-details-phase',
  templateUrl: './gio-ps-flow-details-phase.component.html',
  styleUrls: ['./gio-ps-flow-details-phase.component.scss'],
})
export class GioPolicyStudioDetailsPhaseComponent implements OnChanges {
  @Input()
  public steps: Step[] = [];

  @Input()
  public name!: string;

  @Input()
  public description!: string;

  @Input()
  public startConnector: ConnectorInfo[] = [];

  @Input()
  public endConnector: ConnectorInfo[] = [];

  @Input()
  public apiType!: ApiType;

  @Input()
  public policies: Policy[] = [];

  @Input()
  public policyExecutionPhase!: ExecutionPhase;

  @Output()
  public stepsChange = new EventEmitter<Step[]>();

  public stepsVM: StepVM[] = [];

  public isDisabled = false;

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.steps || changes.startConnector || changes.endConnector) {
      this.stepsVM = [
        {
          type: 'connectors',
          connectors: this.startConnector.map(connector => ({
            name: connector.name,
            icon: connector.icon,
          })),
        },

        ...(this.steps ?? []).map((step, index) => ({
          type: 'step' as const,
          step: step,
          index,
        })),

        {
          type: 'connectors',
          connectors: this.endConnector.map(connector => ({
            name: connector.name,
            icon: connector.icon,
          })),
        },
      ];

      // Disable phase if there are not start & end connectors
      this.isDisabled = this.stepsVM.filter(step => step.type === 'connectors' && !isEmpty(step.connectors)).length < 2;
    }
  }

  public onAddPolicy(index: number): void {
    this.matDialog
      .open<
        GioPolicyStudioPoliciesCatalogDialogComponent,
        GioPolicyStudioPoliciesCatalogDialogData,
        GioPolicyStudioPoliciesCatalogDialogResult
      >(GioPolicyStudioPoliciesCatalogDialogComponent, {
        data: {
          policies: this.policies,
          executionPhase: this.policyExecutionPhase,
          apiType: this.apiType,
        },
        role: 'alertdialog',
        id: 'gioPolicyStudioPoliciesCatalogDialog',
        width: GIO_DIALOG_WIDTH.LARGE,
      })
      .afterClosed()
      .subscribe(stepToAdd => {
        if (!this.steps || !stepToAdd) {
          return;
        }
        // Add Step after the given index
        this.stepsChange.emit([...this.steps.slice(0, index + 1), stepToAdd, ...this.steps.slice(index + 1)]);
      });
  }

  public onStepChange(index: number, stepToEdit: Step): void {
    if (!this.steps) {
      return;
    }
    // Replace the step at the given index
    this.stepsChange.emit([...this.steps.slice(0, index), stepToEdit, ...this.steps.slice(index + 1)]);
  }

  public onStepDeleted(index: number): void {
    if (!this.steps) {
      return;
    }
    this.stepsChange.emit([...this.steps.slice(0, index), ...this.steps.slice(index + 1)]);
  }
}
