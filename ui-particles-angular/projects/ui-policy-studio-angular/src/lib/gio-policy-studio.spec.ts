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

import { fakeChannelFlow, fakePlan } from '../public-testing-api';

import { GioPolicyStudioModule } from './gio-policy-studio.module';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';
import { GioPolicyStudioDetailsHarness } from './components/flow-details/gio-ps-flow-details.harness';
import { GioPolicyStudioFlowsMenuHarness } from './components/flows-menu/gio-ps-flows-menu.harness';

describe('GioPolicyStudioModule', () => {
  let loader: HarnessLoader;
  let component: GioPolicyStudioComponent;
  let fixture: ComponentFixture<GioPolicyStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GioPolicyStudioModule, MatIconTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GioPolicyStudioComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

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

    expect(await flowsMenuHarness.getAllFlowsGroups()).toEqual([
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
});
