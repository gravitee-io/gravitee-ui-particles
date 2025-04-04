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
import { InteractivityChecker } from '@angular/cdk/a11y';

import { GioConfirmDialogComponent, GioConfirmDialogData } from './gio-confirm-dialog.component';
import { GioConfirmDialogModule } from './gio-confirm-dialog.module';
import { GioConfirmDialogHarness } from './gio-confirm-dialog.harness';

@Component({
  selector: 'gio-confirm-dialog-test',
  template: `<button mat-button id="open-confirm-dialog" (click)="openConfirmDialog()">Open confirm dialog</button>`,
  standalone: false,
})
class TestComponent {
  public confirmed?: boolean;
  constructor(private readonly matDialog: MatDialog) {}

  public openConfirmDialog() {
    this.matDialog
      .open<GioConfirmDialogComponent, GioConfirmDialogData, boolean>(GioConfirmDialogComponent, {
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
      imports: [GioConfirmDialogModule, NoopAnimationsModule],
    }).overrideProvider(InteractivityChecker, {
      useValue: {
        isFocusable: () => true, // This traps focus checks and so avoid warnings when dealing with
      },
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should return true with the user confirms', async () => {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();

    const confirmDialogHarness = await loader.getHarness(GioConfirmDialogHarness);
    await confirmDialogHarness.confirm();

    expect(component.confirmed).toBe(true);
  });

  it('should return false with the user cancels', async () => {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();

    const confirmDialogHarness = await loader.getHarness(GioConfirmDialogHarness);
    await confirmDialogHarness.cancel();

    expect(component.confirmed).toBe(false);
  });
});
