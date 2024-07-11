/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { of } from 'rxjs';
import { SimpleChange } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputHarness } from '@angular/material/input/testing';

import { fakePolicySchema } from '../models/policy/PolicySchema.fixture';
import { fakeAllPolicies, fakeTestPolicy } from '../models/policy/Policy.fixture';

import { GioEnvironmentFlowStudioHarness } from './gio-environment-flow-studio.harness';
import { EnvironmentFlowOutput, GioEnvironmentFlowStudioComponent } from './gio-environment-flow-studio.component';

describe('GioEnvironmentFlowStudioComponent', () => {
  let component: GioEnvironmentFlowStudioComponent;
  let fixture: ComponentFixture<GioEnvironmentFlowStudioComponent>;
  let environmentFlowStudioHarness: GioEnvironmentFlowStudioHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GioEnvironmentFlowStudioComponent, NoopAnimationsModule, HttpClientTestingModule, MatIconTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GioEnvironmentFlowStudioComponent);
    component = fixture.componentInstance;
    environmentFlowStudioHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GioEnvironmentFlowStudioHarness);

    component.policies = fakeAllPolicies();
    component.policySchemaFetcher = policy => of(fakePolicySchema(policy.id));
    component.policyDocumentationFetcher = policy => of(`${policy.id} documentation`);
    component.ngOnChanges({
      policies: new SimpleChange(null, null, true),
      policySchemaFetcher: new SimpleChange(null, null, true),
      policyDocumentationFetcher: new SimpleChange(null, null, true),
    });
  });

  it('should display empty flow phase', async () => {
    const flowPhase = await environmentFlowStudioHarness.getFlowPhase('REQUEST');

    expect(flowPhase).toBeDefined();
    const steps = await flowPhase!.getSteps();

    expect(steps).toEqual([
      {
        name: 'Incoming request',
        type: 'connector',
      },
      {
        name: 'Outgoing request',
        type: 'connector',
      },
    ]);
  });

  it('should add flow to phase', async () => {
    const flowPhase = await environmentFlowStudioHarness.getFlowPhase('REQUEST');

    let expectedEnvironmentFlowOutput: EnvironmentFlowOutput | undefined = undefined;

    component.environmentFlowChange.subscribe(environmentFlow => (expectedEnvironmentFlowOutput = environmentFlow));

    await environmentFlowStudioHarness?.addStep(0, {
      policyName: fakeTestPolicy().name,
      description: 'What does the 🦊 say?',
      async waitForPolicyFormCompletionCb(locator) {
        // "Policy to test UI" have required configuration fields. We need to fill them to be able to add the step.
        const testPolicyConfigurationInput = await locator.locatorFor(MatInputHarness.with({ selector: '[id*="test"]' }))();
        await testPolicyConfigurationInput.setValue('🦊');
      },
    });

    expect(await flowPhase?.getSteps()).toEqual([
      {
        name: 'Incoming request',
        type: 'connector',
      },
      {
        type: 'step',
        name: fakeTestPolicy().name,
        hasCondition: false,
        description: 'What does the 🦊 say?',
      },
      {
        name: 'Outgoing request',
        type: 'connector',
      },
    ]);
    expect(expectedEnvironmentFlowOutput).toEqual([
      {
        configuration: {
          test: '🦊',
        },
        description: 'What does the 🦊 say?',
        enabled: true,
        name: 'Policy to test UI',
        policy: 'test-policy',
      },
    ]);
  });
});
