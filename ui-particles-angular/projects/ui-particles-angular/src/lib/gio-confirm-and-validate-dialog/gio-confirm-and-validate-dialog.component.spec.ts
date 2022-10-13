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
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';

import { GioConfirmAndValidateDialogComponent, GioConfirmAndValidateDialogData } from './gio-confirm-and-validate-dialog.component';
import { GioConfirmAndValidateDialogModule } from './gio-confirm-and-validate-dialog.module';
import { GioConfirmAndValidateDialogHarness } from './gio-confirm-and-validate-dialog.harness';

@Component({
  selector: 'gio-confirm-and-validate-dialog-test',
  template: `<button mat-button id="open-confirm-dialog" (click)="openConfirmDialog()">Open confirm dialog</button>`,
})
class TestComponent {
  public confirmed?: boolean;
  constructor(private readonly matDialog: MatDialog) {}

  public openConfirmDialog() {
    this.matDialog
      .open<GioConfirmAndValidateDialogComponent, GioConfirmAndValidateDialogData, boolean>(GioConfirmAndValidateDialogComponent, {
        data: {},
        role: 'alertdialog',
        id: 'confirmDialog',
      })
      .afterClosed()
      .subscribe(confirmed => (this.confirmed = confirmed));
  }
}

describe('GioConfirmDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioConfirmAndValidateDialogModule, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should return true with the user confirms', async () => {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();

    const confirmDialogHarness = await loader.getHarness(GioConfirmAndValidateDialogHarness);
    await confirmDialogHarness.confirm();

    expect(component.confirmed).toBe(true);
  });

  it('should return false with the user cancels', async () => {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();

    const confirmDialogHarness = await loader.getHarness(GioConfirmAndValidateDialogHarness);
    await confirmDialogHarness.cancel();

    expect(component.confirmed).toBe(false);
  });
});
