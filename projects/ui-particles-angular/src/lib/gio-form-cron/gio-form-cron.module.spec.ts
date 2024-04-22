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
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GioFormCronHarness } from './gio-form-cron.harness';
import { GioFormCronModule } from './gio-form-cron.module';

describe('GioFormCronModule', () => {
  @Component({
    template: ` <gio-form-cron [formControl]="testControl"></gio-form-cron> `,
  })
  class TestComponent {
    public testControl = new UntypedFormControl(null);
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let testControlValueChanges: string[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, GioFormCronModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  beforeEach(() => {
    testControlValueChanges = [];
    component.testControl.valueChanges.subscribe(v => testControlValueChanges.push(v));
  });

  it('should init component', async () => {
    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(formCronHarness).toBeTruthy();
    expect(testControlValueChanges).toEqual([]);

    // Default mode
    expect(await formCronHarness.getMode()).toBe(null);
    expect(await formCronHarness.getValue()).toBe(null);
  });

  it('should select Monthly mode for "0 15 10 8 * *" cron', async () => {
    component.testControl.setValue('0 15 10 8 * *', { emitEvent: false });

    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(await formCronHarness.getMode()).toEqual('Monthly');
    expect(await formCronHarness.getValue()).toEqual('0 15 10 8 * *');
    expect(component.testControl.value).toEqual('0 15 10 8 * *');
    // Like native angular form not emit event on init
    expect(testControlValueChanges).toEqual([]);
  });

  it('should select Custom mode for "0 0 0 LW * *" cron', async () => {
    component.testControl.setValue('0 0 0 LW * *', { emitEvent: false });

    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(await formCronHarness.getMode()).toEqual('Custom');
    expect(await formCronHarness.getValue()).toEqual('0 0 0 LW * *');
    expect(component.testControl.value).toEqual('0 0 0 LW * *');
    // Like native angular form not emit event on init
    expect(testControlValueChanges).toEqual([]);
  });

  it('should clear value', async () => {
    component.testControl.setValue('0 15 10 8 * *');

    const formCronHarness = await loader.getHarness(GioFormCronHarness);
    await formCronHarness.clear();

    expect(await formCronHarness.getMode()).toEqual(null);
    expect(await formCronHarness.getValue()).toEqual(null);
    expect(component.testControl.value).toEqual(null);
    expect(testControlValueChanges).toEqual(['0 15 10 8 * *', null]);
    expect(component.testControl.errors).toEqual(null);
    expect(await formCronHarness.hasError()).toEqual(false);
  });

  it('should disabled', async () => {
    component.testControl.setValue('0 15 10 8 * *');
    component.testControl.disable();

    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(await formCronHarness.isDisabled()).toEqual(true);

    component.testControl.enable();
    expect(await formCronHarness.isDisabled()).toEqual(false);
  });

  it('should disabled with empty value', async () => {
    component.testControl.disable();

    const formCronHarness = await loader.getHarness(GioFormCronHarness);

    expect(await formCronHarness.isDisabled()).toEqual(true);

    component.testControl.enable();
    expect(await formCronHarness.isDisabled()).toEqual(false);
  });

  it('should in error with bad custom expression', async () => {
    component.testControl.setValue('0 15 10 8 * *');

    const formCronHarness = await loader.getHarness(GioFormCronHarness);
    expect(await formCronHarness.hasError()).toEqual(false);

    await formCronHarness.setCustomValue('BadExpression');
    expect(await formCronHarness.hasError()).toEqual(true);

    await formCronHarness.setCustomValue('0 15 10 8 * *');
    expect(await formCronHarness.hasError()).toEqual(false);
  });
});
