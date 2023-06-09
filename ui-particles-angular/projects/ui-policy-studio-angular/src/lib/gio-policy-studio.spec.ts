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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { SimpleChange } from '@angular/core';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';

import {
  fakeChannelFlow,
  fakeDefaultFlowExecution,
  fakeHTTPProxyEndpoint,
  fakeHTTPProxyEntrypoint,
  fakeHttpFlow,
  fakeKafkaMessageEndpoint,
  fakeMockPolicyStep,
  fakePlan,
  fakeRateLimitStep,
  fakeWebhookMessageEntrypoint,
} from '../public-testing-api';

import { GioPolicyStudioModule } from './gio-policy-studio.module';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';
import { GioPolicyStudioDetailsHarness } from './components/flow-details/gio-ps-flow-details.harness';
import { GioPolicyStudioFlowsMenuHarness } from './components/flows-menu/gio-ps-flows-menu.harness';
import { SaveOutput } from './models';
import { GioPolicyStudioHarness } from './gio-policy-studio.harness';

describe('GioPolicyStudioModule', () => {
  let loader: HarnessLoader;
  let component: GioPolicyStudioComponent;
  let fixture: ComponentFixture<GioPolicyStudioComponent>;
  let policyStudioHarness: GioPolicyStudioHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, GioPolicyStudioModule, MatIconTestingModule],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true, // This checks focus trap, set it to true to  avoid the warning
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(GioPolicyStudioComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    policyStudioHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GioPolicyStudioHarness);
  });

  describe('MESSAGE API type', () => {
    beforeEach(() => {
      component.apiType = 'MESSAGE';
      fixture.detectChanges();
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
            name: 'Common flows',
            flows: [],
          },
        ]);
      });

      it('should display common flows', async () => {
        const commonFlows = [fakeChannelFlow({ name: '' }), fakeChannelFlow({ name: 'flow2' })];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

        const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

        expect(await detailsHarness.isDisplayEmptyFlow()).toEqual(false);

        expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
          {
            name: 'Common flows',
            flows: [
              {
                name: null,
              },
              {
                name: 'flow2',
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
          { name: 'Common flows', flows: [] },
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
            name: 'Common flows',
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

        await policyStudioHarness.selectFlowInMenu('Common flow');
        expect(await flowsMenuHarness.getSelectedFlow()).toEqual({ name: 'Common flow' });
        expect((await policyStudioHarness.getSelectedFlowInfos()).Name).toEqual(['Common flow']);
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
            name: 'Common flows',
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
          'Common flows',
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
            name: 'Common flows',
          },
        ]);
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
        await detailsHarness.clickEditFlowBtn();

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
          { name: 'Common flows', flows: [] },
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
          { name: 'Common flows', flows: [] },
        ]);
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
      });

      it('should display flow detail info bar', async () => {
        const commonFlows = [
          fakeChannelFlow({
            name: 'Flow 1',
            selectors: [
              {
                type: 'CHANNEL',
                channel: 'channel1',
                channelOperator: 'EQUALS',
                operations: ['SUBSCRIBE', 'PUBLISH'],
              },
              {
                type: 'CONDITION',
                condition: 'condition1',
              },
            ],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        expect(await policyStudioHarness.getSelectedFlowInfos()).toEqual({
          Name: ['Flow 1'],
          Channel: ['channel1'],
          'Channel Operator': ['EQUALS'],
          Operations: ['PUB', 'SUB'],
          Entrypoints: ['Webhook'],
          Condition: ['condition1'],
        });
      });

      it('should display phases steps', async () => {
        const commonFlows = [
          fakeHttpFlow({
            name: 'Flow 1',
            request: [fakeMockPolicyStep()],
            response: [fakeMockPolicyStep()],
            publish: [fakeMockPolicyStep()],
            subscribe: [fakeMockPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhaseSteps = await policyStudioHarness.getSelectedFlowSteps('REQUEST');
        const responsePhaseSteps = await policyStudioHarness.getSelectedFlowSteps('RESPONSE');
        const publishPhaseSteps = await policyStudioHarness.getSelectedFlowSteps('PUBLISH', 'Event messages');
        const subscribePhaseSteps = await policyStudioHarness.getSelectedFlowSteps('SUBSCRIBE', 'Event messages');

        expect(requestPhaseSteps).toStrictEqual([
          { text: 'Webhook', type: 'connector' },
          { text: 'Mock Policy', type: 'policy' },
          { text: 'Kafka', type: 'connector' },
        ]);

        expect(responsePhaseSteps).toStrictEqual([
          { text: 'Kafka', type: 'connector' },
          { text: 'Mock Policy', type: 'policy' },
          { text: 'Webhook', type: 'connector' },
        ]);
        expect(publishPhaseSteps).toEqual('DISABLED');

        expect(subscribePhaseSteps).toEqual([
          { text: 'Kafka', type: 'connector' },
          { text: 'Mock Policy', type: 'policy' },
          { text: 'Webhook', type: 'connector' },
        ]);
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
            name: 'Common flows',
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
          Entrypoints: ['HTTP Proxy'],
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

        await policyStudioHarness.addFlow('Common flows', fakeHttpFlow({ name: 'New flow' }));

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
            request: [fakeRateLimitStep()],
            response: [fakeMockPolicyStep()],
          }),
        ];
        component.commonFlows = commonFlows;
        component.ngOnChanges({
          commonFlows: new SimpleChange(null, null, true),
        });

        const requestPhaseSteps = await policyStudioHarness.getSelectedFlowSteps('REQUEST');
        const responsePhaseSteps = await policyStudioHarness.getSelectedFlowSteps('RESPONSE');

        expect(requestPhaseSteps).toStrictEqual([
          { text: 'HTTP Proxy', type: 'connector' },
          { text: 'Rate Limit', type: 'policy' },
          { text: 'HTTP Proxy', type: 'connector' },
        ]);

        expect(responsePhaseSteps).toStrictEqual([
          { text: 'HTTP Proxy', type: 'connector' },
          { text: 'Mock Policy', type: 'policy' },
          { text: 'HTTP Proxy', type: 'connector' },
        ]);
      });
    });
  });

  describe('Flow execution settings', () => {
    beforeEach(() => {
      component.flowExecution = fakeDefaultFlowExecution();
      fixture.detectChanges();
    });

    it('should not enable save button', async () => {
      await policyStudioHarness.setFlowExecutionConfig({
        mode: 'DEFAULT',
        matchRequired: false,
      });

      expect(await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).isDisabled()).toEqual(true);
      component.save.subscribe(value => {
        expect(value.flowExecution).toBeUndefined();
      });
    });

    it('should enable save button', async () => {
      await policyStudioHarness.setFlowExecutionConfig({
        mode: 'BEST_MATCH',
        matchRequired: false,
      });

      expect(await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).isDisabled()).toEqual(false);
      component.save.subscribe(value => {
        expect(value.flowExecution).toEqual({
          mode: 'BEST_MATCH',
          matchRequired: false,
        });
      });
    });
  });
});
