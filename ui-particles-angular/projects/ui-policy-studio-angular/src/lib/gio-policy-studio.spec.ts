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

import { fakeChannelFlow, fakeHttpFlow, fakePlan } from '../public-testing-api';

import { GioPolicyStudioModule } from './gio-policy-studio.module';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';
import { GioPolicyStudioDetailsHarness } from './components/flow-details/gio-ps-flow-details.harness';
import { GioPolicyStudioFlowsMenuHarness } from './components/flows-menu/gio-ps-flows-menu.harness';
import { GioPolicyStudioFlowMessageFormDialogHarness } from './components/flow-message-form-dialog/gio-ps-flow-message-form-dialog.harness';
import { Flow, Plan } from './models';

describe('GioPolicyStudioModule', () => {
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;
  let component: GioPolicyStudioComponent;
  let fixture: ComponentFixture<GioPolicyStudioComponent>;

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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GioPolicyStudioComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    component.apiType = 'MESSAGE';
    fixture.detectChanges();
  });

  it('should display api info', async () => {
    component.entrypointsInfo = [
      {
        type: 'webhook',
        icon: 'gio:webhook',
      },
    ];
    component.endpointsInfo = [
      {
        type: 'kafka',
        icon: 'gio:kafka',
      },
    ];
    component.ngOnChanges({
      entrypointsInfo: new SimpleChange(null, null, true),
      endpointsInfo: new SimpleChange(null, null, true),
    });

    const tooltip = await loader.getHarness(
      MatTooltipHarness.with({ selector: '[mattooltipclass="gio-policy-studio__tooltip-line-break"]' }),
    );
    await tooltip.show();
    expect(await tooltip.getTooltipText()).toEqual(`Entrypoints: Webhook\nEndpoints: Kafka`);
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

    const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);
    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

    expect(await flowsMenuHarness.getSelectedFlow()).toEqual({ name: 'Foo flow 1' });
    expect(await detailsHarness.getFlowName()).toEqual('Foo flow 1');

    await flowsMenuHarness.selectFlow(/Common flow/);
    expect(await flowsMenuHarness.getSelectedFlow()).toEqual({ name: 'Common flow' });
    expect(await detailsHarness.getFlowName()).toEqual('Common flow');
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

    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

    expect(await flowsMenuHarness.getAllFlowsGroups()).toMatchObject([
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

  it('should add flow into common flows', async () => {
    component.commonFlows = [];
    component.ngOnChanges({
      commonFlows: new SimpleChange(null, null, true),
    });

    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

    const flowsGroups = await flowsMenuHarness.getAllFlowsGroups();

    await flowsGroups[0].clickAddFlowBtn();

    const flowFormDialog = await rootLoader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialog.setFlowFormValues({ name: 'New flow' });
    await flowFormDialog.save();

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
    component.entrypointsInfo = [
      {
        type: 'webhook',
        icon: 'gio:webhook',
      },
    ];
    component.ngOnChanges({
      entrypointsInfo: new SimpleChange(null, null, true),
      plans: new SimpleChange(null, null, true),
    });

    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);
    const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

    // Edit first selected flow
    await detailsHarness.clickEditFlowBtn();

    const flowFormDialog = await rootLoader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialog.setFlowFormValues({ name: 'Edited flow name', entrypoints: ['webhook'] });
    await flowFormDialog.save();

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

    expect(await detailsHarness.matchText(/webhook/)).toEqual(true);
  });

  it('should delete flow into plan', async () => {
    const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
    const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
    component.plans = plans;

    component.ngOnChanges({
      plans: new SimpleChange(null, null, true),
    });

    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);
    const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

    // Delete first selected flow
    await detailsHarness.clickDeleteFlowBtn();

    const flowsGroupsUpdated = await flowsMenuHarness.getAllFlowsGroups();

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

  it('should send commonFlowsChange on save', async () => {
    const commonFlows = [fakeChannelFlow({ name: '' }), fakeChannelFlow({ name: 'Flow 2' })];
    component.commonFlows = commonFlows;
    component.ngOnChanges({
      commonFlows: new SimpleChange(null, null, true),
    });

    const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);
    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

    // Edit first selected flow
    await detailsHarness.clickEditFlowBtn();
    const flowFormDialog = await rootLoader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialog.setFlowFormValues({ name: 'Edited flow name' });
    await flowFormDialog.save();

    // Select second flow and delete it
    await flowsMenuHarness.selectFlow(/Flow 2/);
    await detailsHarness.clickDeleteFlowBtn();

    let commonFlowChangeToExpect: Flow[] | undefined;
    let plansToUpdateToExpect: Plan[] | undefined;
    component.commonFlowsChange.subscribe(value => (commonFlowChangeToExpect = value));
    component.plansToUpdate.subscribe(value => (plansToUpdateToExpect = value));

    await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).click();

    // Strict expect
    expect(commonFlowChangeToExpect).toStrictEqual([
      fakeChannelFlow({
        name: 'Edited flow name',
      }),
    ]);
    expect(plansToUpdateToExpect).toStrictEqual(undefined);
  });

  it('should send plansToUpdate on save', async () => {
    const planFooFlows = [fakeChannelFlow({ name: 'Foo flow 1' }), fakeChannelFlow({ name: 'Foo flow 2' })];
    const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
    component.plans = plans;
    component.ngOnChanges({
      plans: new SimpleChange(null, null, true),
    });

    const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);
    const flowsMenuHarness = await loader.getHarness(GioPolicyStudioFlowsMenuHarness);

    // Edit first selected flow
    await detailsHarness.clickEditFlowBtn();
    const flowFormEditDialog = await rootLoader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormEditDialog.setFlowFormValues({ name: 'Edited flow' });
    await flowFormEditDialog.save();

    // Add new flow into Bar plan
    await (await flowsMenuHarness.getAllFlowsGroups()).find(group => group.name === 'Bar plan')?.clickAddFlowBtn();

    const flowFormNewDialog = await rootLoader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormNewDialog.setFlowFormValues({ name: 'New flow' });
    await flowFormNewDialog.save();

    let commonFlowChangeToExpect: Flow[] | undefined;
    let plansToUpdateToExpect: Plan[] | undefined;
    component.commonFlowsChange.subscribe(value => (commonFlowChangeToExpect = value));
    component.plansToUpdate.subscribe(value => (plansToUpdateToExpect = value));

    await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).click();

    // Strict expect
    expect(commonFlowChangeToExpect).toStrictEqual(undefined);
    expect(plansToUpdateToExpect).toStrictEqual([
      fakePlan({
        name: 'Foo plan',
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
        name: 'Bar plan',
        flows: [
          {
            name: 'New flow',
            enabled: true,
            selectors: [
              {
                type: 'CHANNEL',
                channel: '',
                channelOperator: 'EQUALS',
                entrypoints: [],
                operations: [],
              },
            ],
          },
        ],
      }),
    ]);
  });
});
