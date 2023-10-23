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

import { AutocompleteOptions, DisplayValueWithFn } from './gio-form-tags-input.component';
import { GioFormTagsInputHarness } from './gio-form-tags-input.harness';
import { GioFormTagsInputModule } from './gio-form-tags-input.module';

describe('GioFormTagsInputModule - Static input', () => {
  @Component({
    template: `
      <mat-form-field appearance="fill">
        <mat-label>My tags</mat-label>
        <gio-form-tags-input
          [required]="required"
          [placeholder]="placeholder"
          [formControl]="tagsControl"
          [tagValidationHook]="tagValidationHook"
          [autocompleteOptions]="autocompleteOptions"
        ></gio-form-tags-input>
        <mat-error>Error</mat-error>
      </mat-form-field>
    `,
  })
  class TestComponent {
    public required = false;
    public placeholder = 'Add a tag';
    public tagValidationHook: ((tag: string, validationCb: (shouldAddTag: boolean) => void) => void) | undefined = undefined;
    public autocompleteOptions?: string[] = undefined;

    public tagsControl = new FormControl(null, Validators.required);
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, MatIconTestingModule, GioFormTagsInputModule, MatFormFieldModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display tags from formControl', async () => {
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);
    expect(await formTagsInputHarness.getTags()).toEqual([]);

    await formTagsInputHarness.addTag('tag1');
    await formTagsInputHarness.addTag('tag2', 'blur');

    expect(await formTagsInputHarness.getTags()).toEqual(['tag1', 'tag2']);
  });

  it('should add / remove tags to formControl', async () => {
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);

    await formTagsInputHarness.addTag('tag1');
    await formTagsInputHarness.addTag('tag2', 'blur');

    expect(await formTagsInputHarness.getTags()).toEqual(['tag1', 'tag2']);
    expect(component.tagsControl.value).toEqual(['tag1', 'tag2']);

    await formTagsInputHarness.removeTag('tag1');

    expect(await formTagsInputHarness.getTags()).toEqual(['tag2']);
    expect(component.tagsControl.value).toEqual(['tag2']);
  });

  it('should add tag with confirm function before added', async () => {
    component.tagValidationHook = (tag: string, validationCb: (shouldAddTag: boolean) => void) => {
      validationCb(tag.startsWith('*'));
    };
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);

    await formTagsInputHarness.addTag('*');
    await formTagsInputHarness.addTag('tag2');

    expect(await formTagsInputHarness.getTags()).toEqual(['*']);
    expect(component.tagsControl.value).toEqual(['*']);
  });

  it('should handle error state with control', async () => {
    component.tagsControl.addValidators(Validators.required);
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);

    await formTagsInputHarness.addTag('A');
    await formTagsInputHarness.removeTag('A');

    const matFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

    expect(await matFormFieldHarness.hasErrors()).toBe(true);
    expect(component.tagsControl.valid).toEqual(false);
  });

  it('should handle disabled state with control', async () => {
    component.tagsControl.disable();
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);

    expect(await formTagsInputHarness.isDisabled()).toBe(true);
  });

  it('should update error state when control is touched', async () => {
    component.tagsControl.addValidators(Validators.required);
    fixture.detectChanges();
    const matFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

    expect(await matFormFieldHarness.hasErrors()).toBe(false);

    component.tagsControl.markAsTouched();

    expect(await matFormFieldHarness.hasErrors()).toBe(true);
  });

  describe('with autocomplete', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.autocompleteOptions = ['alpha', 'beta', 'gamma'];
      fixture.detectChanges();
    });

    it('should add tag by autocomplete', async () => {
      const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);
      fixture.detectChanges();

      const matAutocomplete = await formTagsInputHarness.getMatAutocompleteHarness();

      await matAutocomplete?.enterText('al');

      const options = await matAutocomplete?.getOptions();
      if (options?.length !== 1) {
        throw new Error('Should be equal to 1');
      }

      expect(await options[0].getText()).toEqual('alpha');

      await options[0].click();

      expect(await formTagsInputHarness.getTags()).toEqual(['alpha']);
    });
  });
});

