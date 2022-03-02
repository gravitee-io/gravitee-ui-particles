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

import { AsyncFactoryFn, BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

import { GioFormTagsInputHarness } from '../public-api';

export class GioFormHeadersHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-headers';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a `GioFormColorInputHarness` that meets
   * certain criteria.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: BaseHarnessFilters = {}): HarnessPredicate<GioFormTagsInputHarness> {
    return new HarnessPredicate(GioFormTagsInputHarness, options);
  }

  private getHeaderRowsElement = this.locatorForAll('tr.gio-form-headers__table__header-row');

  private getHeaderRowInputKey = (rowIndex: number): AsyncFactoryFn<MatInputHarness> =>
    this.locatorFor(MatInputHarness.with({ ancestor: `[ng-reflect-name="${rowIndex}"]`, selector: '[formControlName=key]' }));

  private getHeaderRowInputValue = (rowIndex: number): AsyncFactoryFn<MatInputHarness> =>
    this.locatorFor(MatInputHarness.with({ ancestor: `tr[ng-reflect-name="${rowIndex}"]`, selector: '[formControlName=value]' }));

  private getHeaderRowRemoveButton = (rowIndex: number): AsyncFactoryFn<MatButtonHarness | null> =>
    this.locatorForOptional(MatButtonHarness.with({ ancestor: `tr[ng-reflect-name="${rowIndex}"]`, selector: '[aria-label="Delete"]' }));

  public async getHeaderRows(): Promise<
    { keyInput: MatInputHarness; valueInput: MatInputHarness; removeButton: MatButtonHarness | null }[]
  > {
    const rows = await this.getHeaderRowsElement();

    return Promise.all(
      rows.map(async (_, rowIndex) => ({
        keyInput: await this.getHeaderRowInputKey(rowIndex)(),
        valueInput: await this.getHeaderRowInputValue(rowIndex)(),
        removeButton: await this.getHeaderRowRemoveButton(rowIndex)(),
      })),
    );
  }

  public async getLastHeaderRow(): Promise<{ keyInput: MatInputHarness; valueInput: MatInputHarness }> {
    const rows = await this.getHeaderRowsElement();

    return {
      keyInput: await this.getHeaderRowInputKey(rows.length - 1)(),
      valueInput: await this.getHeaderRowInputValue(rows.length - 1)(),
    };
  }
}
