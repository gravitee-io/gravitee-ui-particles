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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Host,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, UntypedFormGroup, NgControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { cloneDeep, isEmpty, isEqual, isObject, set } from 'lodash';
import { debounceTime, delay, distinctUntilChanged, filter, map, startWith, take, takeUntil, tap } from 'rxjs/operators';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

import { GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR } from '../gio-form-focus-first-invalid/gio-form-focus-first-invalid-ignore.directive';

import { GioJsonSchema } from './model/GioJsonSchema';
import { GioFormlyJsonSchemaService } from './gio-formly-json-schema.service';
import { GioJsonSchemaContext } from './model/GioJsonSchemaContext';

@Component({
  selector: 'gio-form-json-schema',
  template: `<formly-form *ngIf="formGroup" [fields]="fields" [options]="options" [form]="formGroup" [model]="model"></formly-form>`,
  styleUrls: ['./gio-form-json-schema.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioFormJsonSchemaComponent implements ControlValueAccessor, OnChanges, OnInit, AfterViewInit, OnDestroy {
  public static isDisplayable(jsonSchema: GioJsonSchema): boolean {
    const properties = ['properties', 'oneOf', 'anyOf', 'allOf', '$ref', 'items'] as const;

    return isObject(jsonSchema) && properties.some(property => !isEmpty(jsonSchema[property]));
  }
  private unsubscribe$: Subject<void> = new Subject<void>();

  @HostBinding(`attr.${GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR}`)
  private gioFormFocusInvalidIgnore = true;

  @Input({ required: true })
  public jsonSchema!: GioJsonSchema;

  @Input()
  public context?: GioJsonSchemaContext;

  public formGroup: UntypedFormGroup = new UntypedFormGroup({});

  @Input()
  public options: FormlyFormOptions = {};

  // When true the form is ready and control status are up-to-date
  // Useful to know when initial control status can be used
  @Output()
  public ready = new EventEmitter<boolean>();

  private isReady = false;

  public model: unknown = {};

  public fields: FormlyFieldConfig[] = [];

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

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.jsonSchema) {
      this.isReady = false;
      this.ready.next(false);
    }

    if (changes.jsonSchema || changes.context) {
      this.fields = [this.gioFormlyJsonSchema.toFormlyFieldConfig(this.jsonSchema, this.context)];
    }
  }

  public ngOnInit(): void {
    // When the parent form is touched, mark all the sub formGroup as touched if not already touched
    const parentControl = this.ngControl?.control?.parent;
    parentControl?.statusChanges
      ?.pipe(
        map(() => parentControl?.touched),
        filter(touched => touched === true),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        if (this.isDisabled) {
          return;
        }
        this.formGroup.markAllAsTouched();
        this.stateChanges$.next();
      });
    // Add async validator to the parent
    this.ngControl?.control?.addAsyncValidators(() => {
      return this.isValid$.pipe(
        take(1),
        map(isValid => (isValid ? null : { invalid: true })),
        takeUntil(this.unsubscribe$),
      );
    });

    // Sync control value with default value (without emit event) as long as the component is not ready
    // When formly is initialised, it emits several values as it builds up step by step.
    this.formGroup.valueChanges
      .pipe(
        distinctUntilChanged(isEqual),
        tap(value => {
          this.ngControl?.control?.reset(value, { emitEvent: false });
        }),
        takeUntil(this.ready),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();

    // Avoid ExpressionChangedAfterItHasBeenCheckedError on project
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();

    // Subscribe to state changes to manage touches, status and value
    this.stateChanges$
      .pipe(
        tap(() => {
          const { status, value, touched } = this.formGroup;
          if (this.isDisabled) {
            return;
          }

          if (status === 'VALID') {
            this.isValid$.next(true);
          }
          if (status === 'INVALID') {
            this.isValid$.next(false);
          }

          if (touched && !this.touched) {
            this._onTouched();
            this.touched = true;
          }

          if (this.touched) {
            this._onChange(value);
          }
        }),
        delay(0),
        // Keep at the end
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
        this.ngControl?.control?.updateValueAndValidity({
          emitEvent: false,
        });

        // After the first state change, the form is ready
        if (!this.isReady) {
          this.isReady = true;
          this.ready.emit(true);
        }
      });
  }

  public ngAfterViewInit(): void {
    // Group all valueChanges events emit by formly in a single one
    merge(this.formGroup.statusChanges, this.formGroup.valueChanges)
      .pipe(
        // Force fist stateChanges$
        startWith({}),
        debounceTime(100),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.stateChanges$.next();
      });
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

    set(this.options, 'formState.parentDisabled', isDisabled);
    setTimeout(() => {
      isDisabled ? this.formGroup.disable({ emitEvent: false }) : this.formGroup.enable({ emitEvent: false });
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
      this.stateChanges$.next();
    }, 0);

    this.stateChanges$.next();
  }
}
