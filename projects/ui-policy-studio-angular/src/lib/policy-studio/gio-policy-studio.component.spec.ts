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
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { importProvidersFrom, SimpleChange } from '@angular/core';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { of } from 'rxjs';
import { MatInputHarness } from '@angular/material/input/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GioConfirmDialogHarness, GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import {
  fakeAllPolicies,
  fakeChannelFlow,
  fakeConditionedChannelFlow,
  fakeDefaultFlowExecution,
  fakeHttpFlow,
  fakeHTTPProxyEndpoint,
  fakeHTTPProxyEntrypoint,
  fakeKafkaMessageEndpoint,
  fakeKafkaNativeEndpoint,
  fakeKafkaNativeEntrypoint,
  fakeNativeFlow,
  fakePlan,
  fakeRateLimitStep,
  fakeSharedPolicyGroupPolicyStep,
  fakeTestPolicy,
  fakeTestPolicyStep,
  fakeWebhookMessageEntrypoint,
  fakeWebsocketMessageEntrypoint,
} from '../../public-testing-api';
import { GioPolicyStudioDetailsHarness } from '../components/flow-details/gio-ps-flow-details.harness';
import { GioPolicyStudioFlowsMenuHarness } from '../components/flows-menu/gio-ps-flows-menu.harness';
import { ChannelSelector, SaveOutput } from '../models';
import { fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import {
  fakeAllSharedPolicyGroupPolicies,
  fakeProxyRequestSharedPolicyGroupPolicy,
  fakeProxyResponseSharedPolicyGroupPolicy,
} from '../models/policy/SharedPolicyGroupPolicy.fixture';

import { GioPolicyStudioHarness } from './gio-policy-studio.harness';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';

describe('GioPolicyStudioComponent', () => {
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;
  let component: GioPolicyStudioComponent;
  let fixture: ComponentFixture<GioPolicyStudioComponent>;
  let policyStudioHarness: GioPolicyStudioHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HttpClientTestingModule, GioPolicyStudioComponent, MatIconTestingModule],
      providers: [importProvidersFrom(GioFormJsonSchemaModule)],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true, // This checks focus trap, set it to true to  avoid the warning
          isTabbable: () => true, // This checks focus trap, set it to true to  avoid the warning
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(GioPolicyStudioComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    policyStudioHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GioPolicyStudioHarness);

    component.policies = fakeAllPolicies();
    component.sharedPolicyGroupPolicies = fakeAllSharedPolicyGroupPolicies();
    component.policySchemaFetcher = policy => of(fakePolicySchema(policy.id));
    component.policyDocumentationFetcher = policy => of({ content: `${policy.id} documentation`, language: 'ASCIIDOC' });
    component.ngOnChanges({
      policies: new SimpleChange(null, null, true),
      sharedPolicyGroupPolicies: new SimpleChange(null, null, true),
      policySchemaFetcher: new SimpleChange(null, null, true),
      policyDocumentationFetcher: new SimpleChange(null, null, true),
    });
    component.enableSavingTimer = false;
  });

  describe('MESSAGE API type', () => {
    beforeEach(() => {
      component.apiType = 'MESSAGE';
      fixture.detectChanges();
    });

    describe('with readOnly mode', () => {
      beforeEach(() => {
        component.flowsGroups = [
          {
            name: 'main flows',
            _id: 'main-flow',
            _isPlan: true,
            flows: [
              {
                ...fakeChannelFlow({ name: 'flow1' }),
                _id: 'flow',
                _hasChanged: false,
              },
            ],
          },
        ];
        component.readOnly = true;
      });

      it('should make studio read only', async () => {
        expect(await policyStudioHarness.isReadOnly()).toBe(true);
      });
    });

    describe('with entrypointsInfo & endpointsInfo', () => {
      beforeEach(() => {
        component.entrypointsInfo = [fakeWebhookMessageEntrypoint()];
        component.endpointsInfo = [fakeKafkaMessageEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });
      });

      it('should display top bar', async () => {
        // Expect top bar tooltip
        const tooltip = await loader.getHarness(
          MatTooltipHarness.with({ selector: '[mattooltipclass="gio-policy-studio__tooltip-line-break"]' }),
        );
        await tooltip.show();
        expect(await tooltip.getTooltipText()).toEqual(`Entrypoints: Webhook\nEndpoints: Kafka`);

        expect(await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).isDisabled()).toEqual(true);
      });

      it('should display empty flow', async () => {
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        expect(await detailsHarness.isDisplayEmptyFlow()).toEqual(true);

        expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
          {
            name: 'All plans',
            flows: [],
          },
        ]);
      });

      it('should display common flows', async () => {
        const commonFlows = [fakeChannelFlow({ name: 'flow1' }), fakeChannelFlow({ name: '' })];
        component.commonFlows = commonFlows;
        component.plans = [fakePlan({ name: 'Foo plan', flows: [] })];
        component.selectedFlowIndexes = { planIndex: 1, flowIndex: 0 };
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        expect(await flowsMenuHarness.getSelectedFlow()).toEqual({ name: 'flow1' });

        expect(await detailsHarness.isDisplayEmptyFlow()).toEqual(false);

        expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
          {
            name: 'Foo plan',
            flows: [],
          },
          {
            name: 'All plans',
            flows: [
              {
                name: 'flow1',
              },
              {
                name: null,
              },
            ],
          },
        ]);
      });

      it('should display plans flows', async () => {
        const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
        const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
        component.plans = plans;

        component.ngOnChanges({
          plans: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        expect(await detailsHarness.isDisplayEmptyFlow()).toEqual(false);

        expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
          {
            name: 'Foo plan',
            flows: [
              {
                name: 'Foo flow 1',
                isSelected: true,
              },
              {
                name: 'Foo flow 2',
                isSelected: false,
              },
            ],
          },
          { name: 'Bar plan', flows: [] },
          { name: 'All plans', flows: [] },
        ]);
      });

      it('should select fist flow on init', async () => {
        const commonFlows = [fakeChannelFlow({ name: 'Flow 1' }), fakeChannelFlow({ name: '' })];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        const initialNavSelectedFlow = await flowsMenuHarness.getSelectedFlow();
        expect(initialNavSelectedFlow).toEqual({ name: 'Flow 1' });

        expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
          {
            name: 'All plans',
            flows: [
              {
                isSelected: true,
                name: 'Flow 1',
              },
              {
                isSelected: false,
                name: null,
              },
            ],
          },
        ]);
        expect(component.selectedFlowIndexes).toEqual({ planIndex: 0, flowIndex: 0 });
      });

      it('should select flow from selectedFlowIndexes input', async () => {
        const commonFlows = [fakeChannelFlow({ name: 'Flow 1' }), fakeChannelFlow({ name: 'Flow 2' })];
        component.commonFlows = commonFlows;
        component.selectedFlowIndexes = { planIndex: 0, flowIndex: 1 };
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });
        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);
        const selectedFlow = await flowsMenuHarness.getSelectedFlow();
        expect(selectedFlow).toEqual({ name: 'Flow 2' });
      });

      it('should navigate between flows using the menu', async () => {
        const commonFlows = [fakeChannelFlow({ name: 'Common flow' })];
        component.commonFlows = commonFlows;

        const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
        const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
        component.plans = plans;

        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
          plans: new SimpleChange(null, null, true),
        });

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        expect(await flowsMenuHarness.getSelectedFlow()).toEqual({ name: 'Foo flow 1' });
        expect((await policyStudioHarness.getSelectedFlowInfos()).Name).toEqual(['Foo flow 1']);

        let expectedFlowIndexes;
        component.selectedFlowChanged.subscribe(selectedFlowIndexes => {
          expectedFlowIndexes = selectedFlowIndexes;
        });

        expect(expectedFlowIndexes).toBeUndefined();

        await policyStudioHarness.selectFlowInMenu('Common flow');
        expect(await flowsMenuHarness.getSelectedFlow()).toEqual({ name: 'Common flow' });
        expect((await policyStudioHarness.getSelectedFlowInfos()).Name).toEqual(['Common flow']);
        expect(expectedFlowIndexes).toEqual({ planIndex: 2, flowIndex: 0 });
      });

      it('should display flow with ChannelSelector', async () => {
        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow 1',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel1',
                channelOperator: 'EQUALS',
                operations: ['PUBLISH', 'SUBSCRIBE'],
              },
            ],
          }),
          fakeChannelFlow({
            name: 'Flow 2',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel2',
                channelOperator: 'STARTS_WITH',
                operations: ['SUBSCRIBE'],
              },
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
          {
            name: 'All plans',
            flows: [
              {
                name: 'Flow 1',
                isSelected: true,
                infos: 'PUBSUBchannel1',
              },
              {
                name: 'Flow 2',
                isSelected: false,
                infos: 'SUBchannel2**',
              },
            ],
          },
        ]);
      });

      it('should add flow into common flows', async () => {
        component.commonFlows = [];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        await policyStudioHarness.addFlow(
          'All plans',
          fakeChannelFlow({
            name: 'New flow',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel',
                channelOperator: 'STARTS_WITH',
              },
            ],
          }),
        );

        const flowsGroupsUpdated = await flowsMenuHarness.getAllFlowsGroups();

        expect(flowsGroupsUpdated).toMatchObject([
          {
            flows: [
              {
                isSelected: true,
                name: 'New flow',
              },
            ],
            name: 'All plans',
          },
        ]);
        expect(component.selectedFlowIndexes).toEqual({ planIndex: 0, flowIndex: 0 });
      });

      it('should edit flow into plan', async () => {
        const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
        const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
        component.plans = plans;
        component.ngOnChanges({
          plans: new SimpleChange(null, null, true),
        });

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);
        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        // Edit first selected flow
        await policyStudioHarness.editFlowConfig(
          'Foo flow 1',
          fakeChannelFlow({
            name: 'Edited flow name',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel',
                channelOperator: 'STARTS_WITH',
                entrypoints: ['webhook'],
              },
            ],
          }),
        );

        const flowsGroupsUpdated = await flowsMenuHarness.getAllFlowsGroups();

        expect(flowsGroupsUpdated).toMatchObject([
          {
            flows: [
              {
                isSelected: true,
                name: 'Edited flow name',
              },
              {
                isSelected: false,
                name: 'Foo flow 2',
              },
            ],
            name: 'Foo plan',
          },
          { name: 'Bar plan', flows: [] },
          { name: 'All plans', flows: [] },
        ]);

        expect(await detailsHarness.matchText(/Webhook/)).toEqual(true);
      });

      it('should delete flow into plan', async () => {
        const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
        const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
        component.plans = plans;

        component.ngOnChanges({
          plans: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        // Delete first selected flow
        await detailsHarness.clickDeleteFlowBtn();

        const flowsGroupsUpdated = await policyStudioHarness.getFlowsMenu();

        expect(flowsGroupsUpdated).toMatchObject([
          {
            flows: [
              {
                isSelected: true,
                name: 'Foo flow 2',
              },
            ],
            name: 'Foo plan',
          },
          { name: 'Bar plan', flows: [] },
          { name: 'All plans', flows: [] },
        ]);
        expect(component.selectedFlowIndexes).toEqual({ planIndex: 0, flowIndex: 0 });
      });

      it('should send commonFlowsChange on save when flow is updated', async () => {
        const commonFlows = [fakeChannelFlow({ name: '' }), fakeChannelFlow({ name: 'Flow to delete' })];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit flow
        await policyStudioHarness.editFlowConfig(
          'Foo flow 1',
          fakeChannelFlow({
            name: 'Edited flow name',
          }),
        );

        // Delete flow
        await policyStudioHarness.deleteFlow('Flow to delete');

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));

        await policyStudioHarness.save();

        // Strict expect
        expect(saveOutputToExpect?.commonFlows).toStrictEqual([
          fakeChannelFlow({
            name: 'Edited flow name',
          }),
        ]);
        expect(saveOutputToExpect?.plansToUpdate).toStrictEqual(undefined);
      });

      it('should send commonFlowsChange on save when flow is deleted only', async () => {
        const commonFlows = [fakeChannelFlow({ name: 'Flow to delete' }), fakeChannelFlow({ name: 'Unchanged flow' })];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);
        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        // Select second flow and delete it
        await flowsMenuHarness.selectFlow(/Flow to delete/);
        await detailsHarness.clickDeleteFlowBtn();

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        // Strict expect
        expect(saveOutputToExpect?.commonFlows).toStrictEqual([
          fakeChannelFlow({
            name: 'Unchanged flow',
          }),
        ]);
        expect(saveOutputToExpect?.plansToUpdate).toStrictEqual(undefined);
      });

      it('should send plansToUpdate on save', async () => {
        const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
        const plans = [
          fakePlan({ id: 'p1', name: 'Plan to update flow', flows: planFooFlows }),
          fakePlan({ id: 'p2', name: 'Plan to add flow', flows: [] }),
          fakePlan({ id: 'p3', name: 'Plan to delete flow', flows: [fakeChannelFlow({ name: 'Flow to delete' })] }),
          fakePlan({ id: 'p4', name: 'Plan with no change', flows: [fakeChannelFlow({ name: 'Unchanged flow' })] }),
        ];
        component.plans = plans;
        component.ngOnChanges({
          plans: new SimpleChange(null, null, true),
        });

        expect(await policyStudioHarness.getSaveButtonState()).toEqual('DISABLED');

        // Edit flow into Plan to update flow
        await policyStudioHarness.editFlowConfig('Foo flow 1', fakeChannelFlow({ name: 'Edited flow' }));

        // Add new flow into Plan to add flow
        await policyStudioHarness.addFlow(
          'Plan to add flow',
          fakeChannelFlow({
            name: 'New flow',
          }),
        );

        // Delete flow into Plan to delete flow
        await policyStudioHarness.deleteFlow('Flow to delete');

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));

        expect(await policyStudioHarness.getSaveButtonState()).toEqual('VISIBLE');
        await policyStudioHarness.save();

        // Strict expect
        expect(saveOutputToExpect?.commonFlows).toStrictEqual(undefined);
        expect(saveOutputToExpect?.plansToUpdate).toStrictEqual([
          fakePlan({
            id: 'p1',
            name: 'Plan to update flow',
            flows: [
              fakeChannelFlow({
                name: 'Edited flow',
              }),
              fakeChannelFlow({
                name: 'Foo flow 2',
              }),
            ],
          }),
          fakePlan({
            id: 'p2',
            name: 'Plan to add flow',
            flows: [
              {
                name: 'New flow',
                enabled: true,
                selectors: [
                  {
                    type: 'CHANNEL',
                    channel: 'channel',
                    channelOperator: 'EQUALS',
                    entrypoints: ['webhook'],
                    operations: ['PUBLISH'],
                  },
                ],
              },
            ],
          }),
          fakePlan({
            id: 'p3',
            name: 'Plan to delete flow',
            flows: [],
          }),
        ]);
        expect(await policyStudioHarness.getSaveButtonState()).toEqual('SAVING');
      });

      it('should display flow detail info bar', async () => {
        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow with entrypoints & operations',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel1',
                channelOperator: 'EQUALS',
                operations: ['SUBSCRIBE'],
                entrypoints: ['webhook'],
              },
              {
                type: 'CONDITION',
                condition: 'condition1',
              },
            ],
          }),
          fakeChannelFlow({
            name: 'Flow without entrypoints & operations',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel1',
                channelOperator: 'EQUALS',
                entrypoints: undefined,
                operations: [],
              },
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        expect(await policyStudioHarness.getSelectedFlowInfos()).toEqual({
          Name: ['Flow with entrypoints & operations'],
          Channel: ['channel1'],
          'Channel Operator': ['EQUALS'],
          Operations: ['SUB'],
          Entrypoints: ['Webhook'],
          Condition: ['condition1'],
        });

        await policyStudioHarness.selectFlowInMenu('Flow without entrypoints & operations');
        expect(await policyStudioHarness.getSelectedFlowInfos()).toEqual({
          Name: ['Flow without entrypoints & operations'],
          Channel: ['channel1'],
          'Channel Operator': ['EQUALS'],
          Operations: ['PUB', 'SUB'],
          Entrypoints: ['Webhook'],
        });
      });

      it('should both display only subscribe phase', async () => {
        component.entrypointsInfo = [fakeWebsocketMessageEntrypoint()];
        component.endpointsInfo = [fakeKafkaMessageEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });

        const subscribeChannelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['websocket'],
          operations: ['SUBSCRIBE'],
        };

        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow 1',
            selectors: [subscribeChannelSelector],
            request: [fakeTestPolicyStep()],
            response: [fakeTestPolicyStep()],
            publish: [fakeTestPolicyStep()],
            subscribe: [fakeTestPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');

        expect(await requestPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await responsePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);

        expect(await publishPhase?.getSteps()).toEqual('DISABLED');

        expect(await subscribePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);
      });

      it('should both display only publish phase', async () => {
        component.entrypointsInfo = [fakeWebsocketMessageEntrypoint()];
        component.endpointsInfo = [fakeKafkaMessageEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });

        const publishChannelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['websocket'],
          operations: ['PUBLISH'],
        };

        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow 1',
            selectors: [publishChannelSelector],
            request: [fakeTestPolicyStep()],
            response: [fakeTestPolicyStep()],
            publish: [fakeTestPolicyStep()],
            subscribe: [fakeTestPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');

        expect(await requestPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await responsePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);

        expect(await publishPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await subscribePhase?.getSteps()).toEqual('DISABLED');
      });

      it('should display both phases with empty list', async () => {
        component.entrypointsInfo = [fakeWebsocketMessageEntrypoint()];
        component.endpointsInfo = [fakeKafkaMessageEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });

        const emptyChannelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['websocket'],
          operations: [],
        };

        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow 1',
            selectors: [emptyChannelSelector],
            request: [fakeTestPolicyStep()],
            response: [fakeTestPolicyStep()],
            publish: [fakeTestPolicyStep()],
            subscribe: [fakeTestPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');

        expect(await requestPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await responsePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);

        expect(await publishPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await subscribePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);
      });

      it('should display both phases with both operations selected', async () => {
        component.entrypointsInfo = [fakeWebsocketMessageEntrypoint()];
        component.endpointsInfo = [fakeKafkaMessageEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });

        const allOperationsChannelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['websocket'],
          operations: ['PUBLISH', 'SUBSCRIBE'],
        };

        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow 1',
            selectors: [allOperationsChannelSelector],
            request: [fakeTestPolicyStep()],
            response: [fakeTestPolicyStep()],
            publish: [fakeTestPolicyStep()],
            subscribe: [fakeTestPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');

        expect(await requestPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await responsePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);

        expect(await publishPhase?.getSteps()).toStrictEqual([
          { name: 'Websocket', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);

        expect(await subscribePhase?.getSteps()).toStrictEqual([
          { name: 'Kafka', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Websocket', type: 'connector' },
        ]);
      });

      it('should add step into phase', async () => {
        const channelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['webhook'],
          operations: ['SUBSCRIBE'],
        };
        const commonFlows = [
          fakeChannelFlow({
            name: 'Alphabetical policy',
            selectors: [channelSelector],
            request: [fakeTestPolicyStep({ description: 'B' })],
            response: [fakeTestPolicyStep({ description: 'B' })],
            publish: [fakeTestPolicyStep({ description: 'B' })],
            subscribe: undefined,
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Add step A before B and C after B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.addStep(0, {
          policyName: fakeTestPolicy().name,
          description: 'A',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });
        await requestPhase?.addStep(2, {
          policyName: fakeTestPolicy().name,
          description: 'C',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });

        // Add step A into undefined SUBSCRIBE phase
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');
        await subscribePhase?.addStep(0, {
          policyName: fakeTestPolicy().name,
          description: 'A',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([
          fakeTestPolicyStep({ description: 'A', configuration: { test: '🦊' } }),
          fakeTestPolicyStep({ description: 'B' }),
          fakeTestPolicyStep({ description: 'C', configuration: { test: '🦊' } }),
        ]);

        expect(commonFlow?.subscribe).toEqual([fakeTestPolicyStep({ description: 'A', configuration: { test: '🦊' } })]);
      });

      it('should edit step into phase', async () => {
        const channelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['webhook'],
          operations: ['SUBSCRIBE'],
        };
        const commonFlows = [
          fakeChannelFlow({
            name: 'Alphabetical policy',
            selectors: [channelSelector],
            request: [fakeTestPolicyStep({ description: 'B' })],
            subscribe: [fakeTestPolicyStep({ description: 'B' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.editStep(0, {
          description: 'A',
        });

        // Edit step B into SUBSCRIBE phase
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');
        await subscribePhase?.editStep(0, {
          description: 'A',
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([fakeTestPolicyStep({ description: 'A' })]);

        expect(commonFlow?.subscribe).toEqual([fakeTestPolicyStep({ description: 'A' })]);
      });

      it('should delete step into phase', async () => {
        const channelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['webhook'],
          operations: ['SUBSCRIBE'],
        };
        const commonFlows = [
          fakeChannelFlow({
            name: 'Alphabetical policy',
            selectors: [channelSelector],
            request: [fakeTestPolicyStep({ description: 'A' }), fakeTestPolicyStep({ description: 'B' })],
            subscribe: [fakeTestPolicyStep({ description: 'B' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Delete step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.deleteStep(1);

        // Delete step B into SUBSCRIBE phase
        const subscribePhase = await policyStudioHarness.getSelectedFlowPhase('SUBSCRIBE');
        await subscribePhase?.deleteStep(0);

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([fakeTestPolicyStep({ description: 'A' })]);

        expect(commonFlow?.subscribe).toEqual([]);
      });

      it('should duplicate step into phase', async () => {
        const channelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['webhook'],
          operations: ['SUBSCRIBE'],
        };
        const commonFlows = [
          fakeChannelFlow({
            name: 'Alphabetical policy',
            selectors: [channelSelector],
            request: [fakeTestPolicyStep({ description: 'A' }), fakeTestPolicyStep({ description: 'B' })],
            subscribe: [],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Duplicate step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.duplicateStep(1);

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([
          fakeTestPolicyStep({ description: 'A' }),
          fakeTestPolicyStep({ description: 'B' }),
          fakeTestPolicyStep({ description: 'B' }),
        ]);

        expect(commonFlow?.subscribe).toEqual([]);
      });

      it('should move step into phase', async () => {
        const channelSelector: ChannelSelector = {
          type: 'CHANNEL',
          channel: 'channel',
          channelOperator: 'EQUALS',
          entrypoints: ['webhook'],
          operations: ['SUBSCRIBE'],
        };
        const commonFlows = [
          fakeChannelFlow({
            name: 'Alphabetical policy',
            selectors: [channelSelector],
            request: [
              fakeTestPolicyStep({ description: 'A' }),
              fakeTestPolicyStep({ description: 'B' }),
              fakeTestPolicyStep({ description: 'C' }),
            ],
            subscribe: [],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        // Move step B into REQUEST phase
        await requestPhase?.moveStepLeft(1);
        // Move step A into REQUEST phase
        await requestPhase?.moveStepRight(1);
        // Move step C into REQUEST phase
        await requestPhase?.moveStepLeft(1);

        // If step is already at the end
        await expect(requestPhase?.moveStepRight(2)).rejects.toThrow('Could not find item matching {"text":"Move right"}');
        // If step is already at the beginning
        await expect(requestPhase?.moveStepLeft(0)).rejects.toThrow('Could not find item matching {"text":"Move left"}');

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([
          fakeTestPolicyStep({ description: 'C' }),
          fakeTestPolicyStep({ description: 'B' }),
          fakeTestPolicyStep({ description: 'A' }),
        ]);

        expect(commonFlow?.subscribe).toEqual([]);
      });

      it('should display conditioned flow and conditioned steps', async () => {
        const commonFlows = [
          fakeConditionedChannelFlow({
            name: 'Flow 1',
            request: [fakeTestPolicyStep({ condition: 'condition1' }), fakeTestPolicyStep()],
            response: [],
            publish: [],
            subscribe: [],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const flowsMenu = await policyStudioHarness.getFlowsMenu();

        expect(flowsMenu).toStrictEqual([
          {
            flows: [
              {
                hasCondition: true,
                infos: 'PUBchannel',
                isSelected: true,
                name: 'Flow 1',
              },
            ],
            name: 'All plans',
          },
        ]);

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');

        expect(await requestPhase?.getSteps()).toStrictEqual([
          { name: 'Webhook', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: true, type: 'step' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Kafka', type: 'connector' },
        ]);
      });

      it('should disable/Enable step into phase', async () => {
        component.commonFlows = [
          fakeChannelFlow({
            name: 'name',
            request: [fakeTestPolicyStep({ description: 'description' })],
          }),
        ];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Delete step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.disableEnableStep(0);

        let saveOutput: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutput = value));
        await policyStudioHarness.save();

        expect(saveOutput?.commonFlows).toBeDefined();
        const firstSaveFlows = saveOutput?.commonFlows?.[0];
        expect(firstSaveFlows).toBeDefined();
        expect(firstSaveFlows?.request).toEqual([fakeTestPolicyStep({ description: 'description', enabled: false })]);
      });

      it('should re enable save button after 5s', fakeAsync(async () => {
        const commonFlows = [fakeChannelFlow({ name: '' }), fakeChannelFlow({ name: 'Flow to delete' })];
        component.commonFlows = commonFlows;
        component.enableSavingTimer = true;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        expect(await policyStudioHarness.getSaveButtonState()).toEqual('DISABLED');

        // Delete flow
        await policyStudioHarness.deleteFlow('Flow to delete');
        expect(await policyStudioHarness.getSaveButtonState()).toEqual('VISIBLE');

        await policyStudioHarness.save();
        expect(await policyStudioHarness.getSaveButtonState()).toEqual('SAVING');

        tick(5000);
        expect(await policyStudioHarness.getSaveButtonState()).toEqual('VISIBLE');
      }));

      it('should disable flow', async () => {
        component.commonFlows = [
          fakeChannelFlow({
            name: 'name',
            enabled: true,
          }),
        ];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Disable flow
        await policyStudioHarness.enableDisableFlow('name');

        let saveOutput: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutput = value));
        await policyStudioHarness.save();

        expect(saveOutput?.commonFlows).toBeDefined();
        const firstSaveFlows = saveOutput?.commonFlows?.[0];
        expect(firstSaveFlows).toBeDefined();
        expect(firstSaveFlows?.enabled).toEqual(false);
      });

      it('should enable flow', async () => {
        component.commonFlows = [
          fakeChannelFlow({
            name: 'name',
            enabled: false,
          }),
        ];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Enable flow
        await policyStudioHarness.enableDisableFlow('name');

        let saveOutput: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutput = value));
        await policyStudioHarness.save();

        expect(saveOutput?.commonFlows).toBeDefined();
        const firstSaveFlows = saveOutput?.commonFlows?.[0];
        expect(firstSaveFlows).toBeDefined();
        expect(firstSaveFlows?.enabled).toEqual(true);
      });

      it('should duplicate flow', async () => {
        component.commonFlows = [
          fakeChannelFlow({
            id: 'id',
            name: 'name',
            enabled: false,
          }),
        ];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Enable flow
        await policyStudioHarness.duplicateFlow('name');

        let saveOutput: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutput = value));
        await policyStudioHarness.save();

        expect(saveOutput?.commonFlows).toBeDefined();
        expect(saveOutput?.commonFlows?.length).toEqual(2);
        const duplicatedFlow = saveOutput?.commonFlows?.[1];
        expect(duplicatedFlow).toBeDefined();
        expect(duplicatedFlow?.name).toEqual('name - Copy');
        expect(duplicatedFlow?.id).toEqual(undefined);
      });

      describe('Flow search/filtering', () => {
        let inputHarness: MatInputHarness;
        beforeEach(() => {
          const commonFlows = [
            fakeChannelFlow({
              name: 'Flow 1',
              selectors: [
                {
                  type: 'CHANNEL',
                  channel: 'channel1',
                  channelOperator: 'EQUALS',
                  operations: ['PUBLISH', 'SUBSCRIBE'],
                },
              ],
            }),
            fakeChannelFlow({
              name: 'Flow 2',
              selectors: [
                {
                  type: 'CHANNEL',
                  channel: 'channel2',
                  channelOperator: 'STARTS_WITH',
                  operations: ['SUBSCRIBE'],
                },
              ],
            }),
          ];
          component.commonFlows = commonFlows;
          component.ngOnChanges({
            commonFlows: new SimpleChange(null, null, true),
          });
        });

        beforeEach(async () => {
          inputHarness = await policyStudioHarness.getSearchInput();
        });

        it('should filter by channel name', fakeAsync(async () => {
          await inputHarness.setValue('channel2');
          tick(300);
          fixture.detectChanges();
          expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
            {
              name: 'All plans',
              flows: [
                {
                  hasCondition: true,
                  infos: 'SUBchannel2**',
                  isSelected: false,
                  name: 'Flow 2',
                },
              ],
            },
          ]);
        }));

        it('should filter by operations name', fakeAsync(async () => {
          await inputHarness.setValue('PUBLISH');
          tick(300);
          fixture.detectChanges();
          expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
            {
              name: 'All plans',
              flows: [
                {
                  hasCondition: true,
                  name: 'Flow 1',
                  isSelected: true,
                  infos: 'PUBSUBchannel1',
                },
              ],
            },
          ]);
        }));
      });
    });
  });

  describe('PROXY API type', () => {
    beforeEach(() => {
      component.apiType = 'PROXY';
      fixture.detectChanges();
    });

    describe('with entrypointsInfo & endpointsInfo', () => {
      beforeEach(() => {
        component.entrypointsInfo = [fakeHTTPProxyEntrypoint()];
        component.endpointsInfo = [fakeHTTPProxyEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });
      });

      it('should display top bar', async () => {
        // Expect top bar tooltip
        const tooltip = await loader.getHarness(
          MatTooltipHarness.with({ selector: '[mattooltipclass="gio-policy-studio__tooltip-line-break"]' }),
        );
        await tooltip.show();
        expect(await tooltip.getTooltipText()).toEqual(`Entrypoints: HTTP Proxy\nEndpoints: HTTP Proxy`);

        expect(await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).isDisabled()).toEqual(true);
      });

      it('should display flow with HttpSelector', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Flow 1',
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET'],
                path: '/path1',
                pathOperator: 'EQUALS',
              },
            ],
          }),
          fakeHttpFlow({
            name: 'Flow 2',
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                path: '/path2',
                pathOperator: 'STARTS_WITH',
              },
            ],
          }),
          fakeHttpFlow({
            name: 'Flow 3',
            selectors: [
              {
                type: 'HTTP',
                methods: [],
                path: '/path3',
                pathOperator: 'EQUALS',
              },
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
          {
            name: 'All plans',
            flows: [
              {
                name: 'Flow 1',
                isSelected: true,
                infos: 'GET/path1',
              },
              {
                name: 'Flow 2',
                isSelected: false,
                infos: 'GETPOST+2/path2/**',
              },
              {
                name: 'Flow 3',
                isSelected: false,
                infos: 'ALL/path3',
              },
            ],
          },
        ]);
      });

      it('should display flow detail info bar', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Flow 1',
            selectors: [
              {
                type: 'HTTP',
                methods: [],
                path: '/path1',
                pathOperator: 'EQUALS',
              },
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        expect(await detailsHarness.getFlowInfos()).toEqual({
          Name: ['Flow 1'],
          Path: ['/path1'],
          'Path Operator': ['EQUALS'],
          'HTTP methods': ['ALL'],
        });
      });

      it('should add flow into common flows', async () => {
        component.commonFlows = [];
        component.apiType = 'PROXY';
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        await policyStudioHarness.addFlow('All plans', fakeHttpFlow({ name: 'New flow' }));

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));

        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toMatchObject([
          {
            name: 'New flow',
            enabled: true,
            selectors: [
              {
                type: 'HTTP',
                methods: ['GET'],
                path: '/path',
                pathOperator: 'EQUALS',
              },
            ],
          },
        ]);
        expect(component.selectedFlowIndexes).toEqual({ planIndex: 0, flowIndex: 0 });
      });

      it('should edit flow into plan', async () => {
        const planFooFlows = [fakeHttpFlow({ name: 'Foo flow 1' }), fakeHttpFlow({ name: 'Foo flow 2' })];
        const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
        component.plans = plans;
        component.apiType = 'PROXY';
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          plans: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        // Edit first selected flow
        await policyStudioHarness.editFlowConfig('Foo flow 1', fakeHttpFlow({ name: 'Edited flow name' }));

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));

        await policyStudioHarness.save();

        expect(saveOutputToExpect?.plansToUpdate).toStrictEqual([
          fakePlan({
            flows: [fakeHttpFlow({ name: 'Edited flow name' }), fakeHttpFlow({ name: 'Foo flow 2' })],
            name: 'Foo plan',
          }),
        ]);

        expect(await detailsHarness.matchText(/HTTP/)).toEqual(true);
      });

      it('should display phases steps', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Flow 1',
            request: [fakeRateLimitStep(), fakeSharedPolicyGroupPolicyStep()],
            response: [fakeTestPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');

        expect(await requestPhase?.getSteps()).toStrictEqual([
          { name: 'HTTP Proxy', type: 'connector' },
          { name: 'Rate Limit', description: 'Step description', hasCondition: false, type: 'step' },
          { name: 'Test PROXY SPG', description: 'Shared Policy Group', hasCondition: false, type: 'step', infoMessage: 'HasInfoMessage' },
          { name: 'HTTP Proxy', type: 'connector' },
        ]);

        expect(await responsePhase?.getSteps()).toStrictEqual([
          { name: 'HTTP Proxy', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'HTTP Proxy', type: 'connector' },
        ]);
      });

      it('should add step into phase', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Alphabetical policy',
            request: [fakeTestPolicyStep({ description: 'B' })],
            response: [fakeTestPolicyStep({ description: 'B' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Add step A before B and C after B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.addStep(0, {
          policyName: fakeTestPolicy().name,
          description: 'A',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });
        await requestPhase?.addStep(2, {
          policyName: fakeTestPolicy().name,
          description: 'C',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });

        // Add step A before B into RESPONSE phase
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        await responsePhase?.addStep(0, {
          policyName: fakeTestPolicy().name,
          description: 'A',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([
          fakeTestPolicyStep({ description: 'A', configuration: { test: '🦊' } }),
          fakeTestPolicyStep({ description: 'B' }),
          fakeTestPolicyStep({ description: 'C', configuration: { test: '🦊' } }),
        ]);

        expect(commonFlow?.response).toEqual([
          fakeTestPolicyStep({ description: 'A', configuration: { test: '🦊' } }),
          fakeTestPolicyStep({ description: 'B' }),
        ]);
      });

      it('should edit step into phase', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Alphabetical policy',
            request: [fakeTestPolicyStep({ description: 'B' })],
            response: [fakeTestPolicyStep({ description: 'B' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.editStep(0, {
          description: 'A',
        });

        // Edit step B into RESPONSE phase
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        await responsePhase?.editStep(0, {
          description: 'A',
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([fakeTestPolicyStep({ description: 'A' })]);

        expect(commonFlow?.response).toEqual([fakeTestPolicyStep({ description: 'A' })]);
      });

      it('should add step with SPG into phase', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Alphabetical policy',
            request: [fakeSharedPolicyGroupPolicyStep({ description: 'B' })],
            response: [
              fakeSharedPolicyGroupPolicyStep({
                description: 'B',
                configuration: { sharedPolicyGroupId: '4d4c1b3b-3b1b-4b3b-8b3b-response' },
              }),
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Add step A before B and C after B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.addStep(0, {
          policyName: fakeProxyRequestSharedPolicyGroupPolicy().name,
          description: 'A',
        });
        await requestPhase?.addStep(2, {
          policyName: fakeProxyRequestSharedPolicyGroupPolicy().name,
          description: 'C',
        });

        // Add step A before B into RESPONSE phase
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        await responsePhase?.addStep(0, {
          policyName: fakeProxyResponseSharedPolicyGroupPolicy().name,
          description: 'A',
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([
          fakeSharedPolicyGroupPolicyStep({ description: 'A' }),
          fakeSharedPolicyGroupPolicyStep({ description: 'B' }),
          fakeSharedPolicyGroupPolicyStep({ description: 'C' }),
        ]);

        expect(commonFlow?.response).toEqual([
          fakeSharedPolicyGroupPolicyStep({ description: 'A', configuration: { sharedPolicyGroupId: '4d4c1b3b-3b1b-4b3b-8b3b-response' } }),
          fakeSharedPolicyGroupPolicyStep({ description: 'B', configuration: { sharedPolicyGroupId: '4d4c1b3b-3b1b-4b3b-8b3b-response' } }),
        ]);
      });

      it('should edit step with SPG into phase', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Alphabetical policy',
            request: [fakeSharedPolicyGroupPolicyStep({ description: 'B' })],
            response: [
              fakeSharedPolicyGroupPolicyStep({
                description: 'B',
                configuration: { sharedPolicyGroupId: '4d4c1b3b-3b1b-4b3b-8b3b-response' },
              }),
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');
        await requestPhase?.editStep(0, {
          description: 'A',
        });

        // Edit step B into RESPONSE phase
        const responsePhase = await policyStudioHarness.getSelectedFlowPhase('RESPONSE');
        await responsePhase?.editStep(0, {
          description: 'A',
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.request).toEqual([fakeSharedPolicyGroupPolicyStep({ description: 'A' })]);

        expect(commonFlow?.response).toEqual([
          fakeSharedPolicyGroupPolicyStep({ description: 'A', configuration: { sharedPolicyGroupId: '4d4c1b3b-3b1b-4b3b-8b3b-response' } }),
        ]);
      });

      it('should edit step with not found SPG into phase', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Alphabetical policy',
            request: [fakeSharedPolicyGroupPolicyStep({ description: 'B', configuration: { sharedPolicyGroupId: 'notExist' } })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');

        const step = await requestPhase?.getStep(0);
        await step?.clickOnEdit();

        const confirmDialog = await rootLoader.getHarness(GioConfirmDialogHarness);
        expect(await (await confirmDialog.host()).text()).toContain(
          'Shared Policy Group not foundThis step is linked to a Shared Policy Group that no longer exists.\n' +
            'Note: The Gateway will ignore this step.',
        );
      });

      it('should edit step with not found Policy into phase', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Alphabetical policy',
            request: [fakeTestPolicyStep({ policy: 'notExist' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit step B into REQUEST phase
        const requestPhase = await policyStudioHarness.getSelectedFlowPhase('REQUEST');

        const step = await requestPhase?.getStep(0);
        await step?.clickOnEdit();

        const confirmDialog = await rootLoader.getHarness(GioConfirmDialogHarness);
        expect(await (await confirmDialog.host()).text()).toContain(
          'Policy not foundThis step is linked to a Policy that no longer exists.\n' +
            'Note: The Gateway will throw an error on deployment.',
        );
      });

      it('should disable flow', async () => {
        component.commonFlows = [
          fakeChannelFlow({
            name: 'name',
            enabled: true,
          }),
        ];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Disable flow
        await policyStudioHarness.enableDisableFlow('name');

        let saveOutput: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutput = value));
        await policyStudioHarness.save();

        expect(saveOutput?.commonFlows).toBeDefined();
        const firstSaveFlows = saveOutput?.commonFlows?.[0];
        expect(firstSaveFlows).toBeDefined();
        expect(firstSaveFlows?.enabled).toEqual(false);
      });

      describe('Flow search/filtering', () => {
        let inputHarness: MatInputHarness;
        beforeEach(() => {
          const commonFlows = [
            fakeHttpFlow({
              name: 'Flow 1',
              selectors: [
                {
                  type: 'HTTP',
                  methods: ['GET'],
                  path: '/path1',
                  pathOperator: 'EQUALS',
                },
              ],
            }),
            fakeHttpFlow({
              name: 'Flow 2',
              selectors: [
                {
                  type: 'HTTP',
                  methods: ['GET', 'POST', 'PUT', 'DELETE'],
                  path: '/path2',
                  pathOperator: 'STARTS_WITH',
                },
              ],
            }),
            fakeHttpFlow({
              name: 'Flow 3',
              selectors: [
                {
                  type: 'HTTP',
                  methods: [],
                  path: '/path3',
                  pathOperator: 'EQUALS',
                },
              ],
            }),
          ];
          component.commonFlows = commonFlows;
          component.ngOnChanges({
            commonFlows: new SimpleChange(null, null, true),
          });
        });

        beforeEach(async () => {
          inputHarness = await policyStudioHarness.getSearchInput();
        });

        it('should filter by flow name', fakeAsync(async () => {
          await inputHarness.setValue('Flow 3');
          tick(300);
          fixture.detectChanges();
          expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
            {
              name: 'All plans',
              flows: [
                {
                  hasCondition: true,
                  name: 'Flow 3',
                  isSelected: false,
                  infos: 'ALL/path3',
                },
              ],
            },
          ]);
        }));

        it('should filter by plan name', fakeAsync(async () => {
          await inputHarness.setValue('All plans');
          tick(300);
          fixture.detectChanges();
          expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
            {
              name: 'All plans',
              flows: [
                {
                  hasCondition: true,
                  name: 'Flow 1',
                  isSelected: true,
                  infos: 'GET/path1',
                },
                {
                  hasCondition: true,
                  name: 'Flow 2',
                  isSelected: false,
                  infos: 'GETPOST+2/path2/**',
                },
                {
                  hasCondition: true,
                  name: 'Flow 3',
                  isSelected: false,
                  infos: 'ALL/path3',
                },
              ],
            },
          ]);
        }));

        it('should filter by path label', fakeAsync(async () => {
          await inputHarness.setValue('path1');
          tick(300);
          fixture.detectChanges();
          expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
            {
              name: 'All plans',
              flows: [
                {
                  hasCondition: true,
                  name: 'Flow 1',
                  isSelected: true,
                  infos: 'GET/path1',
                },
              ],
            },
          ]);
        }));

        it('should filter by method(GET/PUT/POST)', fakeAsync(async () => {
          await inputHarness.setValue('PUT');
          tick(300);
          fixture.detectChanges();
          expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
            {
              name: 'All plans',
              flows: [
                {
                  hasCondition: true,
                  name: 'Flow 2',
                  isSelected: false,
                  infos: 'GETPOST+2/path2/**',
                },
              ],
            },
          ]);
        }));

        it('should clear filter when search is emptied', fakeAsync(async () => {
          // Search one flow
          await inputHarness.setValue('Flow 3');
          tick(300);
          fixture.detectChanges();
          let menu = await policyStudioHarness.getFlowsMenu();
          expect(menu[0].flows).toHaveLength(1);

          // Clear search
          await inputHarness.setValue('');
          tick(300);
          fixture.detectChanges();
          menu = await policyStudioHarness.getFlowsMenu();
          expect(menu[0].flows).toHaveLength(3);
        }));
      });
    });
  });

  describe('NATIVE Kafka API type', () => {
    beforeEach(() => {
      component.apiType = 'NATIVE';
      fixture.detectChanges();
    });

    describe('with entrypointsInfo & endpointsInfo', () => {
      beforeEach(() => {
        component.entrypointsInfo = [fakeKafkaNativeEntrypoint()];
        component.endpointsInfo = [fakeKafkaNativeEndpoint()];
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          endpointsInfo: new SimpleChange(null, null, true),
        });
      });

      it('should display top bar', async () => {
        // Expect top bar tooltip
        const tooltip = await loader.getHarness(
          MatTooltipHarness.with({ selector: '[mattooltipclass="gio-policy-studio__tooltip-line-break"]' }),
        );
        await tooltip.show();
        expect(await tooltip.getTooltipText()).toEqual(`Entrypoints: Client\nEndpoints: Broker`);

        expect(await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).isDisabled()).toEqual(true);
      });

      it('should display flow', async () => {
        const commonFlows = [
          fakeNativeFlow({
            name: 'Flow 1',
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        expect(await policyStudioHarness.getFlowsMenu()).toMatchObject([
          {
            name: 'All plans',
            flows: [
              {
                name: 'Flow 1',
                isSelected: true,
                infos: null,
              },
            ],
          },
        ]);
      });

      it('should display flow detail info bar', async () => {
        const commonFlows = [
          fakeNativeFlow({
            name: 'Flow 1',
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        expect(await detailsHarness.getFlowInfos()).toEqual({
          Name: ['Flow 1'],
        });
      });

      it('should add flow into common flows', async () => {
        component.commonFlows = [];
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        await policyStudioHarness.addFlow('All plans', fakeNativeFlow({ name: '' }));

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));

        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toMatchObject([
          {
            name: 'All plans flow',
            enabled: true,
          },
        ]);
        expect(component.selectedFlowIndexes).toEqual({ planIndex: 0, flowIndex: 0 });
      });

      it('should edit flow into plan', async () => {
        const planFooFlows = [fakeNativeFlow({ name: 'Foo flow 1' })];
        const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
        component.plans = plans;
        component.ngOnChanges({
          entrypointsInfo: new SimpleChange(null, null, true),
          plans: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        // Edit first selected flow
        await policyStudioHarness.editFlowConfig('Foo flow 1', fakeNativeFlow({ name: 'Edited flow name' }));

        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));

        await policyStudioHarness.save();

        expect(saveOutputToExpect?.plansToUpdate).toStrictEqual([
          fakePlan({
            flows: [fakeNativeFlow({ name: 'Edited flow name' })],
            name: 'Foo plan',
          }),
        ]);

        expect(await detailsHarness.matchText(/Edited flow name/)).toEqual(true);
      });

      it('should display phases steps', async () => {
        const commonFlows = [
          fakeNativeFlow({
            name: 'Flow 1',
            interact: [fakeTestPolicyStep()],
            publish: [fakeTestPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const interactPhase = await policyStudioHarness.getSelectedFlowPhase('INTERACT');
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');

        expect(await interactPhase?.getSteps()).toStrictEqual([
          { name: 'Client', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Broker', type: 'connector' },
        ]);

        expect(await publishPhase?.getSteps()).toStrictEqual([
          { name: 'Client', type: 'connector' },
          { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
          { name: 'Broker', type: 'connector' },
        ]);
      });

      it('should add step into phase', async () => {
        const commonFlows = [
          fakeNativeFlow({
            name: 'Alphabetical policy',
            interact: [fakeTestPolicyStep({ description: 'B' })],
            publish: [fakeTestPolicyStep({ description: 'B' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Add step A before B and C after B into INTERACT phase
        const interactPhase = await policyStudioHarness.getSelectedFlowPhase('INTERACT');
        await interactPhase?.addStep(0, {
          policyName: fakeTestPolicy().name,
          description: 'A',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });
        await interactPhase?.addStep(2, {
          policyName: fakeTestPolicy().name,
          description: 'C',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });

        // Add step A before B into PUBLISH phase
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
        await publishPhase?.addStep(0, {
          policyName: fakeTestPolicy().name,
          description: 'A',
          async waitForPolicyFormCompletionCb(locator) {
            // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
            const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
            await testPolicyConfigurationInput.setValue('🦊');
          },
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.interact).toEqual([
          fakeTestPolicyStep({ description: 'A', configuration: { test: '🦊' } }),
          fakeTestPolicyStep({ description: 'B' }),
          fakeTestPolicyStep({ description: 'C', configuration: { test: '🦊' } }),
        ]);

        expect(commonFlow?.publish).toEqual([
          fakeTestPolicyStep({ description: 'A', configuration: { test: '🦊' } }),
          fakeTestPolicyStep({ description: 'B' }),
        ]);
      });

      it('should edit step into phase', async () => {
        const commonFlows = [
          fakeNativeFlow({
            name: 'Alphabetical policy',
            interact: [fakeTestPolicyStep({ description: 'B' })],
            publish: [fakeTestPolicyStep({ description: 'B' })],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        // Edit step B into INTERACT phase
        const interactPhase = await policyStudioHarness.getSelectedFlowPhase('INTERACT');
        await interactPhase?.editStep(0, {
          description: 'A',
        });

        // Edit step B into RESPONSE phase
        const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
        await publishPhase?.editStep(0, {
          description: 'A',
        });

        // Save
        let saveOutputToExpect: SaveOutput | undefined;
        component.save.subscribe(value => (saveOutputToExpect = value));
        await policyStudioHarness.save();

        expect(saveOutputToExpect?.commonFlows).toBeDefined();
        const commonFlow = saveOutputToExpect?.commonFlows?.[0];
        expect(commonFlow).toBeDefined();
        expect(commonFlow?.interact).toEqual([fakeTestPolicyStep({ description: 'A' })]);

        expect(commonFlow?.publish).toEqual([fakeTestPolicyStep({ description: 'A' })]);
      });
    });
  });

  describe('Flow execution settings', () => {
    beforeEach(() => {
      component.flowExecution = fakeDefaultFlowExecution();
      fixture.detectChanges();
    });

    it('should not save modification', async () => {
      await policyStudioHarness.setFlowExecutionConfig({
        mode: 'DEFAULT',
        matchRequired: false,
      });

      let saveOutputToExpect: SaveOutput | undefined;
      component.save.subscribe(value => (saveOutputToExpect = value));

      await policyStudioHarness.save();
      expect(saveOutputToExpect?.flowExecution).toBeUndefined();
    });

    it('should save modification', async () => {
      await policyStudioHarness.setFlowExecutionConfig({
        mode: 'BEST_MATCH',
        matchRequired: false,
      });
      let saveOutputToExpect: SaveOutput | undefined;
      component.save.subscribe(value => (saveOutputToExpect = value));

      await policyStudioHarness.save();
      expect(saveOutputToExpect?.flowExecution).toEqual({
        mode: 'BEST_MATCH',
        matchRequired: false,
      });
    });
  });
});
