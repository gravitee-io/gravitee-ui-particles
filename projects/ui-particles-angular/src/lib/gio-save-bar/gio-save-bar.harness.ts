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

import { ComponentHarness } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

export class GioSaveBarHarness extends ComponentHarness {
  public static hostSelector = 'gio-save-bar';

  private readonly cardSelector = '.save-bar__content';
  private readonly resetButtonSelector = '.save-bar__content__actions__reset-button';
  private readonly submitButtonSelector = '.save-bar__content__actions__submit-button';

  protected getSubmitButton = this.locatorFor(MatButtonHarness.with({ selector: this.submitButtonSelector }));
  protected getResetButton = this.locatorFor(this.resetButtonSelector);

  public async isVisible(): Promise<boolean> {
    const card = await this.locatorForOptional(this.cardSelector)();
    return card !== null;
  }

  public async clickSubmit(): Promise<void> {
    const host = await this.host();
    await host.dispatchEvent('disable-submit-lock');
    const submitButton = await this.getSubmitButton();
    return submitButton.click();
  }

  public async isSubmitButtonInvalid(): Promise<boolean> {
    const submitButton = await this.getSubmitButton();
    const submitButtonHost = await submitButton.host();
    return submitButtonHost.hasClass('invalid');
  }

  public async isSubmitButtonDisabled(): Promise<boolean> {
    const submitButton = await this.getSubmitButton();
    return submitButton.isDisabled();
  }

  public async isSubmitButtonVisible(): Promise<boolean> {
    const submitButton = await this.locatorForOptional(this.submitButtonSelector)();
    return submitButton !== null;
  }

  public async isResetButtonVisible(): Promise<boolean> {
    const submitButton = await this.locatorForOptional(this.resetButtonSelector)();
    return submitButton !== null;
  }

  public async clickReset(): Promise<void> {
    const resetButton = await this.getResetButton();
    return resetButton.click();
  }
}
