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
import { GioPolicyStudioPoliciesCatalogDialogHarness } from './components/policies-catalog-dialog/gio-ps-policies-catalog-dialog.harness';
import { GioPolicyStudioStepEditDialogHarness } from './components/step-edit-dialog/gio-ps-step-edit-dialog.harness';

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
   * @param tabLabel Select tabs before try to find phase. Useful to find Event phases for Message API
   */
  public async getSelectedFlowPhase(phaseType: PhaseType, tabLabel?: string): Promise<GioPolicyStudioDetailsPhaseHarness | undefined> {
    if (tabLabel) {
      const matTabsHarness = await this.locatorFor(MatTabGroupHarness.with({ selector: '.content__tabs' }))();
      await matTabsHarness.selectTab({ label: tabLabel });
    }

    const steps = await await this.phaseHarness(phaseType);

    return steps ? steps : undefined;
  }

  /**
   * Click on the "Save" button
   */
  public async save(): Promise<void> {
    await (await this.locatorFor(MatButtonHarness.with({ text: /Save/ }))()).click();
  }

  /**
   * Add a step to a phase
   * @param phaseType Phase type where to add the step
   * @param index Index where to add the step. (Add button index)
   * @param stepConfig Step to add
   */
  public async addStepToPhase(
    phaseType: PhaseType,
    index: number,
    stepConfig: {
      policyName: string;
      description?: string;
    },
  ): Promise<void> {
    const tabLabel = phaseType === 'PUBLISH' || phaseType === 'SUBSCRIBE' ? 'Event messages' : undefined;
    const phase = await this.getSelectedFlowPhase(phaseType, tabLabel);

    if (!phase) {
      throw new Error(`No phase found for type ${phaseType}`);
    }

    await phase.clickAddStep(index);

    const catalogDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioPoliciesCatalogDialogHarness)();
    await catalogDialog.selectPolicy(stepConfig.policyName);

    await (await catalogDialog.getStepForm()).setStepForm(stepConfig);

    await catalogDialog.clickAddPolicyButton();
  }

  /**
   * Edit a step configuration
   * @param phaseType Phase type where to edit the step
   * @param index Index of the policy step to edit
   * @param stepConfig Step configuration
   */
  public async editStepConfig(
    phaseType: PhaseType,
    index: number,
    stepConfig: {
      description?: string;
    },
  ): Promise<void> {
    const tabLabel = phaseType === 'PUBLISH' || phaseType === 'SUBSCRIBE' ? 'Event messages' : undefined;
    const phase = await this.getSelectedFlowPhase(phaseType, tabLabel);

    if (!phase) {
      throw new Error(`No phase found for type ${phaseType}`);
    }

    const step = await phase.getStep(index);

    await step.clickOnEdit();

    const stepEditDialog = await this.documentRootLocatorFactory().locatorFor(GioPolicyStudioStepEditDialogHarness)();
    await (await stepEditDialog.getStepForm()).setStepForm(stepConfig);

    await stepEditDialog.save();
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
