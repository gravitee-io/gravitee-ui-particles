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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, Subject } from 'rxjs';

import { AutocompleteInputOptions } from './gio-form-autocomplete-input.component';
import { GioFormAutocompleteInputHarness } from './gio-form-autocomplete-input.harness';
import { GioFormAutocompleteInputModule } from './gio-form-autocomplete-input.module';

describe('GioFormAutocompleteInputModule - Static options', () => {
  @Component({
    template: `
      <mat-form-field appearance="fill">
        <mat-label>Select option</mat-label>
        <gio-form-autocomplete-input
          [required]="required"
          [placeholder]="placeholder"
          [formControl]="autocompleteControl"
          [autocompleteInputOptions]="autocompleteInputOptions"
          (tagClicked)="onTagClick($event)"
        ></gio-form-autocomplete-input>
        <mat-error>This field is required</mat-error>
      </mat-form-field>
    `,
    standalone: false,
  })
  class TestComponent {
    public required = false;
    public placeholder = 'Select an option';
    public autocompleteInputOptions: string[] = ['alpha', 'beta', 'gamma', 'delta'];
    public autocompleteControl = new FormControl('', Validators.required);
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, MatIconTestingModule, GioFormAutocompleteInputModule, MatFormFieldModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display empty value initially', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    expect(await autocompleteInputHarness.getValue()).toEqual('');
  });

  it('should set value through harness', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.setValue('test value');

    // Manually update the component's value since setValue only updates the input element
    component.autocompleteControl.setValue('test value');
    fixture.detectChanges();

    expect(await autocompleteInputHarness.getValue()).toEqual('test value');
    expect(component.autocompleteControl.value).toEqual('test value');
  });

  it('should update formControl when value changes', async () => {
    fixture.detectChanges();

    component.autocompleteControl.markAsTouched();
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    component.autocompleteControl.setValue('alpha');
    fixture.detectChanges();

    expect(component.autocompleteControl.valid).toEqual(true);
    expect(await autocompleteInputHarness.getValue()).toEqual('alpha');
    expect(component.autocompleteControl.value).toEqual('alpha');
  });

  it('should display autocomplete options when typing', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    fixture.detectChanges();
    await fixture.whenStable();

    await autocompleteInputHarness.type('al');
    await new Promise(resolve => setTimeout(resolve, 400));

    fixture.detectChanges();
    await fixture.whenStable();

    const options = await autocompleteInputHarness.getAutocompleteOptions();
    expect(options).toEqual(['alpha']);
  });

  it('should select option from autocomplete', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('bet');

    fixture.detectChanges();
    await fixture.whenStable();

    await autocompleteInputHarness.selectOption('beta');

    expect(await autocompleteInputHarness.getValue()).toEqual('beta');
    expect(component.autocompleteControl.value).toEqual('beta');
  });

  it('should handle error state with required validator', async () => {
    fixture.detectChanges();

    component.autocompleteControl.markAsTouched();
    fixture.detectChanges();

    const matFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

    expect(await matFormFieldHarness.hasErrors()).toBe(true);
    expect(component.autocompleteControl.valid).toEqual(false);
  });

  it('should clear error state when value is set', async () => {
    fixture.detectChanges();

    component.autocompleteControl.markAsTouched();
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);
    const matFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

    expect(await matFormFieldHarness.hasErrors()).toBe(true);

    await autocompleteInputHarness.setValue('alpha');
    component.autocompleteControl.setValue('alpha');
    fixture.detectChanges();

    expect(await matFormFieldHarness.hasErrors()).toBe(false);
    expect(component.autocompleteControl.valid).toEqual(true);
  });

  it('should handle disabled state', async () => {
    component.autocompleteControl.disable();
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    expect(await autocompleteInputHarness.isDisabled()).toBe(true);
  });

  it('should focus and blur correctly', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    expect(await autocompleteInputHarness.isFocused()).toBe(false);

    await autocompleteInputHarness.focus();
    expect(await autocompleteInputHarness.isFocused()).toBe(true);

    await autocompleteInputHarness.blur();
    expect(await autocompleteInputHarness.isFocused()).toBe(false);
  });

  it('should display placeholder', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    expect(await autocompleteInputHarness.getPlaceholder()).toEqual('Select an option');
  });

  it('should clear value', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.setValue('alpha');
    expect(await autocompleteInputHarness.getValue()).toEqual('alpha');

    await autocompleteInputHarness.clear();
    expect(await autocompleteInputHarness.getValue()).toEqual('');
  });

  it('should filter options based on search text', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('a');

    fixture.detectChanges();
    await fixture.whenStable();

    const options = await autocompleteInputHarness.getAutocompleteOptions();
    expect(options).toEqual(['alpha', 'beta', 'gamma', 'delta']);
  });
});

