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

import { GioElConditionBuilderHarness } from './gio-el-condition-builder.harness';
import { GioElConditionBuilderComponent } from './gio-el-condition-builder.component';

describe('GioElConditionBuilderComponent', () => {
  let component: GioElConditionBuilderComponent;
  let fixture: ComponentFixture<GioElConditionBuilderComponent>;
  let conditionBuilderComponentHarness: GioElConditionBuilderHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatIconTestingModule, GioElConditionBuilderComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(GioElConditionBuilderComponent);
    component = fixture.componentInstance;

    component.elProperties = [
      {
        field: 'application',
        label: 'Application',
        type: 'string',
        values: [
          { value: 'aId', label: 'A' },
          { value: 'bId', label: 'B' },
          { value: 'cId', label: 'C' },
        ],
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
      {
        field: 'properties',
        label: 'Properties',
        type: 'Map',
        valueProperty: {
          type: 'string',
        },
      },
      {
        field: 'multimap',
        label: 'MultiMap',
        type: 'MultiMap',
        valueProperty: {
          type: 'string',
        },
      },
    ];
    fixture.detectChanges();

    conditionBuilderComponentHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GioElConditionBuilderHarness);
  });

  it('should create empty condition builder', async () => {
    expect(component).toBeTruthy();
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [],
    });
  });

  it('should add new string condition', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
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
          field: {
            field: 'application',
            key1: undefined,
            key2: undefined,
          },
          operator: 'Equals',
          value: 'Yolo',
        },
      ],
    });
  });

  it('should add new boolean condition', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'Is Authenticated');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual(['Equals', 'Not equals']);

    await mainConditionGroup.selectConditionOperator(0, 'Not equals');

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: {
            field: 'isAuthenticated',
          },
          operator: 'Not equals',
          value: true,
        },
      ],
    });
  });

  it('should add new number condition', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
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
          field: {
            field: 'duration',
          },
          operator: 'Less than',
          value: 5,
        },
      ],
    });
  });

  it('should add new date condition', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
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
          field: {
            field: 'timestamp',
          },
          operator: 'Greater than',
          value: '2021-01-01T00:00:00.000Z',
        },
      ],
    });
  });

  it('should add new group', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
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
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
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
          field: {
            field: 'application',
          },
          operator: 'Equals',
          value: 'Yolo',
        },
        {
          field: {
            field: 'application',
          },
          operator: 'Equals',
          value: 'Toto',
        },
      ],
    });
  });

  it('should add new group with conditions', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
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
          field: {
            field: 'application',
          },
          operator: 'Equals',
          value: 'Yolo',
        },
        {
          condition: 'OR',
          conditions: [
            {
              field: {
                field: 'duration',
              },
              operator: 'Equals',
              value: 42,
            },
            {
              field: {
                field: 'duration',
              },
              operator: 'Equals',
              value: 43,
            },
          ],
        },
      ],
    });
  });

  it('should add new map condition', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'Properties', 'propA');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual(['Equals', 'Not equals']);

    await mainConditionGroup.selectConditionOperator(0, 'Equals');
    await mainConditionGroup.setConditionValue(0, 'Bar');

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: {
            field: 'properties',
            key1: 'propA',
          },
          operator: 'Equals',
          value: 'Bar',
        },
      ],
    });
  });

  it('should add new multimap condition', async () => {
    const mainConditionGroup = await conditionBuilderComponentHarness.getMainConditionGroup();
    await mainConditionGroup.clickAddNewConditionButton();

    await mainConditionGroup.selectConditionField(0, 'MultiMap', 'Foo', '42');
    expect(await mainConditionGroup.getConditionAvailableOperators(0)).toEqual(['Equals', 'Not equals']);

    await mainConditionGroup.selectConditionOperator(0, 'Equals');
    await mainConditionGroup.setConditionValue(0, 'Bar');

    const conditions = await mainConditionGroup.getConditions();
    expect(conditions).toEqual({
      condition: 'AND',
      conditions: [
        {
          field: {
            field: 'multimap',
            key1: 'Foo',
            key2: '42',
          },
          operator: 'Equals',
          value: 'Bar',
        },
      ],
    });
  });
});
