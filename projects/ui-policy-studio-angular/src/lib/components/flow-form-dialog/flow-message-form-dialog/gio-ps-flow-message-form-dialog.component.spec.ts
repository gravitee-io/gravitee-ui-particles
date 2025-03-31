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

import {
  fakeChannelFlow,
  fakeHTTPGetMessageEntrypoint,
  fakeSSEMessageEntrypoint,
  fakeWebhookMessageEntrypoint,
} from '../../../models/index-testing';
import { FlowVM } from '../../../policy-studio/gio-policy-studio.model';
import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';

import {
  GioPolicyStudioFlowMessageFormDialogComponent,
  GioPolicyStudioFlowMessageFormDialogData,
} from './gio-ps-flow-message-form-dialog.component';
import { GioPolicyStudioFlowMessageFormDialogHarness } from './gio-ps-flow-message-form-dialog.harness';

@Component({
  selector: 'gio-dialog-test',
  template: `<button mat-button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
  standalone: false,
})
class TestComponent {
  public flow?: FlowVM;
  public flowToEdit?: FlowVM;
  public entrypoints = [
    fakeSSEMessageEntrypoint({
      name: 'entrypoint1',
      type: 'entrypoint1',
    }),
    fakeHTTPGetMessageEntrypoint({
      name: 'entrypoint2',
      type: 'entrypoint2',
    }),
  ];
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowMessageFormDialogComponent, GioPolicyStudioFlowMessageFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowMessageFormDialogComponent,
        {
          data: {
            entrypoints: this.entrypoints,
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
        }
      });
  }
}

describe('GioPolicyStudioFlowMessageFormDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioPolicyStudioFlowMessageFormDialogComponent, MatDialogModule, NoopAnimationsModule, MatIconTestingModule],
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

  it('should show initial flow values', async () => {
    component.entrypoints = [fakeWebhookMessageEntrypoint(), fakeHTTPGetMessageEntrypoint()];
    const flow = fakeChannelFlow({
      name: 'Flow',
      selectors: [
        {
          type: 'CHANNEL',
          operations: ['PUBLISH'],
          channelOperator: 'EQUALS',
          channel: 'channel',
          entrypoints: ['webhook'],
        },
        { type: 'CONDITION', condition: 'condition' },
      ],
    });
    const flowVM: FlowVM = {
      _id: 'test-id',
      _hasChanged: false,
      ...flow,
    };
    component.flowToEdit = flowVM;
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    expect(await flowFormDialogHarness.getFormValues()).toEqual({
      channel: 'channel',
      channelOperator: 'Equals',
      condition: 'condition',
      entrypoints: ['Webhook'],
      name: 'Flow',
      operations: ['Publish'],
    });
  });

  it('should return false on cancel', async () => {
    component.flow = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeChannelFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      condition: 'Test condition',
    });
    await flowFormDialogHarness.cancel();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: false,
      ...fakeChannelFlow(),
    });
  });

  it('should create flow', async () => {
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      channelOperator: 'EQUALS',
      channel: 'test-channel',
      operations: ['SUBSCRIBE'],
      entrypoints: ['entrypoint1', 'entrypoint2'],
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: expect.any(String),
      _hasChanged: true,
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'CHANNEL',
          channelOperator: 'EQUALS',
          channel: 'test-channel',
          operations: ['SUBSCRIBE'],
          entrypoints: ['entrypoint1', 'entrypoint2'],
        },
      ],
    });
  });

  it('should create flow with condition', async () => {
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      channelOperator: 'EQUALS',
      channel: 'test-channel',
      operations: ['SUBSCRIBE'],
      entrypoints: ['entrypoint1', 'entrypoint2'],
      condition: 'Test condition',
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: expect.any(String),
      _hasChanged: true,
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'CHANNEL',
          channelOperator: 'EQUALS',
          channel: 'test-channel',
          operations: ['SUBSCRIBE'],
          entrypoints: ['entrypoint1', 'entrypoint2'],
        },
        {
          type: 'CONDITION',
          condition: 'Test condition',
        },
      ],
    });
  });

  it('should edit flow without any changes', async () => {
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeChannelFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: true,
      ...fakeChannelFlow(),
    });
  });

  it('should edit flow with full changes', async () => {
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeChannelFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowMessageFormDialogHarness);

    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      channelOperator: 'EQUALS',
      channel: 'test-channel',
      operations: ['SUBSCRIBE'],
      entrypoints: ['entrypoint1', 'entrypoint2'],
      condition: 'Test condition',
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: true,
      ...fakeChannelFlow(),
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'CHANNEL',
          channelOperator: 'EQUALS',
          channel: 'test-channel',
          operations: ['SUBSCRIBE'],
          entrypoints: ['entrypoint1', 'entrypoint2'],
        },
        {
          type: 'CONDITION',
          condition: 'Test condition',
        },
      ],
    });
  });

  async function componentTestingOpenDialog() {
    const openDialogButton = await loader.getHarness(MatButtonHarness);
    await openDialogButton.click();
    fixture.detectChanges();
  }
});
