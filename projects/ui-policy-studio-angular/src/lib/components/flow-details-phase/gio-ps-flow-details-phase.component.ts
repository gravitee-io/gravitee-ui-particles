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
import { isEmpty, uniqueId } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { GIO_DIALOG_WIDTH, GioBannerModule, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import {
  GioPolicyStudioPoliciesCatalogDialogComponent,
  GioPolicyStudioPoliciesCatalogDialogData,
  GioPolicyStudioPoliciesCatalogDialogResult,
} from '../policies-catalog-dialog/gio-ps-policies-catalog-dialog.component';
import { ApiType, ConnectorInfo, FlowPhase, Step } from '../../models';
import { GioPolicyStudioDetailsPhaseStepComponent } from '../flow-details-phase-step/gio-ps-flow-details-phase-step.component';
import { GenericPolicy } from '../../models/policy/GenericPolicy';

type StepVM =
  | {
      _id: string;
      type: 'connectors';
      connectors: {
        name?: string;
        icon?: string;
      }[];
    }
  | {
      _id: string;
      type: 'step';
      step: Step;
      index: number;
    };

@Component({
  imports: [MatTooltipModule, MatButtonModule, GioPolicyStudioDetailsPhaseStepComponent, GioIconsModule, GioBannerModule],
  selector: 'gio-ps-flow-details-phase',
  templateUrl: './gio-ps-flow-details-phase.component.html',
  styleUrls: ['./gio-ps-flow-details-phase.component.scss'],
})
export class GioPolicyStudioDetailsPhaseComponent implements OnChanges {
  @Input()
  public readOnly = false;

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
  public genericPolicies: GenericPolicy[] = [];

  @Input()
  public policyFlowPhase!: FlowPhase;

  @Input()
  public trialUrl?: string;

  @Input()
  public disabledNotYetAvailable = false;

  @Output()
  public stepsChange = new EventEmitter<Step[]>();

  public stepsVM: StepVM[] = [];

  public hasStartAndEndConnectors = true;
  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.steps || changes.startConnector || changes.endConnector) {
      this.stepsVM = [
        {
          _id: 'start',
          type: 'connectors',
          connectors: this.startConnector.map(connector => ({
            name: connector.name,
            icon: connector.icon,
          })),
        },

        ...(this.steps ?? []).map((step, index) => ({
          _id: uniqueId('step_'),
          type: 'step' as const,
          step: step,
          index,
        })),

        {
          _id: 'end',
          type: 'connectors',
          connectors: this.endConnector.map(connector => ({
            name: connector.name,
            icon: connector.icon,
          })),
        },
      ];

      // Disable phase if there are no start & end connectors
      this.hasStartAndEndConnectors = this.stepsVM.filter(step => step.type === 'connectors' && !isEmpty(step.connectors)).length >= 2;
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
          genericPolicies: this.genericPolicies,
          flowPhase: this.policyFlowPhase,
          apiType: this.apiType,
          trialUrl: this.trialUrl,
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

  public onStepDisabled(index: number): void {
    if (!this.steps) {
      return;
    }

    this.stepsChange.emit([
      ...this.steps.slice(0, index),
      {
        ...this.steps[index],
        enabled: !this.steps[index].enabled,
      },
      ...this.steps.slice(index + 1),
    ]);
  }

  public onStepDuplicated(index: number) {
    if (!this.steps) {
      return;
    }

    this.stepsChange.emit([...this.steps.slice(0, index + 1), this.steps[index], ...this.steps.slice(index + 1)]);
  }

  public onStepMovedRight(index: number) {
    if (!this.steps) {
      return;
    }
    // Check if the step is not the last one
    if (index === this.steps.length - 1) {
      return;
    }

    this.stepsChange.emit([...this.steps.slice(0, index), this.steps[index + 1], this.steps[index], ...this.steps.slice(index + 2)]);
  }

  public onStepMovedLeft(index: number) {
    if (!this.steps) {
      return;
    }
    // Check if the step is not the first one
    if (index === 0) {
      return;
    }

    this.stepsChange.emit([...this.steps.slice(0, index - 1), this.steps[index], this.steps[index - 1], ...this.steps.slice(index + 1)]);
  }
}
