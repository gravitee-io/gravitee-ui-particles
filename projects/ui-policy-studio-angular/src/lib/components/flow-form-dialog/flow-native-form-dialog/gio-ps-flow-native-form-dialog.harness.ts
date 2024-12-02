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
import { MatInputHarness } from '@angular/material/input/testing';

export type GioPolicyStudioFlowNativeHarnessData = {
  name: string;
};

export class GioPolicyStudioFlowNativeFormDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-native-form-dialog';

  private getSaveBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__saveBtn' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__cancelBtn' }));
  private nameInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="name"]' }));

  public async setFlowFormValues(flow: { name?: string }): Promise<void> {
    if (flow.name) {
      const nameInput = await this.nameInput();
      await nameInput.setValue(flow.name);
    }
  }

  public async getFlowFormValues(): Promise<GioPolicyStudioFlowNativeHarnessData> {
    return {
      name: await this.getFlowName(),
    };
  }

  public async getFlowName(): Promise<string> {
    return this.nameInput().then(input => input.getValue());
  }
  public async save(): Promise<void> {
    const button = await this.getSaveBtn();
    await button.click();
  }

  public async cancel(): Promise<void> {
    const button = await this.getCancelBtn();
    await button.click();
  }
}
