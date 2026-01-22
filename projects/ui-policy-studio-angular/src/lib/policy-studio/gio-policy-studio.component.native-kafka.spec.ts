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
  fakeKafkaNativeEndpoint,
  fakeKafkaNativeEntrypoint,
  fakeNativeFlow,
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

describe('GioPolicyStudioComponent - Native Kafka', () => {
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
          entrypointConnect: [fakeTestPolicyStep()],
        }),
      ];
      component.commonFlows = commonFlows;
      component.ngOnChanges({
        commonFlows: new SimpleChange(null, null, true),
      });

      const interactPhase = await policyStudioHarness.getSelectedFlowPhase('INTERACT');
      const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
      const entrypointConnectPhase = await policyStudioHarness.getSelectedFlowPhase('ENTRYPOINT_CONNECT');

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

      expect(await entrypointConnectPhase?.getSteps()).toStrictEqual([
        { name: 'Client', type: 'connector' },
        { name: 'Policy to test UI', description: 'Test Policy description', hasCondition: false, type: 'step' },
        { name: 'Entrypoint', type: 'connector' },
      ]);
    });

    it('should add step into phase', async () => {
      const commonFlows = [
        fakeNativeFlow({
          name: 'Alphabetical policy',
          interact: [fakeTestPolicyStep({ description: 'B' })],
          publish: [fakeTestPolicyStep({ description: 'B' })],
          entrypointConnect: [fakeTestPolicyStep({ description: 'B' })],
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

      // Add step A before B into ENTRYPOINT_CONNECT phase
      const entrypointConnectPhase = await policyStudioHarness.getSelectedFlowPhase('ENTRYPOINT_CONNECT');
      await entrypointConnectPhase?.addStep(0, {
        policyName: fakeTestPolicy().name,
        description: 'A',
        async waitForPolicyFormCompletionCb(locator) {
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

      expect(commonFlow?.entrypointConnect).toEqual([
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
          entrypointConnect: [fakeTestPolicyStep({ description: 'B' })],
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

      // Edit step B into PUBLISH phase
      const publishPhase = await policyStudioHarness.getSelectedFlowPhase('PUBLISH');
      await publishPhase?.editStep(0, {
        description: 'A',
      });

      // Edit step B into ENTRYPOINT_CONNECT phase
      const entrypointConnectPhase = await policyStudioHarness.getSelectedFlowPhase('ENTRYPOINT_CONNECT');
      await entrypointConnectPhase?.editStep(0, {
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
      expect(commonFlow?.entrypointConnect).toEqual([fakeTestPolicyStep({ description: 'A' })]);
    });
  });
});
