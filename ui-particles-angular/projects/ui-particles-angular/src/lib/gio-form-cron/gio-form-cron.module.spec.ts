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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GioFormCronHarness } from './gio-form-cron.harness';
import { GioFormCronModule } from './gio-form-cron.module';

describe('GioFormCronModule', () => {
  @Component({
    template: ` <gio-form-cron [formControl]="testControl"></gio-form-cron> `,
  })
  class TestComponent {
    public testControl = new FormControl(null, Validators.required);
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, GioFormCronModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should init component', async () => {
    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(formCronHarness).toBeTruthy();
    expect(component).toBeTruthy();

    // Default mode
    expect(await formCronHarness.getMode()).toBe('Secondly');
  });

  it('should select Monthly mode for "0 15 10 8 * *" cron', async () => {
    component.testControl.setValue('0 15 10 8 * *');

    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(await formCronHarness.getMode()).toBe('Month');
  });
});