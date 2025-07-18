/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { GioMonacoEditorModule } from '@gravitee/ui-particles-angular';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { GioMcpToolsEditorHarness } from './gio-mcp-tools-editor.harness';
import { GioMcpToolsEditorComponent } from './gio-mcp-tools-editor.component';

@Component({
  selector: 'gio-test-host-component',
  template: `
    <form [formGroup]="form">
      <gio-mcp-tools-editor formControlName="tools" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, GioMcpToolsEditorComponent, GioMonacoEditorModule],
})
class TestHostComponent {
  public form: FormGroup<{ tools: FormControl<string> }> = new FormGroup<{ tools: FormControl<string> }>({
    tools: new FormControl<string>('initial', { nonNullable: true }),
  });
}

describe('GioMcpToolsEditorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let harnessLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should initialize and uppercase the initial value in the parent form', done => {
    setTimeout(() => {
      expect(hostComponent.form.value.tools).toBe('INITIAL');
      done();
    }, 0);
  });

  it('should transform user updates to uppercase in the parent form', async () => {
    const harness = await harnessLoader.getHarness(GioMcpToolsEditorHarness);
    await harness.setValue('new_value');
    fixture.detectChanges();

    expect(hostComponent.form.value.tools).toBe('NEW_VALUE');
  });
});
