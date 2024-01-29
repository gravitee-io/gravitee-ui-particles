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
import { MatButtonHarness } from '@angular/material/button/testing';

export class GioConfirmDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-confirm-dialog';

  private getConfirmBtn = this.locatorFor(MatButtonHarness.with({ selector: '.confirm-dialog__confirm-button' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.confirm-dialog__cancel-button' }));

  public async confirm(): Promise<void> {
    const button = await this.getConfirmBtn();
    await button.click();
  }

  public async cancel(): Promise<void> {
    const button = await this.getCancelBtn();
    await button.click();
  }
}
