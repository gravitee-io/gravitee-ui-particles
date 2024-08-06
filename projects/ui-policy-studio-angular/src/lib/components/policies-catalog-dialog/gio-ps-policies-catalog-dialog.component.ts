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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { toLower, uniq } from 'lodash';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GioBannerModule, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';

import { ApiType, ExecutionPhase, GenericPolicy, isPolicy, isSharedPolicyGroupPolicy, Step } from '../../models';
import { GioPolicyStudioStepFormComponent } from '../step-form/gio-ps-step-form.component';

export type GioPolicyStudioPoliciesCatalogDialogData = {
  genericPolicies: GenericPolicy[];
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

type PolicyVM = {
  _id: string;
  genericPolicy: GenericPolicy;
  name: string;
  description?: string;
  icon?: string;
  deployed?: boolean;
  category: string;
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    GioBannerModule,
    GioIconsModule,
    GioPolicyStudioStepFormComponent,
    MatTooltip,
  ],
  selector: 'gio-ps-policies-catalog-dialog',
  templateUrl: './gio-ps-policies-catalog-dialog.component.html',
  styleUrls: ['./gio-ps-policies-catalog-dialog.component.scss'],
})
export class GioPolicyStudioPoliciesCatalogDialogComponent implements OnDestroy {
  public policies: PolicyVM[] = [];

  public executionPhase!: ExecutionPhase;
  public executionPhaseLabel!: string;

  public selectedPolicy?: GenericPolicy;

  public stepToAdd?: Step;

  public categories: string[] = [];

  public isValid = false;

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
    this.executionPhase = flowDialogData.executionPhase;
    this.executionPhaseLabel = executionPhaseLabels[flowDialogData.executionPhase];

    this.allPolicies = flowDialogData.genericPolicies
      .filter(genericPolicy => {
        if (isPolicy(genericPolicy)) {
          if (flowDialogData.apiType === 'PROXY') {
            return genericPolicy.proxy?.includes(flowDialogData.executionPhase);
          }
          return genericPolicy.message?.includes(flowDialogData.executionPhase);
        }
        if (isSharedPolicyGroupPolicy(genericPolicy)) {
          return genericPolicy.apiType === flowDialogData.apiType && genericPolicy.phase === flowDialogData.executionPhase;
        }
        // Not expected
        throw new Error('Unknown policy type');
      })
      .map(policy => ({
        category: policy.category ?? 'Others',
        _id: policy._id,
        name: policy.name,
        description: policy.description,
        icon: isPolicy(policy) ? policy.icon : undefined,
        deployed: isPolicy(policy) ? policy.deployed : undefined,
        genericPolicy: policy,
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

  public onSelectPolicy(policy: PolicyVM) {
    if (policy.deployed === false) {
      this.isUnlicensed = true;
    }
    this.selectedPolicy = policy.genericPolicy;
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
      policy: this.selectedPolicy?.policyId,
    });
  }

  public onGoBack() {
    // Reset to initial value
    this.selectedPolicy = undefined;
    this.isValid = false;
    this.isUnlicensed = false;
  }
}
