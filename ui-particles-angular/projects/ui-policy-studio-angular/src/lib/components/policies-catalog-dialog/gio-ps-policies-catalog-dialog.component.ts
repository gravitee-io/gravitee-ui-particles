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
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { toLower, uniq } from 'lodash';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ApiType, ExecutionPhase, Policy, Step } from '../../models';

export type GioPolicyStudioPoliciesCatalogDialogData = {
  policies: Policy[];
  executionPhase: ExecutionPhase;
  apiType: ApiType;
  trialUrl?: string;
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

  public selectedCategoriesControl?: UntypedFormControl;

  public filtersForm = new UntypedFormGroup({
    categories: new UntypedFormControl([]),
    search: new UntypedFormControl(''),
  });

  private allPolicies: PolicyVM[] = [];

  private unsubscribe$ = new Subject<void>();

  public isUnlicensed = false;

  public trialUrl?: string;

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

    this.categories = uniq(this.allPolicies.map(policy => policy.category.toLowerCase())).sort((a, b) => a.localeCompare(b));
    const othersIndex = this.categories.indexOf('others');
    if (othersIndex !== -1) {
      this.categories.push(this.categories.splice(othersIndex, 1)[0]);
    }

    this.filtersForm.valueChanges
      .pipe(startWith(this.filtersForm.value), takeUntil(this.unsubscribe$))
      .subscribe(({ categories, search }: { categories?: string[]; search?: string }) => {
        const selectedCategories = categories && categories.length > 0 ? categories : this.categories;
        this.policies = this.allPolicies
          .filter(policy => {
            return selectedCategories.map(toLower).includes(toLower(policy.category));
          })
          .filter(policy => {
            return search ? toLower(policy.name).includes(toLower(search)) : true;
          });
      });

    this.trialUrl = flowDialogData.trialUrl;
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSelectPolicy(policy: Policy) {
    if (policy.deployed === false) {
      this.isUnlicensed = true;
    }
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
    // Reset to initial value
    this.selectedPolicy = undefined;
    this.isValid = false;
    this.isUnlicensed = false;
  }
}
