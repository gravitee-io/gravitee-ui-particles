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
import { MatDialog } from '@angular/material/dialog';

import { Policy, Step } from '../../models';
import {
  GioPolicyStudioStepEditDialogComponent,
  GioPolicyStudioStepEditDialogData,
  GioPolicyStudioStepEditDialogResult,
} from '../step-edit-dialog/gio-ps-step-edit-dialog.component';

@Component({
  selector: 'gio-ps-flow-details-phase-step',
  templateUrl: './gio-ps-flow-details-phase-step.component.html',
  styleUrls: ['./gio-ps-flow-details-phase-step.component.scss'],
})
export class GioPolicyStudioDetailsPhaseStepComponent implements OnChanges {
  @Input()
  public step!: Step;

  @Input()
  public policies: Policy[] = [];

  public policy?: Policy;

  constructor(private readonly matDialog: MatDialog) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.policies || changes.step) {
      this.policy = this.policies.find(policy => policy.id === this.step.policy);
    }
  }

  public onEdit() {
    if (!this.policy) {
      // TODO: Handle UseCase when policy is not found. (Like if the plugin is removed from the BackEnd)
      return;
    }

    this.matDialog
      .open<GioPolicyStudioStepEditDialogComponent, GioPolicyStudioStepEditDialogData, GioPolicyStudioStepEditDialogResult>(
        GioPolicyStudioStepEditDialogComponent,
        {
          data: {
            policy: this.policy,
            step: this.step,
          },
          role: 'alertdialog',
          id: 'gioPolicyStudioPolicyFormDialog',
          width: '1000px',
        },
      )
      .afterClosed()
      .subscribe();
  }

  public onDisable() {
    throw new Error('Wip');
  }

  public onDelete() {
    throw new Error('Wip');
  }
}
