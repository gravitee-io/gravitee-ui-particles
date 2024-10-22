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
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, importProvidersFrom } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { GioMonacoEditorHarness, GioMonacoEditorModule } from '@gravitee/ui-particles-angular';

import { GioElConditionBuilderDialogHarness } from '../gio-el-condition-builder-dialog/gio-el-condition-builder-dialog.harness';
import { GioElEditorHelperInputDirective } from '../gio-el-editor-helper/gio-el-editor-helper-input.directive';
import { GioElEditorHelperToggleComponent } from '../gio-el-editor-helper/gio-el-editor-helper-toggle.component';
import { GioElEditorHelperToggleHarness } from '../gio-el-editor-helper/gio-el-editor-helper-toggle.harness';

import { GioElEditorInputComponent } from './gio-el-editor-input.component';

@Component({
  selector: 'gio-story-component',
  template: `
    <mat-form-field>
      <mat-label>El condition</mat-label>
      <gio-el-editor-input [gioElEditorHelper]="elEditor" [formControl]="formControl" />
      <gio-el-editor-helper-toggle matIconSuffix #elEditor></gio-el-editor-helper-toggle>
      <mat-hint>Accept EL</mat-hint>
    </mat-form-field>
  `,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    GioElEditorHelperInputDirective,
    GioElEditorInputComponent,
    GioElEditorHelperToggleComponent,
  ],
  standalone: true,
})
class TestHelperComponent {
  public formControl = new FormControl('Initial value');
  public disable = false;
}

describe('GioElEditorInputComponent', () => {
  let fixture: ComponentFixture<TestHelperComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatIconTestingModule],
      providers: [importProvidersFrom(GioMonacoEditorModule)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHelperComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should edit input value', async () => {
    const monacoEditorHarness = await loader.getHarness(GioMonacoEditorHarness);
    expect(await monacoEditorHarness.getValue()).toEqual('Initial value');
    expect(fixture.componentInstance.formControl.touched).toBe(false);
    expect(fixture.componentInstance.formControl.dirty).toBe(false);

    await monacoEditorHarness.setValue('What the 🐙 say ?');
    expect(fixture.componentInstance.formControl.value).toEqual('What the 🐙 say ?');
    expect(fixture.componentInstance.formControl.touched).toBe(true);
    expect(fixture.componentInstance.formControl.dirty).toBe(true);
  });

  it('should disable el editor toggle if form control is disabled', async () => {
    const elEditorHelperToggle = await loader.getHarness(GioElEditorHelperToggleHarness);
    fixture.componentInstance.formControl.disable();
    expect(await elEditorHelperToggle.isDisabled()).toBe(true);

    fixture.componentInstance.formControl.enable();
    expect(await elEditorHelperToggle.isDisabled()).toBe(false);
  });

  it('should update form control value when el condition builder dialog is saved', async () => {
    const elEditorHelperToggle = await loader.getHarness(GioElEditorHelperToggleHarness);
    await elEditorHelperToggle.open();

    const dialog = await loader.getHarness(GioElConditionBuilderDialogHarness);
    const elEditor = await dialog.getElConditionBuilderHarness().then(elEditor => elEditor.getMainConditionGroup());
    await elEditor.clickAddNewConditionButton();
    await elEditor.selectConditionField(0, 'Id');
    await elEditor.selectConditionOperator(0, 'Equals');
    await elEditor.setConditionValue(0, 'What the 🦊 say ?');
    await dialog.confirm();

    expect(fixture.componentInstance.formControl.value).toEqual('{ #api.id == "What the 🦊 say ?" }');
  });
});
