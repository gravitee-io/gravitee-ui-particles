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

import { GioPolicyStudioModule } from '../../../gio-policy-studio.module';
import { fakeChannelFlow, fakeHttpFlow } from '../../../models/index-testing';
import { FlowVM } from '../../../gio-policy-studio.model';
import { GioPolicyStudioFlowFormDialogResult } from '../gio-ps-flow-form-dialog-result.model';
import { Flow, HttpMethod, Operator, toHttpMethod } from '../../../models';

import {
  GioPolicyStudioFlowProxyFormDialogComponent,
  GioPolicyStudioFlowProxyFormDialogData,
  sanitizePath,
} from './gio-ps-flow-proxy-form-dialog.component';
import { GioPolicyStudioFlowProxyHarnessData, GioPolicyStudioFlowProxyFormDialogHarness } from './gio-ps-flow-proxy-form-dialog.harness';

@Component({
  selector: 'gio-dialog-test',
  template: `<button mat-button id="open-dialog" (click)="openDialog()">Open dialog</button>`,
})
class TestComponent {
  public flow?: FlowVM;
  public flowToEdit?: FlowVM;
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioPolicyStudioFlowProxyFormDialogComponent, GioPolicyStudioFlowProxyFormDialogData, GioPolicyStudioFlowFormDialogResult>(
        GioPolicyStudioFlowProxyFormDialogComponent,
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
        }
      });
  }
}

describe('GioPolicyStudioFlowProxyFormDialogComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioPolicyStudioModule, MatDialogModule, NoopAnimationsModule, MatIconTestingModule],
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
    const flow = fakeHttpFlow({
      name: 'FlO1',
      selectors: [
        { type: 'HTTP', path: '/path', pathOperator: 'EQUALS', methods: [] },
        { type: 'CONDITION', condition: 'condition' },
      ],
    });
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...flow,
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
    expect(toFlow(await flowFormDialogHarness.getFlowFormValues())).toEqual(flow);
  });

  it('should return false on cancel', async () => {
    component.flow = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeChannelFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
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

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      pathOperator: 'EQUALS',
      path: 'test-path',
      methods: ['GET'],
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: expect.any(String),
      _hasChanged: true,
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'HTTP',
          pathOperator: 'EQUALS',
          path: '/test-path',
          methods: ['GET'],
        },
      ],
    });
  });

  it('should create flow with all methods', async () => {
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      pathOperator: 'EQUALS',
      path: 'test-path',
      methods: ['ALL'],
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: expect.any(String),
      _hasChanged: true,
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'HTTP',
          pathOperator: 'EQUALS',
          path: '/test-path',
          methods: [],
        },
      ],
    });
  });

  it('should not add invalid methods', async () => {
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      pathOperator: 'EQUALS',
      path: 'test-path',
      methods: ['POST', 'blabla'],
    });

    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: expect.any(String),
      _hasChanged: true,
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'HTTP',
          pathOperator: 'EQUALS',
          path: '/test-path',
          methods: ['POST'],
        },
      ],
    });
  });

  it('should create flow with condition', async () => {
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      pathOperator: 'EQUALS',
      path: 'test-path',
      methods: ['GET'],
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
          type: 'HTTP',
          pathOperator: 'EQUALS',
          path: '/test-path',
          methods: ['GET'],
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
      ...fakeHttpFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: true,
      ...fakeHttpFlow(),
    });
  });

  it('should edit flow with full changes', async () => {
    component.flowToEdit = {
      _id: 'test-id',
      _hasChanged: false,
      ...fakeHttpFlow(),
    };
    await componentTestingOpenDialog();

    const flowFormDialogHarness = await loader.getHarness(GioPolicyStudioFlowProxyFormDialogHarness);

    await flowFormDialogHarness.setFlowFormValues({
      name: 'Test name',
      pathOperator: 'EQUALS',
      path: 'test-path',
      methods: ['GET'],
      condition: 'Test condition',
    });
    await flowFormDialogHarness.save();

    expect(component.flow).toEqual({
      _id: 'test-id',
      _hasChanged: true,
      ...fakeHttpFlow(),
      name: 'Test name',
      enabled: true,
      selectors: [
        {
          type: 'HTTP',
          pathOperator: 'EQUALS',
          path: '/test-path',
          methods: ['GET'],
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

const toMethods: (methods: string[]) => HttpMethod[] = (methods: string[]) => {
  if (methods.includes('ALL')) {
    return [];
  }
  return methods.map(method => toHttpMethod(method)).filter(v => v !== undefined) as HttpMethod[];
};

const toPathOperator: (pathOperator: string) => Operator = (pathOperator: string) => {
  if (pathOperator === 'Equals') {
    return 'EQUALS';
  }
  return 'STARTS_WITH';
};

const toFlow: (formValue: GioPolicyStudioFlowProxyHarnessData) => Flow = (formValue: GioPolicyStudioFlowProxyHarnessData) => {
  return {
    name: formValue.name,
    enabled: true,
    publish: [],
    subscribe: [],
    request: [],
    response: [],
    selectors: [
      {
        type: 'HTTP',
        pathOperator: toPathOperator(formValue.pathOperator),
        path: sanitizePath(formValue.path),
        methods: toMethods(formValue.methods),
      },
      { type: 'CONDITION', condition: formValue.condition },
    ],
  };
};
