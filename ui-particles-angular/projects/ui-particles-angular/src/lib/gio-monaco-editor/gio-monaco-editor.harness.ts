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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, LocatorFactory } from '@angular/cdk/testing';
import { TestBed } from '@angular/core/testing';

import { GioMonacoEditorComponent } from './gio-monaco-editor.component';
import { GioMonacoEditorModule } from './gio-monaco-editor.module';
import { GioMonacoEditorTestingComponent } from './gio-monaco-editor.testing.component';

export const ConfigureTestingGioMonacoEditor = () => {
  // Hack to replace the default gio-monaco-editor component with fake one for testing purpose.
  try {
    TestBed.overrideModule(GioMonacoEditorModule, {
      remove: {
        declarations: [GioMonacoEditorComponent],
        exports: [GioMonacoEditorComponent],
      },
      add: {
        declarations: [GioMonacoEditorTestingComponent],
        exports: [GioMonacoEditorTestingComponent],
      },
    });
  } catch (e) {
    // Do nothing
  }
};
ConfigureTestingGioMonacoEditor();

export type GioMonacoEditorHarnessFilters = BaseHarnessFilters;

export class GioMonacoEditorHarness extends ComponentHarness {
  public static hostSelector = 'gio-monaco-editor';

  constructor(locatorFactory: LocatorFactory) {
    super(locatorFactory);
  }

  /**
   * Gets a `HarnessPredicate` that can be used to search for a `GioMonacoEditorHarness` that meets
   * certain criteria.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioMonacoEditorHarnessFilters = {}): HarnessPredicate<GioMonacoEditorHarness> {
    return new HarnessPredicate(GioMonacoEditorHarness, options);
  }

  protected getInputEl = this.locatorFor('input');

  public async setValue(value: string): Promise<void> {
    const inputEl = await this.getInputEl();
    await inputEl.clear();
    await inputEl.sendKeys(value);
  }

  public async getValue(): Promise<string> {
    const inputEl = await this.getInputEl();
    return inputEl.getProperty('value');
  }

  public async isDisabled(): Promise<boolean> {
    const inputEl = await this.getInputEl();
    return inputEl.getProperty('disabled');
  }
}
