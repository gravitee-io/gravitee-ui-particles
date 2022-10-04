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
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GioFormFilePickerComponent } from './gio-form-file-picker.component';

interface GioFormFilePickerHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the formControlName  */
  formControlName?: string;
}

export class GioFormFilePickerInputHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-file-picker';

  public static with(options: GioFormFilePickerHarnessFilters): HarnessPredicate<GioFormFilePickerInputHarness> {
    return new HarnessPredicate(GioFormFilePickerInputHarness, options).addOption(
      'formControlName',
      options.formControlName,
      (harness, text) => HarnessPredicate.stringMatches(harness.getFormControlName(), text),
    );
  }

  protected _mainDiv = this.locatorFor('.file-picker__add-button');
  protected _hasErrorClass = this.locatorForOptional('[class="file-picker__add-button error"]');
  protected _inputFile = this.locatorFor('input[type="file"]');
  protected _getDisabledElement = this.locatorForOptional('.disabled');

  public async getFormControlName(): Promise<string | null> {
    const filePickerInputHarness = await this.host();
    return filePickerInputHarness.getAttribute('formControlName');
  }

  public async hasErrorClass(): Promise<boolean> {
    return !!(await this._hasErrorClass());
  }

  public async clickInside(): Promise<void> {
    await (await this._mainDiv()).click();
  }

  public async getInputFileAccept(): Promise<string | null> {
    return await (await this._inputFile()).getAttribute('accept');
  }

  public async getPreviewImages(): Promise<(string | null)[]> {
    const previewImages = await this.locatorForAll('.file-picker__preview__header-image')();
    return Promise.all(previewImages.map(previewImage => previewImage.getAttribute('style')));
  }

  public async isAddButtonPresent(): Promise<boolean> {
    return (await this.locatorForOptional('gio-form-file-picker-add-button')()) !== null;
  }

  public async isDisabled(): Promise<boolean> {
    return !!(await this._getDisabledElement());
  }

  public async deleteFile(fileIndex = 0): Promise<void> {
    const deleteButtons = await this.locatorForAll('.file-picker__preview__delete')();

    return deleteButtons[fileIndex].click();
  }

  // as Harness doesn't seem to work with input type=file
  // we use the fixture to find the instance and interact with it.
  public async dropFiles(fixture: ComponentFixture<unknown>, files: File[]): Promise<void> {
    const classValue = await (await this.host()).getAttribute('class');
    const cssClassSelector = classValue ? `[class="${classValue}"]` : '';
    const cssFormControlNameSelector = (await this.getFormControlName()) ? `[formControlName="${await this.getFormControlName()}"]` : '';

    const filePickerInputComponentInstance = fixture.debugElement.query(
      By.css(`${GioFormFilePickerInputHarness.hostSelector}${cssClassSelector}${cssFormControlNameSelector}`),
    ).componentInstance as GioFormFilePickerComponent;

    files.forEach(f => {
      filePickerInputComponentInstance.onFileDropped({
        name: f.name,
        readMode: filePickerInputComponentInstance.readMode,
        size: f.size,
        type: f.type,
        content: f,
        underlyingFile: f,
      });
    });
  }
}
