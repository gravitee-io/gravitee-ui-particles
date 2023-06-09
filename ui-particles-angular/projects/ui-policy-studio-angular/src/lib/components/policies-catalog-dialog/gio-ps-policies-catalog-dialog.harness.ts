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

export class GioPolicyStudioPoliciesCatalogDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-policies-catalog-dialog';

  public async getPhase(): Promise<string> {
    const phase = await this.locatorFor('.title__phase')();
    return phase.text();
  }

  public async getPoliciesName(): Promise<string[]> {
    const policies = await this.locatorForAll('.policiesCatalog__policy__head__name')();
    return parallel(() => policies.map(policy => policy.text()));
  }
}
