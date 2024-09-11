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
import { GIO_DIALOG_WIDTH, GioConfirmDialogComponent, GioConfirmDialogData, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { get, isEmpty, isNil, has } from 'lodash';
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

  protected genericPolicy?: GenericPolicy;
  protected policyNotFound: false | 'SHARED_POLICY_GROUP' | 'POLICY' = false;

  protected get getPrerequisiteMessage(): string | undefined {
    if (!this.genericPolicy || !isSharedPolicyGroupPolicy(this.genericPolicy) || isEmpty(this.genericPolicy.prerequisiteMessage)) {
      return;
    }
    return this.genericPolicy.prerequisiteMessage;
  }

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

      // if this.genericPolicy is not found, it means that the policy has been deleted or the shared policy group no longer exists (or deployed)
      if (!this.genericPolicy) {
        this.policyNotFound = has(this.step.configuration, 'sharedPolicyGroupId') ? 'SHARED_POLICY_GROUP' : 'POLICY';
      }
    }
  }

  public onEditOrView() {
    if (!this.genericPolicy || this.policyNotFound != false) {
      this.matDialog
        .open<GioConfirmDialogComponent, GioConfirmDialogData, boolean>(GioConfirmDialogComponent, {
          data: {
            title: `${this.policyNotFound === 'SHARED_POLICY_GROUP' ? 'Shared Policy Group' : 'Policy'} not found`,
            content: `This step is linked to a ${this.policyNotFound === 'SHARED_POLICY_GROUP' ? 'Shared Policy Group' : 'Policy'} that no longer exists.<br>
${this.policyNotFound === 'SHARED_POLICY_GROUP' ? 'Note: The Gateway will ignore this step.' : 'Note: The Gateway will throw an error on deployment.'}
`,
            confirmButton: 'OK',
            disableCancel: true,
          },
          role: 'alertdialog',
          id: 'gioPolicyNotFoundDialog',
          width: GIO_DIALOG_WIDTH.MEDIUM,
        })
        .afterClosed()
        .subscribe();
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
