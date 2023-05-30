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

import { DivHarness } from '../../../testing';

export class GioPolicyStudioFlowsMenuHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flows-menu';

  private locateFlowsGroups = this.locatorForAll(DivHarness.with({ selector: '.list__flowsGroup' }));
  private locateFlowByText = (text: string | RegExp) =>
    this.locatorForOptional(DivHarness.with({ selector: '.list__flowsGroup__flow', text }));

  private locateSelectedFlow = this.locatorForOptional(DivHarness.with({ selector: '.list__flowsGroup__flow.selected' }));

  public async getAllFlowsGroups(): Promise<
    {
      name: string | null;
      flows: {
        name: string | null;
        isSelected: boolean;
        infos: string | null;
      }[];
    }[]
  > {
    const flowsGroups = await this.locateFlowsGroups();

    return parallel(() =>
      flowsGroups.map(async flowsGroup => {
        const flowsGroupName = await flowsGroup.getText({ childSelector: '.list__flowsGroup__header__label' });

        const flowsDiv = await flowsGroup.childLocatorForAll(DivHarness.with({ selector: '.list__flowsGroup__flow' }))();

        const flowsInfos = parallel(() =>
          flowsDiv.map(async flowDiv => {
            return {
              name: await flowDiv.getText({ childSelector: '.list__flowsGroup__flow__name' }),
              infos: await flowDiv.getText({ childSelector: '.list__flowsGroup__flow__infos' }),
              isSelected: await flowDiv.host().then(host => host.hasClass('selected')),
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

    return selectedFlow ? { name: await selectedFlow.getText({ childSelector: '.list__flowsGroup__flow__name' }) } : null;
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
}
