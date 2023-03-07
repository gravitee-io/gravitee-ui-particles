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
import { ChangeDetectionStrategy, Component, ElementRef, Host, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { ControlValueAccessor, FormGroup, NgControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { cloneDeep, isObject } from 'lodash';
import { JSONSchema7 } from 'json-schema';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

import { GioJsonSchema } from './model/GioJsonSchema';
import { GioFormlyJsonSchemaService } from './gio-formly-json-schema.service';

@Component({
  selector: 'gio-form-json-schema',
  template: `<formly-form *ngIf="formGroup" [fields]="fields" [options]="options" [form]="formGroup" [model]="model"></formly-form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioFormJsonSchemaComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

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

  public _onChange: (value: unknown | null) => void = () => ({});

  public _onTouched: () => void = () => ({});

  private touched = false;

  constructor(
    private readonly gioFormlyJsonSchema: GioFormlyJsonSchemaService,
    private readonly elRef: ElementRef,
    private readonly fm: FocusMonitor,
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
        this._onTouched();
        this.touched = true;
      });
  }

  public ngOnInit(): void {
    this.formGroup.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(status => {
      if (status === 'VALID') {
        this.ngControl?.control?.setErrors(null);
      }
      if (status === 'INVALID') {
        this.ngControl?.control?.setErrors({ invalid: true });
      }
    });

    // To simulate the behavior of classic form controls, emit value only when the form is touched
    // Allow to keep the formControl pristine until the user interact with it
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(() => this.touched),
      )
      .subscribe(value => {
        this._onChange(value);
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
  public setDisabledState?(_isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
