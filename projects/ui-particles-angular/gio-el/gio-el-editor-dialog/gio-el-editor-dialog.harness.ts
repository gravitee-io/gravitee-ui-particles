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
import { MatDialogSection } from '@angular/material/dialog/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

export interface GioElEditorDialogHarnessOptions extends BaseHarnessFilters {}

export class GioElEditorDialogHarness extends ComponentHarness {
  public static readonly hostSelector = `gio-el-editor-dialog`;

  public static with(options: GioElEditorDialogHarnessOptions): HarnessPredicate<GioElEditorDialogHarness> {
    return new HarnessPredicate(GioElEditorDialogHarness, options);
  }

  protected _title = this.locatorForOptional(MatDialogSection.TITLE);
  protected _content = this.locatorForOptional(MatDialogSection.CONTENT);
  protected _actions = this.locatorForOptional(MatDialogSection.ACTIONS);

  public async getTitleText(): Promise<string> {
    return (await this._title())?.text() ?? '';
  }

  public async getContentText(): Promise<string> {
    return (await this._content())?.text() ?? '';
  }

  public async getActionsText(): Promise<string> {
    return (await this._actions())?.text() ?? '';
  }

  public async close(): Promise<void> {
    const closeButton = await this.locatorFor(MatButtonHarness.with({ text: /Close/ }))();
    await closeButton.click();
  }

  public async confirmMyAction(): Promise<void> {
    const confirmButton = await this.locatorFor(MatButtonHarness.with({ text: /My action/ }))();
    await confirmButton.click();
  }
}