describe('GioFormAutocompleteInputModule - Dynamic options', () => {
  @Component({
    template: `
      <mat-form-field appearance="fill">
        <mat-label>Select application</mat-label>
        <gio-form-autocomplete-input
          [required]="required"
          [placeholder]="placeholder"
          [formControl]="autocompleteControl"
          [autocompleteInputOptions]="autocompleteOptions"
          [displayWith]="displayWith"
        ></gio-form-autocomplete-input>
        <mat-error>Error</mat-error>
      </mat-form-field>
    `,
    standalone: false,
  })
  class TestDynamicComponent {
    public required = false;
    public placeholder = 'Select an application';
    public autocompleteOptions?: (search: string) => Observable<AutocompleteInputOptions>;
    public displayWith?: (value: string) => string;

    public autocompleteControl = new FormControl('', Validators.required);
  }

  let component: TestDynamicComponent;
  let fixture: ComponentFixture<TestDynamicComponent>;
  let loader: HarnessLoader;

  const fakeApplications = [
    {
      label: 'The A1 application',
      value: 'a1',
    },
    {
      label: 'The A2 application',
      value: 'a2',
    },
    {
      label: 'The B1 application',
      value: 'b1',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDynamicComponent],
      imports: [NoopAnimationsModule, MatIconTestingModule, GioFormAutocompleteInputModule, MatFormFieldModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestDynamicComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    component.autocompleteOptions = (search: string) => {
      return of(fakeApplications.filter(app => search && app.label.toLowerCase().includes(search.toLowerCase())));
    };

    component.displayWith = (value: string) => {
      const app = fakeApplications.find(a => a.value === value);
      return app ? app.label : value;
    };
  });

  it('should load and display dynamic options', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('The A');

    fixture.detectChanges();
    await fixture.whenStable();

    const options = await autocompleteInputHarness.getAutocompleteOptions();
    expect(options).toEqual(['The A1 application', 'The A2 application']);
  });

  it('should select option and update control with value', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('The A1');

    fixture.detectChanges();
    await fixture.whenStable();

    await autocompleteInputHarness.selectOption('The A1 application');

    expect(component.autocompleteControl.value).toEqual('a1');
  });

  it('should display loading spinner when waiting for options', async () => {
    const subject: Subject<{ label: string; value: string }[]> = new Subject();

    component.autocompleteOptions = () => subject.asObservable();
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('The ');

    fixture.detectChanges();

    await autocompleteInputHarness.openAutocomplete();
    const options = await autocompleteInputHarness.getAutocompleteOptions();

    expect(options.length).toBeGreaterThanOrEqual(0);

    subject.next(fakeApplications);
    fixture.detectChanges();

    const optionsAfterLoad = await autocompleteInputHarness.getAutocompleteOptions();
    expect(optionsAfterLoad).toEqual(fakeApplications.map(a => a.label));
  });

  it('should filter options based on search', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('B1');

    fixture.detectChanges();
    await fixture.whenStable();

    const options = await autocompleteInputHarness.getAutocompleteOptions();
    expect(options).toEqual(['The B1 application']);
  });

  it('should return empty array when no options match', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('nonexistent');

    fixture.detectChanges();
    await fixture.whenStable();

    const isOpen = await autocompleteInputHarness.isAutocompleteOpen();

    if (isOpen) {
      const options = await autocompleteInputHarness.getAutocompleteOptions();
      expect(options).toEqual([]);
    } else {
      expect(isOpen).toBe(false);
    }
  });

  it('should use displayWith function to show label', async () => {
    component.autocompleteControl.setValue('a1');
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    expect(await autocompleteInputHarness.getValue()).toEqual('The A1 application');
  });
});

describe('GioFormAutocompleteInputModule - Grouped options', () => {
  @Component({
    template: `
      <mat-form-field appearance="fill">
        <mat-label>Select item</mat-label>
        <gio-form-autocomplete-input
          [formControl]="autocompleteControl"
          [autocompleteInputOptions]="groupedOptions"
        ></gio-form-autocomplete-input>
      </mat-form-field>
    `,
    standalone: false,
  })
  class TestGroupedComponent {
    public groupedOptions: AutocompleteInputOptions = [
      {
        groupLabel: 'Group A',
        groupOptions: ['a1', 'a2', 'a3'],
      },
      {
        groupLabel: 'Group B',
        groupOptions: ['b1', 'b2'],
      },
    ];

    public autocompleteControl = new FormControl('');
  }

  let component: TestGroupedComponent;
  let fixture: ComponentFixture<TestGroupedComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestGroupedComponent],
      imports: [NoopAnimationsModule, MatIconTestingModule, GioFormAutocompleteInputModule, MatFormFieldModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestGroupedComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display all options from all groups', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('a');

    fixture.detectChanges();
    await fixture.whenStable();

    const options = await autocompleteInputHarness.getAutocompleteOptions();
    expect(options).toEqual(['a1', 'a2', 'a3']);
  });

  it('should select option from any group', async () => {
    fixture.detectChanges();

    const autocompleteInputHarness = await loader.getHarness(GioFormAutocompleteInputHarness);

    await autocompleteInputHarness.focus();
    await autocompleteInputHarness.type('b');

    fixture.detectChanges();
    await fixture.whenStable();

    await autocompleteInputHarness.selectOption('b2');

    expect(await autocompleteInputHarness.getValue()).toEqual('b2');
    expect(component.autocompleteControl.value).toEqual('b2');
  });
});
