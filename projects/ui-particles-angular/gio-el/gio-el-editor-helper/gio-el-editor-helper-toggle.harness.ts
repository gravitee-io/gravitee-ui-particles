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
import { MatButtonHarness } from '@angular/material/button/testing';

export interface GioElEditorHelperToggleHarnessOptions extends BaseHarnessFilters {}

export class GioElEditorHelperToggleHarness extends ComponentHarness {
  public static readonly hostSelector = `gio-el-editor-helper-toggle`;

  public static with(options: GioElEditorHelperToggleHarnessOptions): HarnessPredicate<GioElEditorHelperToggleHarness> {
    return new HarnessPredicate(GioElEditorHelperToggleHarness, options);
  }

  private getButton = this.locatorFor(MatButtonHarness);

  public async open(): Promise<void> {
    const button = await this.getButton();
    await button.click();
  }

  public async isDisabled(): Promise<boolean> {
    const button = await this.getButton();
    return button.isDisabled();
  }
}