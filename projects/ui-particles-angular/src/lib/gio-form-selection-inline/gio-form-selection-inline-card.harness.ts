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

export type GioFormSelectionInlineCardHarnessFilters = BaseHarnessFilters & {
  value?: string;
};

export class GioFormSelectionInlineCardHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-selection-inline-card';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a `GioFormSelectionInlineCardHarness` that meets
   * certain criteria.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioFormSelectionInlineCardHarnessFilters = {}): HarnessPredicate<GioFormSelectionInlineCardHarness> {
    return new HarnessPredicate(GioFormSelectionInlineCardHarness, options).addOption('value', options.value, (harness, value) =>
      HarnessPredicate.stringMatches(harness.getValue(), value),
    );
  }

  public async getValue(): Promise<string | null> {
    const host = await this.host();
    // Fallback to keep for Angular 19 compatibility. Can be removed when all projects are on Angular 20+
    const value = (await host.getAttribute('value')) ?? (await host.getAttribute('ng-reflect-value'));
    return value ?? null;
  }

  public async isSelected(): Promise<boolean> {
    return (await this.host()).hasClass('selected');
  }

  public async isDisabled(): Promise<boolean> {
    return (await this.host()).hasClass('disabled');
  }

  public async getContentText(): Promise<string> {
    const content = await this.locatorFor('.card__content')();
    return content.text();
  }
}
