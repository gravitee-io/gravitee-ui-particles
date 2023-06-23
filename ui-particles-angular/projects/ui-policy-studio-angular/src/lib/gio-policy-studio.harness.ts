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
import { MatTabGroupHarness } from '@angular/material/tabs/testing';

import { ChannelSelector, ConditionSelector, Flow, FlowExecution, HttpSelector } from './models';
import { GioPolicyStudioFlowsMenuHarness } from './components/flows-menu/gio-ps-flows-menu.harness';
import { GioPolicyStudioDetailsHarness } from './components/flow-details/gio-ps-flow-details.harness';
import { GioPolicyStudioFlowProxyFormDialogHarness } from './components/flow-form-dialog/flow-proxy-form-dialog/gio-ps-flow-proxy-form-dialog.harness';
import { GioPolicyStudioFlowMessageFormDialogHarness } from './components/flow-form-dialog/flow-message-form-dialog/gio-ps-flow-message-form-dialog.harness';
import { GioPolicyStudioFlowExecutionFormDialogHarness } from './components/flow-execution-form-dialog/gio-ps-flow-execution-form-dialog.harness';
import { GioPolicyStudioDetailsPhaseHarness, PhaseType } from './components/flow-details-phase/gio-ps-flow-details-phase.harness';

export class GioPolicyStudioHarness extends ComponentHarness {
  public static hostSelector = 'gio-policy-studio';

  private menuHarness = this.locatorFor(GioPolicyStudioFlowsMenuHarness);

  private detailsHarness = this.locatorFor(GioPolicyStudioDetailsHarness);

  private phaseHarness = (phaseType: PhaseType) => this.locatorFor(GioPolicyStudioDetailsPhaseHarness.with({ type: phaseType }))();

  /**
   * Add a flow to a plan or to "Common flows"
   *
   * @param groupName Plan name where to add the flow. You also can define "Common flows" to add a flow to this group.
   * @param flow Flow to add
   */
  public async addFlow(groupName: string, flow: Flow): Promise<void> {
    await (await this.menuHarness()).addFlow(new RegExp(groupName, 'i'));

    await this.setFlowFormDialog(flow);
  }

  /**
   * Edit a flow configuration
   *
   * @param flowName Flow name to edit
   * @param flow
   */
  public async editFlowConfig(flowName: string, flow: Partial<Flow>): Promise<void> {
    (await this.menuHarness()).selectFlow(new RegExp(flowName, 'i'));
    await (await this.detailsHarness()).clickEditFlowBtn();

    await this.setFlowFormDialog(flow);
  }

  /**
   * Delete a flow
   *
   * @param flowName Flow name to delete
   */
  public async deleteFlow(flowName: string): Promise<void> {
    (await this.menuHarness()).selectFlow(new RegExp(flowName, 'i'));
    await (await this.detailsHarness()).clickDeleteFlowBtn();
  }

  /**
   * Select a flow in the menu
   *
   * @param flowName Flow name to select
   */
  public async selectFlowInMenu(flowName: string): Promise<void> {
    await (await this.menuHarness()).selectFlow(new RegExp(flowName, 'i'));
  }

  /**
   * Get the list of flows in the menu
   */
  public async getFlowsMenu(): Promise<
    {
      name: string | null;
      flows: {
        name: string | null;
        isSelected: boolean;
        infos: string | null;
      }[];
    }[]
  > {
    return (await this.menuHarness()).getAllFlowsGroups();
  }

  /**
   * Get selected flow infos
   */
  public async getSelectedFlowInfos(): Promise<Record<string, (string | null)[]>> {
    return await (await this.detailsHarness()).getFlowInfos();
  }

  /**
   * Get selected flow phase harness
   * @param phaseType Phase type to get
   */
  public async getSelectedFlowPhase(phaseType: PhaseType): Promise<GioPolicyStudioDetailsPhaseHarness | undefined> {
    if (phaseType === 'PUBLISH' || phaseType === 'SUBSCRIBE') {
      const matTabsHarness = await this.locatorFor(MatTabGroupHarness.with({ selector: '.content__tabs' }))();
      await matTabsHarness.selectTab({ label: 'Event messages' });
    }

    const steps = await await this.phaseHarness(phaseType);

    return steps ? steps : undefined;
  }

  /**
   * Get Save button state
   */
  public async getSaveButtonState(): Promise<'VISIBLE' | 'DISABLED' | 'SAVING'> {
    const saveButton = await this.locatorFor(MatButtonHarness.with({ ancestor: '.header__btn' }))();
    const disabled = await saveButton.isDisabled();
    const text = await saveButton.getText();

    if (text === 'Saving...') {
      return 'SAVING';
    }

    if (disabled) {
      return 'DISABLED';
    }

    return 'VISIBLE';
  }

  /**
   * Click on the "Save" button
   */
  public async save(): Promise<void> {
    await (await this.locatorFor(MatButtonHarness.with({ text: /Save/ }))()).click();
  }

  private async setFlowFormDialog(flow: Partial<Flow>) {
    const channelSelector = flow.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector | undefined;
    const httpSelector = flow.selectors?.find(s => s.type === 'HTTP') as HttpSelector | undefined;
    const conditionSelector = flow.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector | undefined;

    if (!!channelSelector && !!httpSelector) {
      throw new Error('Channel and HTTP selectors are not be used together.');
    }

    if (channelSelector) {
      const flowFormNewDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioFlowMessageFormDialogHarness)();

      const toChannelOperator = {
        STARTS_WITH: 'Starts with',
        EQUALS: 'Equals',
      };

      await flowFormNewDialog.setFlowFormValues({
        name: flow.name,
        channel: channelSelector?.channel,
        channelOperator: toChannelOperator[channelSelector.channelOperator],
        entrypoints: channelSelector?.entrypoints,
        operations: channelSelector?.operations,
        condition: conditionSelector?.condition,
      });

      await flowFormNewDialog.save();
      return;
    }

    if (httpSelector) {
      const flowFormNewDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioFlowProxyFormDialogHarness)();

      await flowFormNewDialog.setFlowFormValues({
        name: flow.name,
        path: httpSelector?.path,
        pathOperator: httpSelector?.pathOperator,
        methods: httpSelector?.methods,
        condition: conditionSelector?.condition,
      });

      await flowFormNewDialog.save();
      return;
    }

    throw new Error('No selector found for this flow. Needed to select Message or Proxy flow form dialog.');
  }

  public async setFlowExecutionConfig(flowExecution: FlowExecution): Promise<void> {
    await (await this.menuHarness()).openFlowExecutionConfig();

    const flowExecutionDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioFlowExecutionFormDialogHarness)();
    await flowExecutionDialog.setFlowFormValues(flowExecution);
    await flowExecutionDialog.save();
  }
}
