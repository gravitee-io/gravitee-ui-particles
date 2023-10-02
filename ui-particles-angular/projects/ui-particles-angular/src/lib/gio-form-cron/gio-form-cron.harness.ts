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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';

export type GioFormCronHarnessFilters = BaseHarnessFilters;

export class GioFormCronHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-cron';

  /**
   * Gets a `HarnessPredicate` that can be used to search for this harness.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioFormCronHarnessFilters = {}): HarnessPredicate<GioFormCronHarness> {
    return new HarnessPredicate(GioFormCronHarness, options);
  }

  public async getMode(): Promise<string | null> {
    const mode = await this.locatorFor(MatButtonToggleGroupHarness.with({ selector: '[formControlName="mode"]' }))();

    const selected = await (await mode.getToggles({ checked: true }))[0]?.getText();

    if (!selected) {
      return null;
    }
    return selected;
  }

  public async getValue(): Promise<string | null> {
    const value = await this.locatorForOptional('.preview')();

    return value?.text() ?? null;
  }
}
