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

  /**
   * Hack force onload on Image Object
   * GioFormFilePickerComponent use a Image Object to check if the file is an image.
   * This method allow to force onload event on the Image Object.
   * @param excludeSrc call onerror instead of onload for this src
   */
  public static forceImageOnload(excludeSrc: string[] = []): void {
    Object.defineProperties(Image.prototype, {
      src: {
        get: function () {
          return this._src;
        },
        set: function (src) {
          this._src = src;
        },
      },
      onload: {
        get: function () {
          return this._onload;
        },
        set: function (fn) {
          this._onload = fn;

          excludeSrc.includes(this._src) ? this.onerror() : this.onload();
        },
      },
    });
  }

  protected _mainDiv = this.locatorFor('.file-picker__add-button');
  protected _hasErrorClass = this.locatorForOptional('[class="file-picker__add-button error"]');
  protected _inputFile = this.locatorFor('input[type="file"]');
  protected _getDisabledElement = this.locatorForOptional('.disabled');

  private async getFormControlName(): Promise<string | null> {
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

  public async getPreviews(): Promise<(string | null)[]> {
    const previewImages = await this.locatorForAll('.file-picker__preview__image')();
    const previewFiles = await this.locatorForAll('.file-picker__preview__file')();

    return Promise.all([
      ...previewImages.map(previewImage => previewImage.getAttribute('style')),
      ...previewFiles.map(previewFile => previewFile.text()),
    ]);
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

  public async dropFiles(files: File[]): Promise<void> {
    const filePickerDropZone = await this.locatorFor('.file-picker')();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await filePickerDropZone.dispatchEvent('drop', { dataTransfer: { files } } as any);

    // Wait event is dispatched
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
