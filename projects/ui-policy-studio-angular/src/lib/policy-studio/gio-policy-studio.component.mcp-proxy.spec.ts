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
import { importProvidersFrom, SimpleChange } from '@angular/core';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { of } from 'rxjs';
import { MatInputHarness } from '@angular/material/input/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import {
  fakeAllPolicies,
  fakeMcpFlow,
  fakeMCPProxyEndpoint,
  fakeMCPProxyEntrypoint,
  fakePlan,
  fakeTestPolicy,
  fakeTestPolicyStep,
} from '../../public-testing-api';
import { GioPolicyStudioDetailsHarness } from '../components/flow-details/gio-ps-flow-details.harness';
import { SaveOutput } from '../models';
import { fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import { fakeAllSharedPolicyGroupPolicies } from '../models/policy/SharedPolicyGroupPolicy.fixture';

import { GioPolicyStudioHarness } from './gio-policy-studio.harness';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';

describe('GioPolicyStudioComponent - MCP Proxy', () => {
  let loader: HarnessLoader;
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
    component.apiType = 'MCP_PROXY';
    fixture.detectChanges();
  });

  describe('with entrypointsInfo & endpointsInfo', () => {
    beforeEach(() => {
      component.entrypointsInfo = [fakeMCPProxyEntrypoint()];
      component.endpointsInfo = [fakeMCPProxyEndpoint()];
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
      expect(await tooltip.getTooltipText()).toEqual(`Entrypoints: MCP Proxy\nEndpoints: MCP Proxy`);

      expect(await (await loader.getHarness(MatButtonHarness.with({ text: /Save/ }))).isDisabled()).toEqual(true);
    });

    it('should display flow', async () => {
      const commonFlows = [
        fakeMcpFlow({
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
              infos: 'All Methods',
            },
          ],
        },
      ]);
    });

    it('should display flow detail info bar', async () => {
      const commonFlows = [
        fakeMcpFlow({
          name: 'Flow 1',
        }),
      ];
      component.commonFlows = commonFlows;
      component.ngOnChanges({
        commonFlows: new SimpleChange(null, null, true),
      });

      const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

      expect(await detailsHarness.getFlowInfos()).toEqual({ 'MCP Methods': ['All Methods'], Name: ['Flow 1'] });
    });

    it('should add flow into common flows', async () => {
      component.commonFlows = [];
      component.ngOnChanges({
        commonFlows: new SimpleChange(null, null, true),
      });

      await policyStudioHarness.addFlow('All plans', fakeMcpFlow({ name: '' }));

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
      const planFooFlows = [fakeMcpFlow({ name: 'Foo flow 1' })];
      const plans = [fakePlan({ name: 'Foo plan', flows: planFooFlows }), fakePlan({ name: 'Bar plan', flows: [] })];
      component.plans = plans;
      component.ngOnChanges({
        entrypointsInfo: new SimpleChange(null, null, true),
        plans: new SimpleChange(null, null, true),
      });

      const detailsHarness = await loader.getHarness(GioPolicyStudioDetailsHarness);

      // Edit first selected flow
      await policyStudioHarness.editFlowConfig(
        'Foo flow 1',
        fakeMcpFlow({
          name: 'Edited flow name',
          selectors: [
            {
              type: 'MCP',
              methods: ['tools/call', 'tools/list'],
            },
          ],
        }),
      );

      let saveOutputToExpect: SaveOutput | undefined;
      component.save.subscribe(value => (saveOutputToExpect = value));

      await policyStudioHarness.save();

      expect(saveOutputToExpect?.plansToUpdate).toStrictEqual([
        fakePlan({
          flows: [
            fakeMcpFlow({
              name: 'Edited flow name',
              selectors: [
                {
                  type: 'MCP',
                  methods: ['tools/call', 'tools/list'],
                },
              ],
            }),
          ],
          name: 'Foo plan',
        }),
      ]);

      expect(await detailsHarness.matchText(/Edited flow name/)).toEqual(true);
    });

    it('should display correct methods when switching between flows with different methods', async () => {
      const commonFlows = [
        fakeMcpFlow({
          name: 'MCP Tools Flow',
          selectors: [
            {
              type: 'MCP',
              methods: ['tools/list', 'tools/call'],
            },
          ],
        }),
        fakeMcpFlow({
          name: 'MCP Resources Flow',
          selectors: [
            {
              type: 'MCP',
              methods: ['resources/list', 'resources/read'],
            },
          ],
        }),
      ];

      component.commonFlows = commonFlows;
      component.ngOnChanges({
        commonFlows: new SimpleChange(null, null, true),
      });

      expect(await policyStudioHarness.getSelectedFlowInfos()).toEqual({
        'MCP Methods': ['tools/list', 'tools/call'],
        Name: ['MCP Tools Flow'],
      });

      await policyStudioHarness.selectFlowInMenu('MCP Resources Flow');
      expect(await policyStudioHarness.getSelectedFlowInfos()).toEqual({
        'MCP Methods': ['resources/list', 'resources/read'],
        Name: ['MCP Resources Flow'],
      });
    });

    it('should display phases steps', async () => {
      const commonFlows = [
        fakeMcpFlow({
          name: 'Flow 1',
          request: [fakeTestPolicyStep()],
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
        { name: 'MCP Proxy', type: 'connector' },
        { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
        { name: 'MCP Proxy', type: 'connector' },
      ]);

      expect(await responsePhase?.getSteps()).toStrictEqual([
        { name: 'MCP Proxy', type: 'connector' },
        { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
        { name: 'MCP Proxy', type: 'connector' },
      ]);
    });

    it('should add step into phase', async () => {
      const commonFlows = [
        fakeMcpFlow({
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
        fakeMcpFlow({
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
  });
});
