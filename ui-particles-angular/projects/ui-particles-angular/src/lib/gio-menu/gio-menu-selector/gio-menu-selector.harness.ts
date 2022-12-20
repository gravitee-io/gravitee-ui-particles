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
import { MatSelectHarness } from '@angular/material/select/testing';

export class GioMenuSelectorHarness extends ComponentHarness {
  public static hostSelector = 'gio-menu-selector';

  private getSelect = this.locatorFor(MatSelectHarness);

  public async availableOptions(): Promise<string[]> {
    const select = await this.getSelect();
    await select.open();
    const options = await select.getOptions();

    return Promise.all(options.map(o => o.getText()));
  }

  public async selectedOption(): Promise<string> {
    const select = await this.getSelect();
    return select.getValueText();
  }

  public async selectOptionByIndex(index: number): Promise<void> {
    const select = await this.getSelect();
    await select.open();
    const options = await select.getOptions();

    return options[index].click();
  }
}
