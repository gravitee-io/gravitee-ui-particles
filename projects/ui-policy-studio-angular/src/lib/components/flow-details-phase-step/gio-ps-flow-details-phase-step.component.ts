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
import { GIO_DIALOG_WIDTH, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { get, isEmpty, isNil } from 'lodash';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  GioPolicyStudioStepEditDialogComponent,
  GioPolicyStudioStepEditDialogData,
  GioPolicyStudioStepEditDialogResult,
} from '../step-edit-dialog/gio-ps-step-edit-dialog.component';
import { ExecutionPhase, isPolicy, isSharedPolicyGroupPolicy, Step, GenericPolicy } from '../../models';

@Component({
  standalone: true,
  imports: [CommonModule, GioIconsModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  selector: 'gio-ps-flow-details-phase-step',
  templateUrl: './gio-ps-flow-details-phase-step.component.html',
  styleUrls: ['./gio-ps-flow-details-phase-step.component.scss'],
})
export class GioPolicyStudioDetailsPhaseStepComponent implements OnChanges {
  @Input()
  public readOnly = false;

  @Input()
  public step!: Step;

  @Input()
  public genericPolicies: GenericPolicy[] = [];

  @Input({ required: true })
  public executionPhase!: ExecutionPhase;

  @Output()
  public stepChange = new EventEmitter<Step>();

  @Output()
  public deleted = new EventEmitter<void>();

  @Output()
  public disabled = new EventEmitter<void>();

  public genericPolicy?: GenericPolicy;
  protected policyIcon?: string;

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if ((changes.policies || changes.step) && !isEmpty(this.genericPolicies) && !isNil(this.step.policy)) {
      this.genericPolicy = this.genericPolicies.find(policy => {
        if (isPolicy(policy)) {
          return policy.policyId === this.step.policy;
        }

        if (isSharedPolicyGroupPolicy(policy)) {
          return policy.sharedPolicyGroupId === get(this.step.configuration, 'sharedPolicyGroupId');
        }
        // Not expected
        throw new Error('Unknown policy type');
      });
    }
  }

  public onEditOrView() {
    if (!this.genericPolicy) {
      // TODO: Handle UseCase when policy is not found. (Like if the plugin is removed from the BackEnd)
      return;
    }

    this.matDialog
      .open<GioPolicyStudioStepEditDialogComponent, GioPolicyStudioStepEditDialogData, GioPolicyStudioStepEditDialogResult>(
        GioPolicyStudioStepEditDialogComponent,
        {
          data: {
            readOnly: this.readOnly,
            genericPolicy: this.genericPolicy,
            step: this.step,
            executionPhase: this.executionPhase,
          },
          role: 'alertdialog',
          id: 'gioPolicyStudioPolicyFormDialog',
          width: GIO_DIALOG_WIDTH.LARGE,
        },
      )
      .afterClosed()
      .subscribe(stepToEdit => {
        if (!stepToEdit) {
          return;
        }

        this.stepChange.emit(stepToEdit);
      });
  }

  public onDisable() {
    this.disabled.emit();
  }

  public onDelete() {
    this.deleted.emit();
  }
}
