/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { ControlValueAccessor, FormGroup, NgControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { cloneDeep, isEmpty, isObject } from 'lodash';
import { debounceTime, distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

import { GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR } from '../gio-form-focus-first-invalid/gio-form-focus-first-invalid-ignore.directive';

import { GioJsonSchema } from './model/GioJsonSchema';
import { GioFormlyJsonSchemaService } from './gio-formly-json-schema.service';

@Component({
  selector: 'gio-form-json-schema',
  template: `<formly-form *ngIf="formGroup" [fields]="fields" [options]="options" [form]="formGroup" [model]="model"></formly-form>`,
  styleUrls: ['./gio-form-json-schema.component.scss'],
})
export class GioFormJsonSchemaComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
  public static isDisplayable(jsonSchema: GioJsonSchema): boolean {
    const properties = ['properties', 'oneOf', 'anyOf', 'allOf', '$ref', 'items'] as const;

    return isObject(jsonSchema) && properties.some(property => !isEmpty(jsonSchema[property]));
  }
  private unsubscribe$: Subject<void> = new Subject<void>();

  @HostBinding(`attr.${GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR}`)
  private gioFormFocusInvalidIgnore = true;

  @Input()
  public set jsonSchema(jsonSchema: GioJsonSchema) {
    if (isObject(jsonSchema)) {
      this.fields = [this.gioFormlyJsonSchema.toFormlyFieldConfig(jsonSchema)];
    }
  }

  public formGroup: FormGroup = new FormGroup({});

  @Input()
  public options: FormlyFormOptions = {};

  public model: unknown = {};

  public fields: FormlyFieldConfig[] = [];

  public loading = true;

  public isDisabled = false;

  public _onChange: (value: unknown | null) => void = () => ({});

  public _onTouched: () => void = () => ({});

  private touched = false;

  private isValid$ = new ReplaySubject(1); // Wait JsonSchema to be loaded to check if it's valid

  private stateChanges$ = new Subject<void>();

  constructor(
    private readonly gioFormlyJsonSchema: GioFormlyJsonSchemaService,
    private readonly elRef: ElementRef,
    private readonly fm: FocusMonitor,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Host() @Optional() public readonly ngControl?: NgControl,
  ) {
    if (ngControl) {
      // Setting the value accessor directly (instead of using
      // the providers `NG_VALUE_ACCESSOR`) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }

    // When the user interact with the form, mark it as touched
    fm.monitor(elRef.nativeElement, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.isDisabled) {
          return;
        }
        this._onTouched();
        this.touched = true;
      });
  }

  public ngOnInit(): void {
    // When the parent form is touched, mark all the sub formGroup as touched if not already touched
    const parentControl = this.ngControl?.control?.parent;
    parentControl?.statusChanges
      ?.pipe(
        takeUntil(this.unsubscribe$),
        map(() => parentControl?.touched),
        filter(touched => touched === true),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        if (this.isDisabled) {
          return;
        }
        this.formGroup.markAllAsTouched();
        this.stateChanges$.next();
      });

    // Group all valueChanges events emit by formly in a single one
    merge(this.formGroup.statusChanges, this.formGroup.valueChanges)
      .pipe(takeUntil(this.unsubscribe$), debounceTime(100))
      .subscribe(() => {
        this.stateChanges$.next();
      });
  }

  public ngAfterViewInit(): void {
    // Add async validator to the parent
    this.ngControl?.control?.addAsyncValidators(() => {
      return this.isValid$.pipe(
        takeUntil(this.unsubscribe$),
        take(1),
        map(isValid => (isValid ? null : { invalid: true })),
      );
    });
    this.ngControl?.control?.updateValueAndValidity({ emitEvent: false });

    // Subscribe to state changes to manage touches, status and value
    this.stateChanges$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      const { status, value, touched } = this.formGroup;
      if (this.isDisabled) {
        return;
      }

      if (status === 'VALID') {
        this.isValid$.next(true);
        this.ngControl?.control?.setErrors(null);
      }
      if (status === 'INVALID') {
        this.isValid$.next(false);
        this.ngControl?.control?.setErrors({ invalid: true });
      }

      if (touched && !this.touched) {
        this._onTouched();
        this.touched = true;
      }

      if (this.touched) {
        this._onChange(value);
      }

      this.ngControl?.control?.updateValueAndValidity({ emitEvent: false });
      this.changeDetectorRef.detectChanges();
    });

    this.stateChanges$.next();
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  // From ControlValueAccessor
  public writeValue(value: unknown): void {
    this.model = cloneDeep(value) ?? {};
  }

  // From ControlValueAccessor
  public registerOnChange(fn: (value: unknown | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor
  public setDisabledState?(isDisabled: boolean): void {
    if (this.isDisabled === isDisabled) {
      return;
    }

    this.isDisabled = isDisabled;

    this.options = {
      ...this.options,
      formState: {
        ...this.options.formState,
        disabled: isDisabled,
      },
    };

    isDisabled ? this.formGroup.disable() : this.formGroup.enable();

    this.stateChanges$.next();
  }
}
