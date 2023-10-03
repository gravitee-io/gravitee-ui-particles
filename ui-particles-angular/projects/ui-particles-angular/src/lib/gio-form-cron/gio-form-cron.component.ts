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

import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl } from '@angular/forms';
import { isEmpty, range } from 'lodash';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { CronDisplay, getDefaultCronDisplay, parseCronExpression, toCronDescription, toCronExpression } from './gio-form-cron.adapter';

@Component({
  selector: 'gio-form-cron',
  templateUrl: './gio-form-cron.component.html',
  styleUrls: ['./gio-form-cron.component.scss'],
})
export class GioFormCronComponent implements ControlValueAccessor, OnInit, OnDestroy {
  public _onChange: (value: string | null) => void = () => ({});

  public _onTouched: () => void = () => ({});

  public seconds = [...range(0, 60)];
  public minutes = [...range(0, 60)];
  public hours = [...range(0, 24)];
  public daysOfMonth = [...range(1, 32)];
  public daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public internalFormGroup?: FormGroup;
  public value?: string;
  public expressionDescription?: string;
  public isDisabled = false;
  @HostBinding('class.smallDisplay')
  public smallDisplay = false;

  private touched = false;
  private focused = false;
  @HostBinding('class.disabled')

  private cronDisplay?: CronDisplay;

  private unsubscribe$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;

  constructor(
    @Optional() @Self() public readonly ngControl: NgControl,
    private readonly elRef: ElementRef,
    private readonly fm: FocusMonitor,
    private readonly ngZone: NgZone,
  ) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this._onTouched();
      this.touched = true;
    });
  }

  public ngOnInit(): void {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.ngZone.run(() => {
          const width = entries[0].contentRect.width;
          this.smallDisplay = width < 580;
        });
      });
      this.resizeObserver.observe(this.elRef.nativeElement);
    }

    this.internalFormGroup = new FormGroup({
      mode: new FormControl(),
      secondInterval: new FormControl(),
      minuteInterval: new FormControl(),
      hourInterval: new FormControl(),
      dayInterval: new FormControl(),
      dayOfWeek: new FormControl(),
      dayOfMonth: new FormControl(),

      hours: new FormControl(),
      minutes: new FormControl(),
      customExpression: new FormControl(),
    });
    this.isDisabled ? this.internalFormGroup.disable({ emitEvent: false }) : this.internalFormGroup.enable({ emitEvent: false });

    this.internalFormGroup
      .get('mode')
      ?.valueChanges.pipe(
        filter(mode => !!mode),
        tap(mode => {
          this.cronDisplay = getDefaultCronDisplay(mode);

          this.refreshInternalForm();
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();

    this.internalFormGroup.valueChanges
      ?.pipe(
        tap(value => {
          if (!value?.mode) {
            this._onChange(null);
            return;
          }
          this.value = toCronExpression({
            mode: value.mode,
            secondInterval: value.secondInterval,
            minuteInterval: value.minuteInterval,
            hourInterval: value.hourInterval,
            dayInterval: value.dayInterval,
            dayOfWeek: value.dayOfWeek,
            dayOfMonth: value.dayOfMonth,
            customExpression: value.customExpression,
            hours: value.hours,
            minutes: value.minutes,
          });
          this.expressionDescription = toCronDescription(this.value);
          this._onChange(this.value);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();

    this.refreshInternalForm();
  }

  public ngOnDestroy(): void {
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.resizeObserver?.unobserve(this.elRef.nativeElement);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // From ControlValueAccessor interface
  public writeValue(value: string): void {
    if (isEmpty(value)) {
      return;
    }
    this.value = value;
    this.cronDisplay = parseCronExpression(value);

    this.expressionDescription = toCronDescription(this.value);
    this.refreshInternalForm();
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.refreshInternalForm();
  }

  public onClear() {
    this.value = undefined;
    this.cronDisplay = undefined;
    this.internalFormGroup?.reset({}, { emitEvent: true });
  }

  private refreshInternalForm(): void {
    const d = this.cronDisplay;
    if (!d || !this.internalFormGroup) return;

    this.internalFormGroup.patchValue(
      {
        mode: d.mode,
        customExpression: d.customExpression,
        secondInterval: d.secondInterval,
        minuteInterval: d.minuteInterval,
        hourInterval: d.hourInterval,
        dayInterval: d.dayInterval,
        dayOfWeek: d.dayOfWeek,
        dayOfMonth: d.dayOfMonth,

        hours: d.hours,
        minutes: d.minutes,
      },
      { emitEvent: false },
    );

    this.isDisabled ? this.internalFormGroup.disable({ emitEvent: false }) : this.internalFormGroup.enable({ emitEvent: false });
  }
}
