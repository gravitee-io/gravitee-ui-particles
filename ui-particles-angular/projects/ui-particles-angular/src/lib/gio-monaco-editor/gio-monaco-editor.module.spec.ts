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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GioMonacoEditorHarness, ConfigureTestingGioMonacoEditor } from './gio-monaco-editor.harness';
import { GioMonacoEditorModule } from './gio-monaco-editor.module';

@Component({
  template: `<gio-monaco-editor [formControl]="control" [languageConfig]="languageConfig"></gio-monaco-editor> `,
})
class TestComponent {
  public languageConfig = false;

  public control = new FormControl('InitialValue');
}

describe('GioMonacoEditorModule', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, GioMonacoEditorModule, ReactiveFormsModule],
    });
    ConfigureTestingGioMonacoEditor();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should setValue and return value with formControl', async () => {
    fixture.detectChanges();
    const gioMonacoEditorHarness = await loader.getHarness(GioMonacoEditorHarness);

    expect(await gioMonacoEditorHarness.getValue()).toEqual('InitialValue');

    await gioMonacoEditorHarness.setValue('TheCode');

    expect(component.control.value).toEqual('TheCode');
    expect(await gioMonacoEditorHarness.getValue()).toEqual('TheCode');
  });

  it('should disable / enable', async () => {
    component.control.disable();
    fixture.detectChanges();
    const gioMonacoEditorHarness = await loader.getHarness(GioMonacoEditorHarness);
    expect(await gioMonacoEditorHarness.isDisabled()).toBe(true);

    component.control.enable();

    expect(await gioMonacoEditorHarness.isDisabled()).toBe(false);
  });
});
