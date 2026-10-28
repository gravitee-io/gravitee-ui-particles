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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { GioPrismJsService } from '@gravitee/ui-particles-angular';
import { GioAsciidoctorTestingModule } from '@gravitee/ui-particles-angular/gio-asciidoctor';
import { of } from 'rxjs';

import { fakeAllPolicies } from '../../models/index-testing';
import { FlowPhase, fromPolicyInput, Step, toGenericPolicies } from '../../models';
import { GioPolicyStudioService } from '../../policy-studio/gio-policy-studio.service';

import { GioPolicyStudioStepFormComponent } from './gio-ps-step-form.component';

describe('GioPolicyStudioStepFormComponent', () => {
  let fixture: ComponentFixture<GioPolicyStudioStepFormComponent>;

  const createComponent = async (flowPhase: FlowPhase, schema: unknown, step?: Step) => {
    await TestBed.configureTestingModule({
      imports: [
        GioPolicyStudioStepFormComponent,
        GioAsciidoctorTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatIconTestingModule,
      ],
      providers: [
        {
          provide: GioPolicyStudioService,
          useFactory: () => {
            const service = new GioPolicyStudioService();
            service.setPolicySchemaFetcher(() => of(schema as never));
            service.setPolicyDocumentationFetcher(() => of({ content: 'doc', language: 'ASCIIDOC' }));
            return service;
          },
        },
        { provide: GioPrismJsService, useValue: { loadPrismJs: () => of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GioPolicyStudioStepFormComponent);
    fixture.componentRef.setInput('flowPhase', flowPhase);
    fixture.componentRef.setInput('apiType', 'NATIVE');
    fixture.componentRef.setInput('genericPolicy', toGenericPolicies(fakeAllPolicies().map(fromPolicyInput), [])[0]);
    if (step) {
      fixture.componentRef.setInput('step', step);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return TestbedHarnessEnvironment.loader(fixture);
  };

  const messageConditionInputs = async (loader: Awaited<ReturnType<typeof createComponent>>) =>
    loader.getAllHarnesses(MatInputHarness.with({ selector: '[formControlName="messageCondition"]' }));

  const schemaWith = (gioConfig?: unknown) => ({
    type: 'object',
    properties: { test: { type: 'string', title: 'Test' } },
    ...(gioConfig ? { gioConfig } : {}),
  });

  it('should show the message condition on a publish step when the policy schema does not forbid it', async () => {
    const loader = await createComponent('PUBLISH', schemaWith());

    expect(await messageConditionInputs(loader)).toHaveLength(1);
  });

  it('should hide the message condition when the policy schema declares gioConfig.messageCondition = false', async () => {
    const loader = await createComponent('PUBLISH', schemaWith({ messageCondition: false }));

    expect(await messageConditionInputs(loader)).toHaveLength(0);
  });

  it('should hide the message condition on a non message phase', async () => {
    const loader = await createComponent('REQUEST', schemaWith());

    expect(await messageConditionInputs(loader)).toHaveLength(0);
  });

  it('should keep an existing message condition when the field is hidden', async () => {
    await createComponent('SUBSCRIBE', schemaWith({ messageCondition: false }), {
      policy: 'test-policy',
      messageCondition: '{#message.topic == "a"}',
    } as Step);
    const emitted: Step[] = [];
    fixture.componentInstance.stepChange.subscribe(step => emitted.push(step));

    fixture.componentInstance.emitStepChange();

    expect(emitted[0].messageCondition).toEqual('{#message.topic == "a"}');
  });
});
