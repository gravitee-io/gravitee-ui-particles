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

import { fakeTestPolicyStep, fakeTestPolicy } from '../../models/index-testing';
import { Policy, Step } from '../../models';
import { GioPolicyStudioService } from '../../policy-studio/gio-policy-studio.service';
import { fakePolicyDocumentation, fakePolicySchema } from '../../models/policy/PolicySchema.fixture';

import {
  GioPolicyStudioStepEditDialogComponent,
  GioPolicyStudioStepEditDialogData,
  GioPolicyStudioStepEditDialogResult,
} from './gio-ps-step-edit-dialog.component';
import { GioPolicyStudioStepEditDialogHarness } from './gio-ps-step-edit-dialog.harness';

@Component({
  selector: 'gio-dialog-test',
  template: `<button mat-button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class TestComponent {
  @Input()
  public dialogData?: GioPolicyStudioStepEditDialogData;

  public dialogResult?: GioPolicyStudioStepEditDialogResult;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioStepEditDialogComponent, GioPolicyStudioStepEditDialogData, GioPolicyStudioStepEditDialogResult>(
        GioPolicyStudioStepEditDialogComponent,
        {
          data: this.dialogData,
          role: 'alertdialog',
          id: 'testDialog',
        },
      )
      .afterClosed()
      .subscribe(result => (this.dialogResult = result));
  }
}

describe('GioPolicyStudioStepEditDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  const createTestingComponent = (policy: Policy, step: Step) => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        GioPolicyStudioStepEditDialogComponent,
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
      genericPolicy: {
        ...policy,
        _id: 'test',
        policyId: policy.id,
        type: 'POLICY',
      },
      step,
      executionPhase: 'REQUEST',
    };
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  };

  it('should edit step policy config', async () => {
    createTestingComponent(fakeTestPolicy(), fakeTestPolicyStep());

    await componentTestingOpenDialog();
    const policyFormDialog = await loader.getHarness(GioPolicyStudioStepEditDialogHarness);
    expect(await policyFormDialog.getPolicyName()).toEqual('Policy to test UI');

    const stepForm = await policyFormDialog.getStepForm();

    // Check form values
    expect(await stepForm.getStepFormValue()).toEqual({
      description: 'Test Policy description',
    });
    // Check policy configuration
    const testPolicyConfigurationInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="test"]' }));
    expect(await testPolicyConfigurationInput.getValue()).toEqual('test');

    // Edit form values
    await stepForm.setStepForm({
      description: 'Edited description',
    });
    await testPolicyConfigurationInput.setValue('edited');

    // Save
    await policyFormDialog.save();

    // Check dialog result
    expect(component.dialogResult).toEqual(
      fakeTestPolicyStep({
        description: 'Edited description',
        configuration: {
          test: 'edited',
        },
      }),
    );
  });

  it('should display policy documentation', async () => {
    createTestingComponent(fakeTestPolicy(), fakeTestPolicyStep());

    await componentTestingOpenDialog();
    const policyFormDialog = await loader.getHarness(GioPolicyStudioStepEditDialogHarness);
    expect(await policyFormDialog.getPolicyName()).toEqual('Policy to test UI');

    const stepForm = await policyFormDialog.getStepForm();

    expect(await stepForm.getDocumentation()).toContain('= Test Policy documentation');
  });

  async function componentTestingOpenDialog() {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();
  }
});
