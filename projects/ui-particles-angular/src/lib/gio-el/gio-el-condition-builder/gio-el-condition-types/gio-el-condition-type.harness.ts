/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { MatSelectHarness } from '@angular/material/select/testing';

export abstract class GioElConditionTypeComponentHarness extends ComponentHarness {
  public getOperatorSelector = this.locatorFor(MatSelectHarness.with({ selector: '[formControlName="operator"]' }));

  public async getAvailableOperators(): Promise<string[]> {
    const operatorSelector = await this.getOperatorSelector();
    await operatorSelector.open();
    const options = await operatorSelector.getOptions();
    return parallel(() => options.map(async option => await option.getText()));
  }

  public async selectOperator(operator: string): Promise<void> {
    const operatorSelector = await this.getOperatorSelector();
    await operatorSelector.clickOptions({ text: operator });
  }

  public async getOperatorValue(): Promise<string> {
    const operatorSelector = await this.getOperatorSelector();
    return operatorSelector.getValueText();
  }

  public abstract getValue(): Promise<string | boolean | number>;

  public abstract setValue(value: string | boolean | number | Date): Promise<void>;
}
