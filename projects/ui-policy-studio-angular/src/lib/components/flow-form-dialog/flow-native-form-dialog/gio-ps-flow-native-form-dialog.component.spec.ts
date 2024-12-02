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
import { ChangeDetectorRef, Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { fakeNativeFlow } from '../../../models/index-testing';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';
import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { Flow } from '../../../models';

import {
  GioPolicyStudioFlowNativeFormDialogComponent,
  GioPolicyStudioFlowNativeFormDialogData,
} from './gio-ps-flow-native-form-dialog.component';
import { GioPolicyStudioFlowNativeHarnessData, GioPolicyStudioFlowNativeFormDialogHarness } from './gio-ps-flow-native-form-dialog.harness';

@Component({
  selector: 'gio-dialog-test',
  template: `<button mat-button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class TestComponent {
  public flow?: FlowVM;
  public flowToEdit?: FlowVM;
  constructor(
    private readonly matDialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowNativeFormDialogComponent, GioPolicyStudioFlowNativeFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowNativeFormDialogComponent,
        {
          data: {
            flow: this.flowToEdit,
          },
          role: 'alertdialog',
          id: 'testDialog',
        },
      )
      .afterClosed()
      .subscribe(flow => {
        if (flow) {
          this.flow = flow;
          this.changeDetectorRef.markForCheck();
        }
      });
  }
}

describe('GioPolicyStudioFlowNativeFormDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioPolicyStudioFlowNativeFormDialogComponent, MatDialogModule, NoopAnimationsModule, MatIconTestingModule],
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

  it('should display value from initial flow', async () => {
    const flow = fakeNativeFlow({
      name: 'FlO1',
    });
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...flow,
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowNativeFormDialogHarness);
    expect(toFlow(await flowFormDialogHarness.getFlowFormValues())).toEqual(flow);
  });

  it('should return false on cancel', async () => {
    component.flow = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeNativeFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowNativeFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
    });
    await flowFormDialogHarness.cancel();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: false,
      ...fakeNativeFlow(),
    });
  });

  it('should create flow', async () => {
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowNativeFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: expect.any(String),
      _hasChanged: true,
      name: 'Test name',
      enabled: true,
    });
  });
  it('should edit flow without any changes', async () => {
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeNativeFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowNativeFormDialogHarness);
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: true,
      ...fakeNativeFlow(),
    });
  });

  it('should edit flow with full changes', async () => {
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeNativeFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowNativeFormDialogHarness);

    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: true,
      ...fakeNativeFlow(),
      name: 'Test name',
      enabled: true,
    });
  });

  async function componentTestingOpenDialog() {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();
  }
});

const toFlow: (formValue: GioPolicyStudioFlowNativeHarnessData) => Flow = (formValue: GioPolicyStudioFlowNativeHarnessData) => {
  return {
    name: formValue.name,
    enabled: true,
    interact: [],
    publish: [],
    subscribe: [],
  };
};
