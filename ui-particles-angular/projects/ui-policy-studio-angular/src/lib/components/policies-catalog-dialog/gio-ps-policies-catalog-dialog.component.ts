/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { toLower, uniq } from 'lodash';
import { FormControl } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ApiType, ExecutionPhase, Policy, Step } from '../../models';

export type GioPolicyStudioPoliciesCatalogDialogData = {
  policies: Policy[];
  executionPhase: ExecutionPhase;
  apiType: ApiType;
};

export type GioPolicyStudioPoliciesCatalogDialogResult = undefined | Step;

const executionPhaseLabels: Record<ExecutionPhase, string> = {
  REQUEST: 'Request',
  RESPONSE: 'Response',
  MESSAGE_REQUEST: 'Publish',
  MESSAGE_RESPONSE: 'Subscribe',
};

type PolicyVM = Policy & {
  category: string;
};

@Component({
  selector: 'gio-ps-policies-catalog-dialog',
  templateUrl: './gio-ps-policies-catalog-dialog.component.html',
  styleUrls: ['./gio-ps-policies-catalog-dialog.component.scss'],
})
export class GioPolicyStudioPoliciesCatalogDialogComponent implements OnDestroy {
  public policies: PolicyVM[] = [];

  public executionPhaseLabel!: string;

  public selectedPolicy?: Policy;

  public stepToAdd?: Step;

  public categories: string[] = [];

  public isValid = false;

  public selectedCategoriesControl?: FormControl;

  private allPolicies: PolicyVM[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<GioPolicyStudioPoliciesCatalogDialogComponent, GioPolicyStudioPoliciesCatalogDialogResult>,
    @Inject(MAT_DIALOG_DATA) flowDialogData: GioPolicyStudioPoliciesCatalogDialogData,
  ) {
    this.executionPhaseLabel = executionPhaseLabels[flowDialogData.executionPhase];

    this.allPolicies = flowDialogData.policies
      .filter(policy => {
        if (flowDialogData.apiType === 'PROXY') {
          return policy.proxy?.includes(flowDialogData.executionPhase);
        }
        return policy.message?.includes(flowDialogData.executionPhase);
      })
      .map(policy => ({
        ...policy,
        category: policy.category ?? 'Others',
      }));
    this.categories = uniq(this.allPolicies.map(policy => policy.category.toLowerCase()));

    // By default, all categories are selected
    this.selectedCategoriesControl = new FormControl(this.categories);

    this.selectedCategoriesControl.valueChanges
      .pipe(startWith(this.selectedCategoriesControl.value), takeUntil(this.unsubscribe$))
      .subscribe((categories: string[]) => {
        this.policies = this.allPolicies.filter(policy => {
          return categories.map(toLower).includes(toLower(policy.category));
        });
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSelectPolicy(policy: Policy) {
    this.selectedPolicy = policy;
  }

  public onStepChange(step: Step) {
    this.stepToAdd = step;
  }

  public onIsValid(isValid: boolean) {
    this.isValid = isValid;
  }

  public onAddPolicy() {
    this.dialogRef.close({
      ...this.stepToAdd,
      name: this.selectedPolicy?.name,
      enabled: true,
      policy: this.selectedPolicy?.id,
    });
  }

  public onGoBack() {
    this.selectedPolicy = undefined;
  }
}
