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
import { MatIconHarness } from '@angular/material/icon/testing';
import { DivHarness } from '@gravitee/ui-particles-angular/testing';

export class GioPolicyStudioFlowsMenuHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flows-menu';

  private locateFlowsGroups = this.locatorForAll(DivHarness.with({ selector: '.list__flowsGroup' }));
  private locateFlowByText = (text: string | RegExp) =>
    this.locatorForOptional(DivHarness.with({ selector: '.list__flowsGroup__flows__flow', text }));

  public locateGroupByText = (text: string | RegExp) => this.locatorForOptional(DivHarness.with({ selector: '.list__flowsGroup', text }));

  private locateSelectedFlow = this.locatorForOptional(DivHarness.with({ selector: '.list__flowsGroup__flows__flow.selected' }));

  public async getAllFlowsGroups(): Promise<
    {
      name: string | null;
      flows: {
        name: string | null;
        isSelected: boolean;
        infos: string | null;
        hasCondition: boolean;
      }[];
    }[]
  > {
    const flowsGroups = await this.locateFlowsGroups();

    return parallel(() =>
      flowsGroups.map(async flowsGroup => {
        const flowsGroupName = await flowsGroup.getText({ childSelector: '.list__flowsGroup__header__label' });

        const flowsDiv = await flowsGroup.childLocatorForAll(DivHarness.with({ selector: '.list__flowsGroup__flows__flow' }))();

        const flowsInfos = parallel(() =>
          flowsDiv.map(async flowDiv => {
            return {
              name: await flowDiv.getText({ childSelector: '.list__flowsGroup__flows__flow__left__name' }),
              infos: await flowDiv.getText({ childSelector: '.list__flowsGroup__flows__flow__left__infos' }),
              isSelected: await flowDiv.host().then(host => host.hasClass('selected')),
              hasCondition: !!(await flowDiv.childLocatorFor(MatIconHarness.with({ name: 'gio:if' }))),
            };
          }),
        );

        return {
          name: flowsGroupName,
          flows: await flowsInfos,
        };
      }),
    );
  }

  public async getSelectedFlow(): Promise<{ name: string | null } | null> {
    const selectedFlow = await this.locateSelectedFlow();

    return selectedFlow ? { name: await selectedFlow.getText({ childSelector: '.list__flowsGroup__flows__flow__left__name' }) } : null;
  }

  /**
   * Select a flow by it's text content
   */
  public async selectFlow(flowText: string | RegExp): Promise<void> {
    const flowsGroups = await this.locateFlowByText(flowText)();

    if (flowsGroups) {
      await flowsGroups.host().then(host => host.click());
    }
  }

  public async addFlow(groupName: string | RegExp): Promise<void> {
    const flowsGroups = await this.locateGroupByText(groupName)();

    if (flowsGroups) {
      await (await flowsGroups.childLocatorFor(MatButtonHarness.with({ ancestor: '.list__flowsGroup__header__addBtn' }))()).click();
    }
  }

  public async isReadOnly(): Promise<boolean> {
    const flowsGroups = await this.locateFlowsGroups();
    const flowGroup = flowsGroups.pop();
    if (!flowGroup) {
      throw new Error('A flow group is required to test that menu is readonly');
    }
    const addBtn = await flowGroup.childLocatorFor(MatButtonHarness.with({ ancestor: '.list__flowsGroup__header__addBtn' }))();

    return await addBtn.isDisabled();
  }

  public async openFlowExecutionConfig(): Promise<void> {
    await (await this.locatorFor(MatButtonHarness.with({ selector: '.header__configBtn_edit' }))())?.click();
  }
}
