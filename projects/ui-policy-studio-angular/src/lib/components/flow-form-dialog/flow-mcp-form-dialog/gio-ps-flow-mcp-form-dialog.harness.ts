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
import { GioFormTagsInputHarness } from '@gravitee/ui-particles-angular';

export type GioPolicyStudioFlowMcpHarnessData = {
  name: string;
  methods: string[];
  condition: string;
};

export class GioPolicyStudioFlowMcpFormDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-mcp-form-dialog';

  private getSaveBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__saveBtn' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__cancelBtn' }));
  private nameInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="name"]' }));
  private methodsInput = this.locatorFor(GioFormTagsInputHarness.with({ selector: '[formControlName="mcpMethods"]' }));
  private conditionInput = this.locatorFor(MatInputHarness.with({ selector: '[formControlName="condition"]' }));

  public async setFlowFormValues(flow: { name?: string; methods?: string[]; condition?: string }): Promise<void> {
    if (flow.name) {
      const nameInput = await this.nameInput();
      await nameInput.setValue(flow.name);
    }
    if (flow.methods) {
      const methodsInput = await this.methodsInput();
      for (const method of flow.methods) {
        await methodsInput.addTag(method);
      }
    }
    if (flow.condition) {
      const conditionInput = await this.conditionInput();
      await conditionInput.setValue(flow.condition);
    }
  }

  public async getFlowFormValues(): Promise<GioPolicyStudioFlowMcpHarnessData> {
    return {
      name: await this.getFlowName(),
      methods: await this.methodsInput().then(input => input.getTags()),
      condition: await this.conditionInput().then(input => input.getValue()),
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
