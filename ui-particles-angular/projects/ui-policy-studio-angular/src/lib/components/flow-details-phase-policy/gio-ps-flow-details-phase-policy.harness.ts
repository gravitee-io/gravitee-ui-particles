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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SpanHarness } from '@gravitee/ui-particles-angular/testing';

export type GioPolicyStudioDetailsPhasePolicyHarnessFilters = BaseHarnessFilters;

export class GioPolicyStudioDetailsPhasePolicyHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-details-phase-policy';

  /**
   * Get Harness with the given filter.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(
    options: GioPolicyStudioDetailsPhasePolicyHarnessFilters = {},
  ): HarnessPredicate<GioPolicyStudioDetailsPhasePolicyHarness> {
    return new HarnessPredicate(GioPolicyStudioDetailsPhasePolicyHarness, options);
  }

  public async getName(): Promise<string> {
    return (await (await this.locatorFor(SpanHarness.with({ selector: '.info__primary__name' }))()).getText()) ?? '';
  }
}
