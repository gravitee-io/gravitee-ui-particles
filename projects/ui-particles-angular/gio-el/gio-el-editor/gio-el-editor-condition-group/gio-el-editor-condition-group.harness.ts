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
import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { DivHarness } from '@gravitee/ui-particles-angular/testing';

import { GioElEditorTypeBooleanHarness } from '../gio-el-type/gio-el-editor-type-boolean/gio-el-editor-type-boolean.harness';
import { GioElEditorTypeStringHarness } from '../gio-el-type/gio-el-editor-type-string/gio-el-editor-type-string.harness';
import { GioElEditorTypeNumberHarness } from '../gio-el-type/gio-el-editor-type-number/gio-el-editor-type-number.harness';
import { GioElEditorTypeDateHarness } from '../gio-el-type/gio-el-editor-type-date/gio-el-editor-type-date.harness';

type ConditionGroupHarnessValues = {
  condition: 'AND' | 'OR';
  conditions: (ConditionGroupHarnessValues | ConditionHarnessValues)[];
};
type ConditionHarnessValues = {
  field: string;
  operator?: string;
  value?: string | boolean | number;
};

export class GioElEditorConditionGroupHarness extends ComponentHarness {
  public static hostSelector = 'gio-el-editor-condition-group';

  public static with(options: BaseHarnessFilters = {}): HarnessPredicate<GioElEditorConditionGroupHarness> {
    return new HarnessPredicate(GioElEditorConditionGroupHarness, options);
  }

  public getNodeLvl = () => this.host().then(host => host.getAttribute('node-lvl'));

  private getAddMenuButton = this.locatorFor(MatMenuHarness.with({ triggerText: /Add/ }));
  private getConditionButtonToggleGroup = this.locatorFor(MatButtonToggleGroupHarness.with({ selector: '[formControlName="condition"]' }));
  private getConditionsHarness = async () => {
    const nodeLvl = await this.getNodeLvl();
    if (!nodeLvl) {
      throw new Error('Node level not found');
    }
    return this.locatorForAll(
      DivHarness.with({
        selector: `.conditionGroup__conditions__condition[node-lvl="${nodeLvl}"]`,
      }),
      GioElEditorConditionGroupHarness.with({
        selector: `.conditionGroup__conditions__conditionGroup[node-lvl="${Number(nodeLvl) + 1}"]`,
      }),
    )();
  };

  private getConditionHarness = async (index: number) => (await this.getConditionsHarness()).at(index);
  private getConditionTypeHarness = (divHarness: DivHarness) =>
    divHarness.childLocatorForOptional(
      GioElEditorTypeStringHarness,
      GioElEditorTypeBooleanHarness,
      GioElEditorTypeNumberHarness,
      GioElEditorTypeDateHarness,
    )();
  private getConditionField = (divHarness: DivHarness) =>
    divHarness.childLocatorFor(MatSelectHarness.with({ selector: '[formControlName="field"]' }))();

  public async clickAddNewConditionButton(): Promise<void> {
    await (await this.getAddMenuButton()).clickItem({ text: /Add Condition/ });
  }

  public async clickAddNewGroupButton(): Promise<void> {
    await (await this.getAddMenuButton()).clickItem({ text: /Add Group/ });
  }

  public async getConditionValue(): Promise<'AND' | 'OR'> {
    const conditionButtonToggleGroup = await this.getConditionButtonToggleGroup();
    const selectedToggles = await conditionButtonToggleGroup.getToggles({ checked: true });
    if (selectedToggles.length !== 1) {
      throw new Error('No operator selected');
    }
    const andOrMap: Record<string, 'AND' | 'OR'> = {
      AND: 'AND',
      OR: 'OR',
    };

    return andOrMap[await selectedToggles[0].getText()];
  }

  public async selectConditionValue(operator: 'AND' | 'OR'): Promise<void> {
    const conditionButtonToggleGroup = await this.getConditionButtonToggleGroup();
    const toggles = await conditionButtonToggleGroup.getToggles({ text: operator });
    if (toggles.length !== 1) {
      throw new Error('No operator selected');
    }
    return toggles[0].check();
  }

  public async selectConditionField(index: number, field: string): Promise<void> {
    const conditionDiv = await this.getConditionHarness(index);
    if (!conditionDiv || !(conditionDiv instanceof DivHarness)) {
      throw new Error(`Condition with index ${index} not found`);
    }

    const fieldSelect = await this.getConditionField(conditionDiv);
    await fieldSelect.clickOptions({ text: field });
  }

  public async selectConditionOperator(index: number, operator: string): Promise<void> {
    const conditionDiv = await this.getConditionHarness(index);
    if (!conditionDiv || !(conditionDiv instanceof DivHarness)) {
      throw new Error(`Condition with index ${index} not found`);
    }

    const conditionType = await this.getConditionTypeHarness(conditionDiv);
    if (!conditionType) {
      throw new Error(`Condition type not found. Select field first`);
    }

    await conditionType.selectOperator(operator);
  }

  public async getConditionAvailableOperators(index: number): Promise<string[]> {
    const conditionDiv = await this.getConditionHarness(index);
    if (!conditionDiv || !(conditionDiv instanceof DivHarness)) {
      throw new Error(`Condition with index ${index} not found`);
    }

    const conditionType = await this.getConditionTypeHarness(conditionDiv);
    if (!conditionType) {
      throw new Error(`Condition type not found. Select field first`);
    }
    return conditionType.getAvailableOperators();
  }

  public async setConditionValue(index: number, value: string | boolean | number | Date): Promise<void> {
    const conditionDiv = await this.getConditionHarness(index);
    if (!conditionDiv || !(conditionDiv instanceof DivHarness)) {
      throw new Error(`Condition with index ${index} not found`);
    }

    const conditionType = await this.getConditionTypeHarness(conditionDiv);
    if (!conditionType) {
      throw new Error(`Condition type not found. Select field first`);
    }

    if (conditionType instanceof GioElEditorTypeStringHarness && typeof value === 'string') {
      await conditionType.setValue(value);
    } else if (conditionType instanceof GioElEditorTypeBooleanHarness && typeof value === 'boolean') {
      await conditionType.setValue(value);
    } else if (conditionType instanceof GioElEditorTypeNumberHarness && typeof value === 'number') {
      await conditionType.setValue(value);
    } else if (conditionType instanceof GioElEditorTypeDateHarness && value instanceof Date) {
      await conditionType.setValue(value);
    } else {
      throw new Error(`Invalid value for condition type`);
    }
  }

  public async getConditionGroup(index: number): Promise<GioElEditorConditionGroupHarness> {
    const conditionGroup = await this.getConditionHarness(index);

    if (!conditionGroup || !(conditionGroup instanceof GioElEditorConditionGroupHarness)) {
      throw new Error(`Condition group with index ${index} not found`);
    }
    return conditionGroup;
  }

  public async getConditions(): Promise<ConditionGroupHarnessValues> {
    const getConditionsDiv = await this.getConditionsHarness();

    const conditions = await parallel(() =>
      getConditionsDiv.map(async condition => {
        if (condition instanceof GioElEditorConditionGroupHarness) {
          return await condition.getConditions();
        }
        const conditionField = await this.getConditionField(condition);

        const conditionType = await this.getConditionTypeHarness(condition);
        return {
          field: await conditionField.getValueText(),
          operator: await conditionType?.getOperatorValue(),
          value: await conditionType?.getValue(),
        };
      }),
    );

    return {
      condition: await this.getConditionValue(),
      conditions,
    };
  }
}
