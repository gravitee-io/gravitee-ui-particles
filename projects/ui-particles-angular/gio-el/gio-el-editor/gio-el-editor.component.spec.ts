/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

import { GioElEditorHarness } from './gio-el-editor.harness';
import { GioElEditorComponent } from './gio-el-editor.component';

describe('GioElEditorComponent', () => {
  let component: GioElEditorComponent;
  let fixture: ComponentFixture<GioElEditorComponent>;
  let editorComponentHarness: GioElEditorHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatIconTestingModule, GioElEditorComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(GioElEditorComponent);
    component = fixture.componentInstance;

    component.conditionsModel = [
      {
        field: 'application',
        label: 'Application',
        type: 'string',
        values: ['a'],
      },
      {
        field: 'isAuthenticated',
        label: 'Is Authenticated',
        type: 'boolean',
      },
      {
        field: 'duration',
        label: 'Duration',
        type: 'number',
        max: 10,
      },
      {
        field: 'timestamp',
        label: 'Timestamp',
        type: 'date',
      },
    ];
    fixture.detectChanges();

    editorComponentHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GioElEditorHarness);
  });

  it('should create empty editor', async () => {
    expect(component).toBeTruthy();
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [],
    });
  });

  it('should add new string condition', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'Application');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual(['Equals', 'Not equals']);

    await mainConditionGroup.selectConditionOperator(0, 'Equals');
    await mainConditionGroup.setConditionValue(0, 'Yolo');

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: 'Application',
          operator: 'Equals',
          value: 'Yolo',
        },
      ],
    });
  });

  it('should add new boolean condition', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'Is Authenticated');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual(['Equals', 'Not equals']);

    await mainConditionGroup.selectConditionOperator(0, 'Not equals');

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: 'Is Authenticated',
          operator: 'Not equals',
          value: true,
        },
      ],
    });
  });

  it('should add new number condition', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'Duration');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual([
      'Equals',
      'Not equals',
      'Less than',
      'Less than or equals',
      'Greater than',
      'Greater than or equals',
    ]);

    await mainConditionGroup.selectConditionOperator(0, 'Less than');
    await mainConditionGroup.setConditionValue(0, 5);

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: 'Duration',
          operator: 'Less than',
          value: 5,
        },
      ],
    });
  });

  it('should add new date condition', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'Timestamp');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual([
      'Equals',
      'Not equals',
      'Less than',
      'Less than or equals',
      'Greater than',
      'Greater than or equals',
    ]);

    await mainConditionGroup.selectConditionOperator(0, 'Greater than');
    await mainConditionGroup.setConditionValue(0, new Date('2021-01-01'));

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: 'Timestamp',
          operator: 'Greater than',
          value: '2021-01-01T00:00:00.000Z',
        },
      ],
    });
  });

  it('should add new group', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewGroupButton();

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          condition: 'AND',
          conditions: [],
        },
      ],
    });
  });

  it('should add new group with OR condition', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();
    await mainConditionGroup.selectConditionField(0, 'Application');
    await mainConditionGroup.selectConditionOperator(0, 'Equals');
    await mainConditionGroup.setConditionValue(0, 'Yolo');

    await mainConditionGroup.clickAddNewConditionButton();
    await mainConditionGroup.selectConditionField(1, 'Application');
    await mainConditionGroup.selectConditionOperator(1, 'Equals');
    await mainConditionGroup.setConditionValue(1, 'Toto');

    await mainConditionGroup.selectConditionValue('OR');

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'OR',
      conditions: [
        {
          field: 'Application',
          operator: 'Equals',
          value: 'Yolo',
        },
        {
          field: 'Application',
          operator: 'Equals',
          value: 'Toto',
        },
      ],
    });
  });

  it('should add new group with conditions', async () => {
    const mainConditionGroup = await editorComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();
    await mainConditionGroup.selectConditionField(0, 'Application');
    await mainConditionGroup.selectConditionOperator(0, 'Equals');
    await mainConditionGroup.setConditionValue(0, 'Yolo');

    await mainConditionGroup.clickAddNewGroupButton();
    const lvl2ConditionGroup = await mainConditionGroup.getConditionGroup(1);
    await lvl2ConditionGroup.clickAddNewConditionButton();
    await lvl2ConditionGroup.selectConditionField(0, 'Duration');
    await lvl2ConditionGroup.selectConditionOperator(0, 'Equals');
    await lvl2ConditionGroup.setConditionValue(0, 42);

    await lvl2ConditionGroup.clickAddNewConditionButton();
    await lvl2ConditionGroup.selectConditionValue('OR');
    await lvl2ConditionGroup.selectConditionField(1, 'Duration');
    await lvl2ConditionGroup.selectConditionOperator(1, 'Equals');
    await lvl2ConditionGroup.setConditionValue(1, 43);

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: 'Application',
          operator: 'Equals',
          value: 'Yolo',
        },
        {
          condition: 'OR',
          conditions: [
            {
              field: 'Duration',
              operator: 'Equals',
              value: 42,
            },
            {
              field: 'Duration',
              operator: 'Equals',
              value: 43,
            },
          ],
        },
      ],
    });
  });
});
