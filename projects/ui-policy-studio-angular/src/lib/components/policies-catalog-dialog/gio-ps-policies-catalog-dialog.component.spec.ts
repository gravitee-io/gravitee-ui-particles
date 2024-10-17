/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { of } from 'rxjs';
import { MatInputHarness } from '@angular/material/input/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { fakeAllPolicies } from '../../models/index-testing';
import { ApiType, FlowPhase, isPolicy, isSharedPolicyGroupPolicy, toGenericPolicies, GenericPolicy, fromPolicyInput } from '../../models';
import { GioPolicyStudioService } from '../../policy-studio/gio-policy-studio.service';
import { fakePolicyDocumentation, fakePolicySchema } from '../../models/policy/PolicySchema.fixture';
import { fakeAllSharedPolicyGroupPolicies } from '../../models/policy/SharedPolicyGroupPolicy.fixture';

import {
  GioPolicyStudioPoliciesCatalogDialogComponent,
  GioPolicyStudioPoliciesCatalogDialogData,
  GioPolicyStudioPoliciesCatalogDialogResult,
} from './gio-ps-policies-catalog-dialog.component';
import { GioPolicyStudioPoliciesCatalogDialogHarness } from './gio-ps-policies-catalog-dialog.harness';

@Component({
  selector: 'gio-dialog-test',
  template: `<button mat-button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class TestComponent {
  @Input()
  public dialogData?: GioPolicyStudioPoliciesCatalogDialogData;
  public dialogResult?: GioPolicyStudioPoliciesCatalogDialogResult;

  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<
        GioPolicyStudioPoliciesCatalogDialogComponent,
        GioPolicyStudioPoliciesCatalogDialogData,
        GioPolicyStudioPoliciesCatalogDialogResult
      >(GioPolicyStudioPoliciesCatalogDialogComponent, {
        data: this.dialogData,
        role: 'alertdialog',
        id: 'testDialog',
      })
      .afterClosed()
      .subscribe(result => (this.dialogResult = result));
  }
}

describe('GioPolicyStudioPoliciesCatalogDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  const createTestingComponent = (apiType: ApiType, flowPhase: FlowPhase) => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        GioPolicyStudioPoliciesCatalogDialogComponent,
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatIconTestingModule,
      ],
      providers: [
        {
          provide: GioPolicyStudioService,
          useFactory: () => {
            const service = new GioPolicyStudioService();
            service.setPolicySchemaFetcher(policy => of(fakePolicySchema(policy.id)));
            service.setPolicyDocumentationFetcher(policy => of(fakePolicyDocumentation(policy.id)));
            return service;
          },
        },
      ],
    }).overrideProvider(InteractivityChecker, {
      useValue: {
        isFocusable: () => true, // This traps focus checks and so avoid warnings when dealing with
        isTabbable: () => true, // hidden elements
      },
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.dialogData = {
      apiType,
      genericPolicies: toGenericPolicies(fakeAllPolicies().map(fromPolicyInput), fakeAllSharedPolicyGroupPolicies()),
      flowPhase,
      trialUrl: 'https://gravitee.io/self-hosted-trial',
    };
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  };

  describe('When ApiType = MESSAGE and FlowPhase = REQUEST', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'REQUEST');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Request', p => isPolicy(p) && p.flowPhaseCompatibility?.HTTP_MESSAGE?.includes('REQUEST'));

      await expectPoliciesCatalogContent('Request', p => isSharedPolicyGroupPolicy(p) && p.apiType === 'MESSAGE' && p.phase === 'REQUEST');
    });

    it('should select a policy and add it', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);
      await policiesCatalogDialog.selectPolicy('Policy to test UI');

      expect(await policiesCatalogDialog.getSelectedPolicyName()).toEqual('Policy to test UI');

      const stepForm = await policiesCatalogDialog.getStepForm();
      await stepForm.setStepForm({
        description: 'My step description',
        condition: 'test == true',
        async waitForPolicyFormCompletionCb() {
          // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
          const testPolicyConfigurationInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="test"]' }));
          await testPolicyConfigurationInput.setValue('🦊');
        },
      });

      await policiesCatalogDialog.clickAddPolicyButton();

      expect(component.dialogResult).toStrictEqual({
        enabled: true,
        name: 'Policy to test UI',
        policy: 'test-policy',
        description: 'My step description',
        condition: 'test == true',
        messageCondition: undefined,
        configuration: {
          test: '🦊',
        },
      });
    });

    it('should display policy documentation', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);
      await policiesCatalogDialog.selectPolicy('Policy to test UI');

      const stepForm = await policiesCatalogDialog.getStepForm();

      expect(await stepForm.getDocumentation()).toContain('= Test Policy documentation');
    });

    it('should display categories selection', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);

      expect(await policiesCatalogDialog.getCategoriesSelection()).toEqual([
        {
          name: 'Security',
          selected: false,
        },
        {
          name: 'Transformation',
          selected: false,
        },
        {
          name: 'Others',
          selected: false,
        },
      ]);
    });

    it('should filter policy list', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);

      expect(await policiesCatalogDialog.getPoliciesName()).toHaveLength(11);
      await policiesCatalogDialog.selectCategoryFilter('Others');
      expect(await policiesCatalogDialog.getPoliciesName()).toHaveLength(5);

      await policiesCatalogDialog.searchFilter('Policy to test UI');
      expect(await policiesCatalogDialog.getPoliciesName()).toHaveLength(1);
    });
  });

  describe('When ApiType = MESSAGE and FlowPhase = RESPONSE', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'RESPONSE');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Response', p => isPolicy(p) && p.flowPhaseCompatibility?.HTTP_MESSAGE?.includes('RESPONSE'));
      await expectPoliciesCatalogContent(
        'Response',
        p => isSharedPolicyGroupPolicy(p) && p.apiType === 'MESSAGE' && p.phase === 'RESPONSE',
      );
    });
  });

  describe('When ApiType = MESSAGE and FlowPhase = PUBLISH', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'PUBLISH');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Publish', p => isPolicy(p) && p.flowPhaseCompatibility?.HTTP_MESSAGE?.includes('PUBLISH'));
      await expectPoliciesCatalogContent('Publish', p => isSharedPolicyGroupPolicy(p) && p.apiType === 'MESSAGE' && p.phase === 'PUBLISH');
    });

    it('should select a policy and add it with messageCondition', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);
      await policiesCatalogDialog.selectPolicy('Policy to test UI');

      expect(await policiesCatalogDialog.getSelectedPolicyName()).toEqual('Policy to test UI');

      const stepForm = await policiesCatalogDialog.getStepForm();
      await stepForm.setStepForm({
        description: 'My step description',
        condition: 'test == true',
        messageCondition: '{#message.headers["content-type"] == "application/json"}',
        async waitForPolicyFormCompletionCb() {
          // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
          const testPolicyConfigurationInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="test"]' }));
          await testPolicyConfigurationInput.setValue('🦊');
        },
      });

      await policiesCatalogDialog.clickAddPolicyButton();

      expect(component.dialogResult).toStrictEqual({
        enabled: true,
        name: 'Policy to test UI',
        policy: 'test-policy',
        description: 'My step description',
        condition: 'test == true',
        messageCondition: '{#message.headers["content-type"] == "application/json"}',
        configuration: {
          test: '🦊',
        },
      });
    });
  });

  describe('When ApiType = MESSAGE and FlowPhase = SUBSCRIBE', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'SUBSCRIBE');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Subscribe', p => isPolicy(p) && p.flowPhaseCompatibility?.HTTP_MESSAGE?.includes('SUBSCRIBE'));
      await expectPoliciesCatalogContent(
        'Subscribe',
        p => isSharedPolicyGroupPolicy(p) && p.apiType === 'MESSAGE' && p.phase === 'SUBSCRIBE',
      );
    });
  });

  describe('When ApiType = PROXY and FlowPhase = REQUEST', () => {
    beforeEach(() => {
      createTestingComponent('PROXY', 'REQUEST');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Request', p => isPolicy(p) && p.flowPhaseCompatibility?.HTTP_PROXY?.includes('REQUEST'));
      await expectPoliciesCatalogContent('Request', p => isSharedPolicyGroupPolicy(p) && p.apiType === 'PROXY' && p.phase === 'REQUEST');
    });

    it('should display a banner with a "Request upgrade" button when policy is not deployed (enterprise license)', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);
      await policiesCatalogDialog.selectPolicy('No license policy');

      expect(await policiesCatalogDialog.getSelectedPolicyName()).toEqual('No license policy');
      expect(await policiesCatalogDialog.hasRequestUpgradeButton()).toBe(true);
    });
  });

  describe('When ApiType = PROXY and FlowPhase = RESPONSE', () => {
    beforeEach(() => {
      createTestingComponent('PROXY', 'RESPONSE');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Response', p => isPolicy(p) && p.flowPhaseCompatibility?.HTTP_PROXY?.includes('RESPONSE'));
      await expectPoliciesCatalogContent('Response', p => isSharedPolicyGroupPolicy(p) && p.apiType === 'PROXY' && p.phase === 'RESPONSE');
    });
  });

  async function expectPoliciesCatalogContent(phaseLabel: string, policiesFilter: (genericPolicy: GenericPolicy) => boolean | undefined) {
    const phaseDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);

    expect(await phaseDialog.getPhase()).toEqual(phaseLabel);
    expect(await phaseDialog.getPoliciesName()).toStrictEqual(
      expect.arrayContaining(
        toGenericPolicies(fakeAllPolicies().map(fromPolicyInput), fakeAllSharedPolicyGroupPolicies())
          .filter(policiesFilter)
          .map(policy => policy.name),
      ),
    );
  }

  async function componentTestingOpenDialog() {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();
  }
});
