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
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';

import { FlowMode } from '../../models';

export class GioPolicyStudioFlowExecutionFormDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-execution-form-dialog';

  private getSaveBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__saveBtn' }));
  private getCancelBtn = this.locatorFor(MatButtonHarness.with({ selector: '.actions__cancelBtn' }));

  public async setFlowFormValues(flowExecution: { mode?: FlowMode; matchRequired?: boolean }): Promise<void> {
    const modeInput = await this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="mode"]' }))();
    const matchRequiredInput = await this.locatorFor(MatSlideToggleHarness.with({ selector: '[formControlName="matchRequired"]' }))();

    if (flowExecution.mode) {
      await modeInput.open();

      // Unselect all options before selecting the new one
      for (const option of await modeInput.getOptions()) {
        if (await option.isSelected()) {
          await option.click();
        }
      }
      const flowModeToValue: Record<FlowMode, string> = {
        BEST_MATCH: 'Best match',
        DEFAULT: 'Default',
      };

      await modeInput.clickOptions({ text: new RegExp(flowModeToValue[flowExecution.mode], 'i') });
    }

    if (flowExecution.matchRequired) {
      await matchRequiredInput.check();
    } else {
      await matchRequiredInput.uncheck();
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
