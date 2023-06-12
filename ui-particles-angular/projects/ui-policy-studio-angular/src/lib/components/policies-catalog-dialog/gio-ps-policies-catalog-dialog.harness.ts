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
import { ComponentHarness, parallel } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { DivHarness } from '@gravitee/ui-particles-angular/testing';

export class GioPolicyStudioPoliciesCatalogDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-policies-catalog-dialog';

  private policiesLocator = this.locatorForAll(DivHarness.with({ selector: '.policiesCatalog__policy' }));

  public async getPhase(): Promise<string> {
    const phase = await this.locatorFor('.title__phase')();
    return phase.text();
  }

  public async getPoliciesName(): Promise<string[]> {
    const policies = await this.locatorForAll('.policiesCatalog__policy__head__name')();
    return parallel(() => policies.map(policy => policy.text()));
  }

  public async selectPolicy(policyName: string): Promise<void> {
    const policies = await this.policiesLocator();
    const policy = policies.find(async p => (await p.getText({ childSelector: '.policiesCatalog__policy__head__name' })) === policyName);
    if (!policy) {
      throw new Error(`Policy ${policyName} not found`);
    }
    const selectBtn = await policy.childLocatorFor(MatButtonHarness.with({ selector: '.policiesCatalog__policy__selectBtn' }))();
    await selectBtn.click();
  }

  public async getSelectedPolicyName(): Promise<string> {
    const policy = await this.locatorFor('.policyForm__info__head__name')();
    return policy.text();
  }
}
