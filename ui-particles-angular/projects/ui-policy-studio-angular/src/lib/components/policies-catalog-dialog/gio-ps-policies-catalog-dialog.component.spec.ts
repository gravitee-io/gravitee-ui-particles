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

import { fakeAllPolicies } from '../../models/index-testing';
import { GioPolicyStudioModule } from '../../gio-policy-studio.module';
import { ApiType, ExecutionPhase, Policy } from '../../models';
import { GioPolicyStudioService } from '../../gio-policy-studio.service';
import { fakePolicySchema } from '../../models/policy/PolicySchema.fixture';

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

  const createTestingComponent = (apiType: ApiType, executionPhase: ExecutionPhase) => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioPolicyStudioModule, MatDialogModule, NoopAnimationsModule, MatIconTestingModule],
      providers: [
        {
          provide: GioPolicyStudioService,
          useFactory: () => {
            const service = new GioPolicyStudioService();
            service.setPolicySchemaFetcher(policy => of(fakePolicySchema(policy.id)));
            service.setPolicyDocumentationFetcher(policy => of(`${policy.id} documentation`));
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
      policies: fakeAllPolicies(),
      executionPhase,
    };
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  };

  describe('When ApiType = MESSAGE and ExecutionPhase = REQUEST', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'REQUEST');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Request', p => p.message?.includes('REQUEST'));
    });

    it('should select a policy and add it', async () => {
      await componentTestingOpenDialog();

      const policiesCatalogDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);
      await policiesCatalogDialog.selectPolicy('Policy to test UI');

      expect(await policiesCatalogDialog.getSelectedPolicyName()).toEqual('Policy to test UI');

      const stepForm = await policiesCatalogDialog.getStepForm();
      await stepForm.setStepForm({
        description: 'My step description',
      });

      await policiesCatalogDialog.clickAddPolicyButton();

      expect(component.dialogResult).toStrictEqual({
        enabled: true,
        name: 'Policy to test UI',
        policy: 'test-policy',
        description: 'My step description',
      });
    });
  });

  describe('When ApiType = MESSAGE and ExecutionPhase = RESPONSE', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'RESPONSE');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Response', p => p.message?.includes('RESPONSE'));
    });
  });

  describe('When ApiType = MESSAGE and ExecutionPhase = MESSAGE_REQUEST', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'MESSAGE_REQUEST');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Publish', p => p.message?.includes('MESSAGE_REQUEST'));
    });
  });

  describe('When ApiType = MESSAGE and ExecutionPhase = MESSAGE_RESPONSE', () => {
    beforeEach(() => {
      createTestingComponent('MESSAGE', 'MESSAGE_RESPONSE');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Subscribe', p => p.message?.includes('MESSAGE_RESPONSE'));
    });
  });

  describe('When ApiType = PROXY and ExecutionPhase = REQUEST', () => {
    beforeEach(() => {
      createTestingComponent('PROXY', 'REQUEST');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Request', p => p.proxy?.includes('REQUEST'));
    });
  });

  describe('When ApiType = PROXY and ExecutionPhase = RESPONSE', () => {
    beforeEach(() => {
      createTestingComponent('PROXY', 'RESPONSE');
    });

    it('should display policies catalog', async () => {
      await componentTestingOpenDialog();

      await expectPoliciesCatalogContent('Response', p => p.proxy?.includes('RESPONSE'));
    });
  });

  async function expectPoliciesCatalogContent(phaseLabel: string, policiesFilter: (policy: Policy) => boolean | undefined) {
    const phaseDialog = await loader.getHarness(GioPolicyStudioPoliciesCatalogDialogHarness);

    expect(await phaseDialog.getPhase()).toEqual(phaseLabel);
    expect(await phaseDialog.getPoliciesName()).toEqual(
      fakeAllPolicies()
        .filter(policiesFilter)
        .map(policy => policy.name),
    );
  }

  async function componentTestingOpenDialog() {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();
  }
});
