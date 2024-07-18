/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { ComponentHarness } from '@angular/cdk/testing';
import { DivHarness } from '@gravitee/ui-particles-angular/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { GioPolicyStudioDetailsPhaseHarness } from '../components/flow-details-phase/gio-ps-flow-details-phase.harness';
import { StepForm } from '../components/step-form/gio-ps-step-form.harness';
import { GioPolicyStudioPoliciesCatalogDialogHarness } from '../components/policies-catalog-dialog/gio-ps-policies-catalog-dialog.harness';

export class GioPolicyGroupStudioHarness extends ComponentHarness {
  public static hostSelector = 'gio-policy-group-studio';

  private phaseHarness = () => this.locatorFor(GioPolicyStudioDetailsPhaseHarness)();

  /**
   * Get Policy Group phase harness
   */
  public async getPolicyGroupPhase(): Promise<GioPolicyStudioDetailsPhaseHarness> {
    return this.phaseHarness();
  }

  public async clickAddStep(index: number): Promise<void> {
    const addStepBtn = await this.locatorForAll(DivHarness.with({ selector: '.content__step' }))().then(divs => divs[index]);

    await addStepBtn
      .childLocatorFor(MatButtonHarness.with({ selector: '.content__step__addBtn' }))()
      .then(btn => btn.click());
  }

  /**
   * Add a step to a policy-group
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
}
