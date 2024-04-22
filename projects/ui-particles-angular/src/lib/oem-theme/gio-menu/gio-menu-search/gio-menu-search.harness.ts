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

import { ComponentHarness } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';

export class GioMenuSearchHarness extends ComponentHarness {
  public static hostSelector = 'gio-menu-search';
  private getSearchInput = this.locatorFor(MatInputHarness);
  private getSearchAutoComplete = this.locatorFor(MatAutocompleteHarness);

  public async setSearchValue(value: string): Promise<void> {
    return this.getSearchInput().then(input => input.setValue(value));
  }

  public async getSearchValue(): Promise<string> {
    return this.getSearchInput().then(input => input.getValue());
  }

  public async isAutoCompletePanelVisible(): Promise<boolean> {
    return this.getSearchAutoComplete().then(autocomplete => autocomplete.isOpen());
  }

  public async getFilteredOptions(): Promise<string[]> {
    return this.getSearchAutoComplete()
      .then(autocomplete => autocomplete.getOptions())
      .then(async options => Promise.all(options.map(option => option.getText())));
  }
}
