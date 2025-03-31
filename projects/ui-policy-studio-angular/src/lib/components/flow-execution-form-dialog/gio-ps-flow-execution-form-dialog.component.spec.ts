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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { FlowExecution } from '../../models';
import { fakeBestMatchFlowExecution, fakeDefaultFlowExecution } from '../../models/flow/FlowExecution.fixture';
import { GioPolicyStudioComponent } from '../../policy-studio/gio-policy-studio.component';

import {
  GioPolicyStudioFlowExecutionFormDialogComponent,
  GioPolicyStudioFlowExecutionFormDialogData,
} from './gio-ps-flow-execution-form-dialog.component';
import { GioPolicyStudioFlowExecutionFormDialogHarness } from './gio-ps-flow-execution-form-dialog.harness';

@Component({
  selector: 'gio-dialog-test',
  template: `<button mat-button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
  standalone: false,
})
class TestComponent {
  public flowExecution?: FlowExecution;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowExecutionFormDialogComponent, GioPolicyStudioFlowExecutionFormDialogData, FlowExecution | undefined>(
        GioPolicyStudioFlowExecutionFormDialogComponent,
        {
          data: {
            flowExecution: this.flowExecution,
          },
          role: 'alertdialog',
          id: 'testDialog',
        },
      )
      .afterClosed()
      .subscribe(flowExecution => {
        if (flowExecution) {
          this.flowExecution = flowExecution;
        }
      });
  }
}

describe('GioPolicyStudioFlowExecutionFormDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioPolicyStudioComponent, MatDialogModule, NoopAnimationsModule, MatIconTestingModule],
    }).overrideProvider(InteractivityChecker, {
      useValue: {
        isFocusable: () => true, // This traps focus checks and so avoid warnings when dealing with
        isTabbable: () => true, // hidden elements
      },
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should not change flow execution configuration with cancel', async () => {
    component.flowExecution = fakeBestMatchFlowExecution();
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowExecutionFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      mode: 'DEFAULT',
      matchRequired: true,
    });
    await flowFormDialogHarness.cancel();

    expect(component.flowExecution).toEqual(fakeBestMatchFlowExecution());
  });

  it('should edit flow execution without any changes', async () => {
    component.flowExecution = fakeBestMatchFlowExecution();
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowExecutionFormDialogHarness);
    await flowFormDialogHarness.save();

    expect(component.flowExecution).toEqual(fakeBestMatchFlowExecution());
  });

  describe('should edit flow with full changes', () => {
    it('From Best match to Default mode', async () => {
      component.flowExecution = fakeBestMatchFlowExecution();
      await componentTestingOpenDialog();

      const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowExecutionFormDialogHarness);

      await flowFormDialogHarness.setFlowFormValues({
        mode: 'DEFAULT',
        matchRequired: true,
      });
      await flowFormDialogHarness.save();

      expect(component.flowExecution).toEqual({
        mode: 'DEFAULT',
        matchRequired: true,
      });
    });

    it('From Default to Best match mode', async () => {
      component.flowExecution = fakeDefaultFlowExecution();
      await componentTestingOpenDialog();

      const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowExecutionFormDialogHarness);

      await flowFormDialogHarness.setFlowFormValues({
        mode: 'BEST_MATCH',
        matchRequired: true,
      });
      await flowFormDialogHarness.save();

      expect(component.flowExecution).toEqual({
        mode: 'BEST_MATCH',
        matchRequired: true,
      });
    });
  });

  it('should uncheck toggle', async () => {
    component.flowExecution = fakeBestMatchFlowExecution({ matchRequired: true });
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowExecutionFormDialogHarness);

    await flowFormDialogHarness.setFlowFormValues({
      matchRequired: false,
    });
    await flowFormDialogHarness.save();

    expect(component.flowExecution).toEqual({
      mode: 'BEST_MATCH',
      matchRequired: false,
    });
  });

  async function componentTestingOpenDialog() {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();
  }
});
