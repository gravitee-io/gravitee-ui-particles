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

export type GioPolicyStudioFlowMessageHarnessData = {
  name: string;
  channelOperator: string;
  channel: string;
  entrypoints: string[];
  operations: string[];
  condition: string;
};

export class GioPolicyStudioFlowMessageFormDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-message-form-dialog';

  private getSaveBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__saveBtn' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__cancelBtn' }));
  private nameInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="name"]' }));
  private channelOperatorInput = this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="channelOperator"]' }));
  private channelInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="channel"]' }));
  private operationsInput = this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="operations"]' }));
  private entrypointsInput = this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="entrypoints"]' }));
  private conditionInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="condition"]' }));

  public async setFlowFormValues(flow: {
    name?: string;
    channelOperator?: string;
    channel?: string;
    operations?: string[];
    entrypoints?: string[];
    condition?: string;
  }): Promise<void> {
    if (flow.name) {
      const nameInput = await this.nameInput();
      await nameInput.setValue(flow.name);
    }
    if (flow.channelOperator) {
      const channelOperatorInput = await this.channelOperatorInput();
      const entrypointsInput = await this.entrypointsInput();
      await channelOperatorInput.open();
      // Unselect all options before selecting the new one
      for (const option of await entrypointsInput.getOptions()) {
        if (await option.isSelected()) {
          await option.click();
        }
      }
      await channelOperatorInput.clickOptions({ text: new RegExp(flow.channelOperator, 'i') });
    }
    if (flow.channel) {
      const channelInput = await this.channelInput();
      await channelInput.setValue(flow.channel);
    }
    if (flow.operations) {
      const operationsInput = await this.operationsInput();
      await parallel(() =>
        (flow.operations ?? []).map(async operation => {
          await operationsInput.open();
          // Unselect all options before selecting the new one
          for (const option of await operationsInput.getOptions()) {
            if (await option.isSelected()) {
              await option.click();
            }
          }
          await operationsInput.clickOptions({ text: new RegExp(operation, 'i') });
        }),
      );
    }
    if (flow.entrypoints) {
      const entrypointsInput = await this.entrypointsInput();
      await entrypointsInput.open();
      // Unselect all options before selecting the new one
      for (const option of await entrypointsInput.getOptions()) {
        if (await option.isSelected()) {
          await option.click();
        }
      }
      await parallel(() =>
        (flow.entrypoints ?? []).map(async entrypoint => {
          await entrypointsInput.clickOptions({ text: new RegExp(entrypoint, 'i') });
        }),
      );
    }
    if (flow.condition) {
      const conditionInput = await this.conditionInput();
      await conditionInput.setValue(flow.condition);
    }
  }

  public async getName(): Promise<string> {
    return this.nameInput().then(input => input.getValue());
  }

  public async getChannelOperator(): Promise<string> {
    return this.channelOperatorInput().then(input => input.getValueText());
  }

  public async getChannel(): Promise<string> {
    return this.channelInput().then(input => input.getValue());
  }

  public async getOperations(): Promise<string> {
    return this.operationsInput().then(input => input.getValueText());
  }

  public async getEntrypoints(): Promise<string> {
    return this.entrypointsInput().then(input => input.getValueText());
  }

  public async getCondition(): Promise<string> {
    return this.conditionInput().then(input => input.getValue());
  }

  public async save(): Promise<void> {
    const button = await this.getSaveBtn();
    await button.click();
  }

  public async cancel(): Promise<void> {
    const button = await this.getCancelBtn();
    await button.click();
  }

  public async getFormValues(): Promise<GioPolicyStudioFlowMessageHarnessData> {
    const name = await this.getName();
    const channelOperator = await this.getChannelOperator();
    const channel = await this.getChannel();
    const entrypoints = (await this.getEntrypoints()).split(',');
    const operations = (await this.getOperations()).split(',');
    const condition = await this.getCondition();
    return {
      name,
      channel,
      channelOperator,
      entrypoints,
      operations,
      condition,
    };
  }
}
