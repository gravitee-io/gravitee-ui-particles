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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, parallel, TestKey } from '@angular/cdk/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatChipHarness, MatChipGridHarness } from '@angular/material/chips/testing';

export type GioFormTagsInputHarnessFilters = BaseHarnessFilters;

export class GioFormTagsInputHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-tags-input';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a `GioFormColorInputHarness` that meets
   * certain criteria.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioFormTagsInputHarnessFilters = {}): HarnessPredicate<GioFormTagsInputHarness> {
    return new HarnessPredicate(GioFormTagsInputHarness, options);
  }

  protected getMatChipGridHarness = this.locatorFor(MatChipGridHarness);
  protected getMatChipsHarness = this.locatorForAll(MatChipHarness);

  public async isDisabled(): Promise<boolean> {
    const matChipGrid = await this.getMatChipGridHarness();
    const matChips = await this.getMatChipsHarness();

    const chipListDisabled = await matChipGrid.isDisabled();
    const chipsDisabled = await parallel(() => matChips.map(async matChip => await matChip.isDisabled()));

    return chipListDisabled && chipsDisabled.every(chipDisabled => chipDisabled);
  }

  public async getTags(): Promise<string[]> {
    const matChipGrid = await this.getMatChipGridHarness();

    const chips = await matChipGrid.getRows();

    return parallel(() => chips.map(async chip => await chip.getText()));
  }

  public async addTag(tag: string, separatorKey: TestKey | 'blur' = TestKey.ENTER): Promise<void> {
    const matChipGrid = await this.getMatChipGridHarness();

    const chipInput = await matChipGrid.getInput();
    if (!chipInput) {
      throw new Error('No tags input found!');
    }
    await chipInput.setValue(tag);
    if (separatorKey === 'blur') {
      await chipInput.blur();
    } else {
      await chipInput.sendSeparatorKey(separatorKey);
    }
  }

  public async removeTag(tag: string): Promise<void> {
    const matChipGrid = await this.getMatChipGridHarness();

    const chips = await matChipGrid.getRows({ text: tag });
    if (chips[0]) {
      await chips[0].remove();
    }
  }

  public async getMatAutocompleteHarness(): Promise<MatAutocompleteHarness | null> {
    const matAutocompleteHarness = await this.locatorForOptional(MatAutocompleteHarness)();

    return matAutocompleteHarness;
  }
}
