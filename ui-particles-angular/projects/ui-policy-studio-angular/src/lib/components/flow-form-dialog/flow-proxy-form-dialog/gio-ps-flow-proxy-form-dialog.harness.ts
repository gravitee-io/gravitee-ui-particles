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
import { MatSelectHarness } from '@angular/material/select/testing';
import { GioFormTagsInputHarness } from '@gravitee/ui-particles-angular';

export class GioPolicyStudioFlowProxyFormDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-proxy-form-dialog';

  private getSaveBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__saveBtn' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__cancelBtn' }));

  public async setFlowFormValues(flow: {
    name?: string;
    pathOperator?: string;
    path?: string;
    methods?: string[];
    condition?: string;
  }): Promise<void> {
    const nameInput = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="name"]' }))();
    const pathOperatorInput = await this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="pathOperator"]' }))();
    const pathInput = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="path"]' }))();
    const methodsInput = await this.locatorFor(GioFormTagsInputHarness.with({ selector: '[formControlName="methods"]' }))();
    const conditionInput = await this.locatorFor(MatInputHarness.with({ selector: '[formControlName="condition"]' }))();

    if (flow.name) {
      await nameInput.setValue(flow.name);
    }
    if (flow.pathOperator) {
      await pathOperatorInput.open();
      await pathOperatorInput.clickOptions({ text: new RegExp(flow.pathOperator, 'i') });
    }
    if (flow.path) {
      await pathInput.setValue(flow.path);
    }
    if (flow.methods) {
      await methodsInput.removeTag('ALL');
      for await (const method of flow.methods) {
        await methodsInput.addTag(method);
      }
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
