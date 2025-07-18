/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export class GioElFieldHarness extends ComponentHarness {
  public static hostSelector = 'gio-el-field';

  public static with(options: BaseHarnessFilters = {}): HarnessPredicate<GioElFieldHarness> {
    return new HarnessPredicate(GioElFieldHarness, options);
  }

  private getAutocomplete = this.locatorFor(MatAutocompleteHarness.with({ selector: '.fieldSelect' }));

  private getKey1Input = this.locatorForOptional(MatInputHarness.with({ selector: '.key1' }));
  private getKey2Input = this.locatorForOptional(MatInputHarness.with({ selector: '.key2' }));

  public async setValue(field: string, key1?: string, key2?: string) {
    const autocomplete = await this.getAutocomplete();
    await autocomplete.focus();
    await autocomplete.selectOption({ text: new RegExp(`${field}`) });

    if (key1) {
      const key1Input = await this.getKey1Input();
      await key1Input?.setValue(key1);
    }

    if (key2) {
      const key2Input = await this.getKey2Input();
      await key2Input?.setValue(key2);
    }
  }

  public async getValue(): Promise<{
    field: string;
    key1?: string;
    key2?: string;
  }> {
    const autocomplete = await this.getAutocomplete();
    const field = await autocomplete.getValue();

    const key1Input = await this.getKey1Input();
    const key1 = await key1Input?.getValue();

    const key2Input = await this.getKey2Input();
    const key2 = await key2Input?.getValue();

    return { field, key1, key2 };
  }
}