describe('GioFormTagsInputModule - Dynamic input', () => {
  @Component({
    template: `
      <mat-form-field appearance="fill">
        <mat-label>My tags</mat-label>
        <gio-form-tags-input
          [required]="required"
          [placeholder]="placeholder"
          [formControl]="tagsControl"
          [tagValidationHook]="tagValidationHook"
          [autocompleteOptions]="autocompleteOptions"
          [displayValueWith]="displayValueWith"
          [useAutocompleteOptionValueOnly]="useAutocompleteOptionValueOnly"
        ></gio-form-tags-input>
        <mat-error>Error</mat-error>
      </mat-form-field>
    `,
  })
  class TestDynamicComponent {
    public required = false;
    public placeholder = 'Add a tag';
    public tagValidationHook: ((tag: string, validationCb: (shouldAddTag: boolean) => void) => void) | undefined = undefined;
    public autocompleteOptions?: (search: string) => Observable<AutocompleteOptions>;
    public displayValueWith: DisplayValueWithFn = (_value: string) => {
      return of();
    };
    public useAutocompleteOptionValueOnly = false;

    public tagsControl = new FormControl(null, Validators.required);
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
  let displayValueWithFnCalledNumber = 0;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDynamicComponent],
      imports: [NoopAnimationsModule, MatIconTestingModule, GioFormTagsInputModule, MatFormFieldModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestDynamicComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    displayValueWithFnCalledNumber = 0;
    component.autocompleteOptions = (search: string) => {
      return of(fakeApplications.filter(app => search && app.label.toLowerCase().includes(search.toLowerCase())));
    };

    component.displayValueWith = (value: string) => {
      displayValueWithFnCalledNumber++;

      return of(fakeApplications.find(app => app.value === value)?.label || value);
    };
  });

  it('should display tags with value', async () => {
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);
    expect(await formTagsInputHarness.getTags()).toEqual([]);

    await formTagsInputHarness.addTag('The A1 application');
    await formTagsInputHarness.addTag('The B1 application');

    expect(await formTagsInputHarness.getTags()).toEqual(['The A1 application', 'The B1 application']);
    expect(displayValueWithFnCalledNumber).toEqual(2);

    const matAutocomplete = await formTagsInputHarness.getMatAutocompleteHarness();

    await matAutocomplete?.enterText('The A2');
    const options = await matAutocomplete?.getOptions();
    if (options?.length !== 1) {
      throw new Error('Should be equal to 1');
    }
    await options[0].click();

    expect(await formTagsInputHarness.getTags()).toEqual(['The A1 application', 'The B1 application', 'The A2 application']);
    // Keep 2 call because autocomplete value is cached
    expect(displayValueWithFnCalledNumber).toEqual(2);
  });

  it('should display value if tag not found', async () => {
    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);
    expect(await formTagsInputHarness.getTags()).toEqual([]);

    const matAutocomplete = await formTagsInputHarness.getMatAutocompleteHarness();

    await matAutocomplete?.enterText('The A3');
    const options = await matAutocomplete?.getOptions();
    if (options?.length !== 0) {
      throw new Error('Should be equal to 0');
    }
    // Click somewhere else in the component to close the autocomplete without selecting an option
    await matAutocomplete?.blur();

    expect(await formTagsInputHarness.getTags()).toEqual(['The A3']);
    expect(displayValueWithFnCalledNumber).toEqual(1);
  });

  it('should not add unexisting tag', async () => {
    component.useAutocompleteOptionValueOnly = true;
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);
    expect(await formTagsInputHarness.getTags()).toEqual([]);

    const matAutocomplete = await formTagsInputHarness.getMatAutocompleteHarness();
    await matAutocomplete?.enterText('The A3');
    const options = await matAutocomplete?.getOptions();
    if (options?.length !== 0) {
      throw new Error('Should be equal to 0');
    }
    // Click somewhere else in the component to close the autocomplete without selecting an option
    await matAutocomplete?.blur();

    expect(await formTagsInputHarness.getTags()).toEqual([]);
  });

  it('should display loading spinner when waiting for autocomplete values', async () => {
    const subject: Subject<{ label: string; value: string }[]> = new Subject();

    component.autocompleteOptions = () => subject.asObservable();
    fixture.detectChanges();

    const formTagsInputHarness = await loader.getHarness(GioFormTagsInputHarness);
    const autocompleteHarness = await formTagsInputHarness.getMatAutocompleteHarness();

    await autocompleteHarness?.enterText('The ');
    fixture.detectChanges();

    const ids = await autocompleteHarness
      ?.getOptions()
      .then(options => Promise.all(options.map(option => option.host())))
      .then(options => Promise.all(options.map(option => option.getAttribute('id'))));
    expect(ids).toEqual(['loader']);

    subject.next(fakeApplications);
    fixture.detectChanges();

    const text2 = await autocompleteHarness?.getOptions().then(opt => Promise.all(opt.map(o => o.getText())));
    expect(text2).toEqual(fakeApplications.map(a => a.label));
  });
});
