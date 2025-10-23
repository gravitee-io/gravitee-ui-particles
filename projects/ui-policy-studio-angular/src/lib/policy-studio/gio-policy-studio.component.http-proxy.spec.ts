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
  fakeDefaultFlowExecution,
  fakeHttpFlow,
  fakeHTTPProxyEndpoint,
  fakeHTTPProxyEntrypoint,
  fakePlan,
  fakeRateLimitStep,
  fakeSharedPolicyGroupPolicyStep,
  fakeTestPolicy,
  fakeTestPolicyStep,
} from '../../public-testing-api';
import { GioPolicyStudioDetailsHarness } from '../components/flow-details/gio-ps-flow-details.harness';
import { SaveOutput } from '../models';
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
