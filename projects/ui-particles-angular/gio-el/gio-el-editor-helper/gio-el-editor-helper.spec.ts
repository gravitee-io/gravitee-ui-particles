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
import { Component } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { GioElEditorDialogHarness } from '../gio-el-editor-dialog/gio-el-editor-dialog.harness';

import { GioElEditorHelperToggleComponent } from './gio-el-editor-helper-toggle.component';
import { GioElEditorHelperInputDirective } from './gio-el-editor-helper-input.directive';
import { GioElEditorHelperToggleHarness } from './gio-el-editor-helper-toggle.harness';

@Component({
  selector: 'gio-story-component',
  template: `
    <mat-form-field>
      <mat-label>Choose a date</mat-label>
      <input matInput [gioElEditorHelper]="elEditor" [formControl]="formControl" />
      <mat-hint>Accept EL</mat-hint>
      <gio-el-editor-helper-toggle matIconSuffix #elEditor></gio-el-editor-helper-toggle>
    </mat-form-field>
  `,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    GioElEditorHelperInputDirective,
    GioElEditorHelperToggleComponent,
    MatButtonModule,
  ],
  standalone: true,
})
class TestHelperComponent {
  public formControl = new FormControl();
  public disable = false;
}

describe('GioElEditorDialogComponent', () => {
  let fixture: ComponentFixture<TestHelperComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatIconTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHelperComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should open el editor dialog', async () => {
    const elEditorHelperToggle = await loader.getHarness(GioElEditorHelperToggleHarness);
    await elEditorHelperToggle.open();

    const dialog = await loader.getHarnessOrNull(GioElEditorDialogHarness);
    expect(dialog).toBeTruthy();
  });

  it('should disable el editor toggle if form control is disabled', async () => {
    const elEditorHelperToggle = await loader.getHarness(GioElEditorHelperToggleHarness);
    fixture.componentInstance.formControl.disable();
    expect(await elEditorHelperToggle.isDisabled()).toBe(true);

    fixture.componentInstance.formControl.enable();
    expect(await elEditorHelperToggle.isDisabled()).toBe(false);
  });

  it('should update form control value when el editor dialog is saved', async () => {
    const elEditorHelperToggle = await loader.getHarness(GioElEditorHelperToggleHarness);
    await elEditorHelperToggle.open();

    const dialog = await loader.getHarness(GioElEditorDialogHarness);
    await dialog.confirmMyAction();

    expect(fixture.componentInstance.formControl.value).toEqual('What the 🦊 say ?');
  });
});
