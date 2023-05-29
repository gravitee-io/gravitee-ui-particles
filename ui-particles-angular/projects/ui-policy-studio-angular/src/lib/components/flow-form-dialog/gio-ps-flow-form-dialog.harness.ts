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
import { ComponentHarness, parallel } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class GioPolicyStudioFlowFormDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-form-dialog';

  private getSaveBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__saveBtn' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__cancelBtn' }));

  public async setFlowFormValues(flow: {
    name?: string;
    channelOperator?: string;
    channel?: string;
    operations?: string[];
    entrypoints?: string[];
    condition?: string;
  }): Promise<void> {
    const nameInput = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="name"]' }))();
    const channelOperatorInput = await this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="channelOperator"]' }))();
    const channelInput = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="channel"]' }))();
    const operationsInput = await this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="operations"]' }))();
    const entrypointsInput = await this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="entrypoints"]' }))();
    const conditionInput = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="condition"]' }))();

    if (flow.name) {
      await nameInput.setValue(flow.name);
    }
    if (flow.channelOperator) {
      await channelOperatorInput.open();
      await channelOperatorInput.clickOptions({ text: new RegExp(flow.channelOperator, 'i') });
    }
    if (flow.channel) {
      await channelInput.setValue(flow.channel);
    }
    if (flow.operations) {
      await parallel(() =>
        (flow.operations ?? []).map(async operation => {
          await operationsInput.open();
          await operationsInput.clickOptions({ text: new RegExp(operation, 'i') });
        }),
      );
    }
    if (flow.entrypoints) {
      await parallel(() =>
        (flow.entrypoints ?? []).map(async entrypoint => {
          await entrypointsInput.open();
          await entrypointsInput.clickOptions({ text: new RegExp(entrypoint, 'i') });
        }),
      );
    }
    if (flow.condition) {
      await conditionInput.setValue(flow.condition);
    }
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
