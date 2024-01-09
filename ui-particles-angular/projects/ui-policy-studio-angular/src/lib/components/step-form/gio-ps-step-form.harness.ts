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

import { ComponentHarness, LocatorFactory } from '@angular/cdk/testing';
import { MatLegacyInputHarness as MatInputHarness } from '@angular/material/legacy-input/testing';

export type StepForm = {
  description?: string;
  condition?: string;
  // Callback to allow to fill the fields of the jsonSchemaForm specific to each policy, if necessary. Useful if some are required.
  waitForPolicyFormCompletionCb?: (locator: LocatorFactory) => Promise<void>;
};
export class GioPolicyStudioStepFormHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-step-form';

  private getDescriptionInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="description"]' }));

  private getConditionInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="condition"]' }));

  public async setStepForm(stepForm: StepForm): Promise<void> {
    if (stepForm.description) {
      const descriptionInput = await this.getDescriptionInput();
      await descriptionInput.setValue(stepForm.description);
    }
    if (stepForm.condition) {
      const conditionInput = await this.getConditionInput();
      await conditionInput.setValue(stepForm.condition);
    }

    if (stepForm.waitForPolicyFormCompletionCb) {
      await stepForm.waitForPolicyFormCompletionCb(this.locatorFactory);
    }
  }

  public async getStepFormValue(): Promise<{
    description?: string;
  }> {
    const descriptionInput = await this.getDescriptionInput();

    return {
      description: await descriptionInput.getValue(),
    };
  }

  public async getDocumentation(): Promise<string | null> {
    const documentation = await this.locatorFor('.documentation__content > gio-asciidoctor')();
    return documentation.getAttribute('ng-reflect-content');
  }
}
