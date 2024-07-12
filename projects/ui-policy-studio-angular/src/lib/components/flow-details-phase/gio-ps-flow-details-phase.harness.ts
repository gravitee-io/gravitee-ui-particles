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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { DivHarness, SpanHarness } from '@gravitee/ui-particles-angular/testing';
import { isEmpty } from 'lodash';
import { MatButtonHarness } from '@angular/material/button/testing';

import { GioPolicyStudioDetailsPhaseStepHarness } from '../flow-details-phase-step/gio-ps-flow-details-phase-step.harness';
import { GioPolicyStudioStepEditDialogHarness } from '../step-edit-dialog/gio-ps-step-edit-dialog.harness';
import { GioPolicyStudioPoliciesCatalogDialogHarness } from '../policies-catalog-dialog/gio-ps-policies-catalog-dialog.harness';
import { StepForm } from '../step-form/gio-ps-step-form.harness';

export type PhaseType = 'REQUEST' | 'RESPONSE' | 'PUBLISH' | 'SUBSCRIBE';

export type GioPolicyStudioDetailsPhaseHarnessFilters = BaseHarnessFilters & {
  type?: PhaseType;
};

const TYPE_TO_TEXT: Record<PhaseType, string> = {
  REQUEST: 'Request phase',
  RESPONSE: 'Response phase',
  PUBLISH: 'Publish phase',
  SUBSCRIBE: 'Subscribe phase',
};

export type StepCard =
  | {
      name: string;
      type: 'connector';
    }
  | {
      name: string;
      description?: string;
      hasCondition: boolean;
      type: 'step';
    };

export class GioPolicyStudioDetailsPhaseHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-details-phase';

  private getHeaderName = () =>
    this.locatorForOptional(SpanHarness.with({ selector: '.header__name' }))().then(async span => span?.getText() ?? null);

  /**
   * Get Harness with the given filter.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioPolicyStudioDetailsPhaseHarnessFilters = {}): HarnessPredicate<GioPolicyStudioDetailsPhaseHarness> {
    return new HarnessPredicate(GioPolicyStudioDetailsPhaseHarness, options).addOption('type', options.type, async (harness, type) => {
      return HarnessPredicate.stringMatches(harness.getHeaderName(), TYPE_TO_TEXT[type]);
    });
  }

  public async getSteps(): Promise<StepCard[] | 'DISABLED'> {
    if (await this.locatorForOptional('.disabledContent')()) {
      return 'DISABLED';
    }

    const stepsDiv = await this.locatorForAll(DivHarness.with({ selector: '.content__step' }))();

    if (isEmpty(stepsDiv)) {
      // No step - the phase is disabled
      return [];
    }

    return await parallel(() =>
      stepsDiv.map(async stepDiv => {
        const idConnector = !!(await stepDiv.getText({ childSelector: '.content__step__connector__badge' }));
        if (idConnector) {
          return {
            name: (await stepDiv.getText()) ?? '',
            type: 'connector',
          };
        }
        const step = await stepDiv.childLocatorFor(GioPolicyStudioDetailsPhaseStepHarness)();
        const conditionDiv = await stepDiv.childLocatorForOptional(DivHarness.with({ selector: '.content__step__policy__condition' }))();
        const description = await step.getDescription();

        return {
          type: 'step',
          name: await step.getName(),
          hasCondition: !!conditionDiv,
          ...(description ? { description } : {}),
        };
      }),
    );
  }

  public async getStep(index: number): Promise<GioPolicyStudioDetailsPhaseStepHarness> {
    const steps = await this.locatorForAll(GioPolicyStudioDetailsPhaseStepHarness)();
    if (!steps[index]) {
      throw new Error(`Step ${index} not found`);
    }
    return steps[index];
  }

  public async clickAddStep(index: number): Promise<void> {
    const addStepBtn = await this.locatorForAll(DivHarness.with({ selector: '.content__step' }))().then(divs => divs[index]);

    await addStepBtn
      .childLocatorFor(MatButtonHarness.with({ selector: '.content__step__addBtn' }))()
      .then(btn => btn.click());
  }

  /**
   * Add a step to a phase
   * @param index Index where to add the step. (Add button index)
   * @param stepConfig Step to add
   */
  public async addStep(
    index: number,
    stepConfig: {
      policyName: string;
    } & StepForm,
  ): Promise<void> {
    await this.clickAddStep(index);

    const catalogDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioPoliciesCatalogDialogHarness)();
    await catalogDialog.selectPolicy(stepConfig.policyName);

    await (await catalogDialog.getStepForm()).setStepForm(stepConfig);

    await catalogDialog.clickAddPolicyButton();
  }

  /**
   * Edit a step configuration
   * @param index Index of the policy step to edit
   * @param stepConfig Step configuration
   */
  public async editStep(index: number, stepConfig: StepForm): Promise<void> {
    const step = await this.getStep(index);

    await step.clickOnEdit();

    const stepEditDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioStepEditDialogHarness)();
    await (await stepEditDialog.getStepForm()).setStepForm(stepConfig);

    await stepEditDialog.save();
  }

  /**
   * Delete a step
   * @param index Index of the policy step to delete
   */
  public async deleteStep(index: number): Promise<void> {
    const step = await this.getStep(index);

    await step.clickOnDelete();
  }

  /**
   * Disable a step
   * @param index Index of the policy step to disable
   */
  public async disableEnableStep(index: number): Promise<void> {
    const step = await this.getStep(index);
    await step.clickOnDisableEnable();
  }
}
