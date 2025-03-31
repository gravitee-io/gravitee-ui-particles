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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { GioFormSelectionInlineHarness } from './gio-form-selection-inline.harness';
import { GioFormSelectionInlineModule } from './gio-form-selection-inline.module';

@Component({
  template: `
    <gio-form-selection-inline [formControl]="selectControl">
      <gio-form-selection-inline-card value="A">Hello</gio-form-selection-inline-card>
      <gio-form-selection-inline-card value="B">Hello</gio-form-selection-inline-card>
      <gio-form-selection-inline-card value="C">Hello</gio-form-selection-inline-card>
      <gio-form-selection-inline-card [disabled]="true" value="D">Disabled</gio-form-selection-inline-card>
      <gio-form-selection-inline-card value="E">Hello</gio-form-selection-inline-card>
    </gio-form-selection-inline>
  `,
  standalone: false,
})
class TestComponent {
  public selectControl = new FormControl('');
}

describe('GioFormSelectionInlineModule', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioFormSelectionInlineModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display form with form value', async () => {
    fixture.detectChanges();

    const formSelectCards = await loader.getHarness(GioFormSelectionInlineHarness);
    expect(await formSelectCards.getSelectedValue()).toEqual(undefined);

    component.selectControl.setValue('A');
    expect(await formSelectCards.getSelectedValue()).toBe('A');

    const cards = await formSelectCards.getSelectionCards();
    expect(cards).toEqual([
      { text: 'Hello', value: 'A', selected: true, disabled: false },
      { text: 'Hello', value: 'B', selected: false, disabled: false },
      { text: 'Hello', value: 'C', selected: false, disabled: false },
      { text: 'Disabled', value: 'D', selected: false, disabled: true },
      { text: 'Hello', value: 'E', selected: false, disabled: false },
    ]);
  });

  it('should change selection', async () => {
    fixture.detectChanges();

    const formSelectCards = await loader.getHarness(GioFormSelectionInlineHarness);
    expect(await formSelectCards.getSelectedValue()).toEqual(undefined);

    await formSelectCards.select('B');
    expect(await formSelectCards.getSelectedValue()).toEqual('B');
    expect(component.selectControl.value).toEqual('B');
    expect(await formSelectCards.getUnselectedValues()).toEqual(['A', 'C', 'D', 'E']);

    await formSelectCards.select('C');
    expect(await formSelectCards.getSelectedValue()).toEqual('C');
    expect(component.selectControl.value).toEqual('C');
    expect(await formSelectCards.getUnselectedValues()).toEqual(['A', 'B', 'D', 'E']);
  });

  it('should not be able to change selection when the form is disabled', async () => {
    component.selectControl.setValue('A');
    component.selectControl.disable();
    fixture.detectChanges();

    const formSelectCards = await loader.getHarness(GioFormSelectionInlineHarness);
    expect(await formSelectCards.getSelectedValue()).toBe('A');

    await formSelectCards.select('B');
    expect(await formSelectCards.getSelectedValue()).toBe('A');
  });
});
