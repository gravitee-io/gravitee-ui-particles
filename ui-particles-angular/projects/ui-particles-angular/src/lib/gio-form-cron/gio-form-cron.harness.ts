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
import { MatInputHarness } from '@angular/material/input/testing';

export type GioFormCronHarnessFilters = BaseHarnessFilters;

export class GioFormCronHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-cron';

  protected getModeToggleGroup = this.locatorFor(MatButtonToggleGroupHarness.with({ selector: '[formControlName="mode"]' }));

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
    const mode = await this.getModeToggleGroup();

    const selected = await (await mode.getToggles({ checked: true }))[0]?.getText();

    if (!selected) {
      return null;
    }
    return selected;
  }

  public async setMode(mode: string): Promise<void> {
    const modeToggle = await this.getModeToggleGroup();
    await (await modeToggle.getToggles({ text: mode }))[0]?.check();
  }

  public async clear(): Promise<void> {
    const clearButton = await this.locatorForOptional('[aria-label="Clear"]')();
    await clearButton?.click();
  }

  public async getValue(): Promise<string | null> {
    const value = await this.locatorForOptional('.preview__value')();

    return value?.text() ?? null;
  }

  public async setCustomValue(value: string): Promise<void> {
    if ((await this.getMode()) !== 'Custom') {
      await this.setMode('Custom');
    }

    const input = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="customExpression"]' }))();
    await input.setValue(value);
  }

  public async isDisabled(): Promise<boolean> {
    const mode = await this.getModeToggleGroup();
    return mode.isDisabled();
  }

  public async hasError(): Promise<boolean> {
    const host = await this.host();
    const attribute = await host.getAttribute('class');
    const error = attribute?.includes('ng-invalid');

    return error ?? false;
  }
}
