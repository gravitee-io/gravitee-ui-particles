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
// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility

import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl } from '@angular/forms';
import { isEmpty, range } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { CronDisplay, getDefaultCronDisplay, parseCronExpression, toCronExpression } from './gio-form-cron.adapter';

@Component({
  selector: 'gio-form-cron',
  templateUrl: './gio-form-cron.component.html',
  styleUrls: ['./gio-form-cron.component.scss'],
})
export class GioFormCronComponent implements ControlValueAccessor, OnInit, OnDestroy {
  public _onChange: (value: string | null) => void = () => ({});

  public _onTouched: () => void = () => ({});

  public seconds = [...range(0, 59)];
  public minutes = [...range(0, 59)];
  public hours = [...range(0, 23)];
  public daysOfMonth = [...range(1, 32)];
  public daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public internalFormGroup?: FormGroup;
  public value?: string;

  private touched = false;
  private focused = false;

  private defaultMode = 'secondly' as const;

  private cronDisplay: CronDisplay = getDefaultCronDisplay(this.defaultMode);

  private unsubscribe$ = new Subject<void>();

  constructor(
    @Optional() @Self() public readonly ngControl: NgControl,
    private readonly elRef: ElementRef,
    private readonly fm: FocusMonitor,
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
    this.internalFormGroup = new FormGroup({
      mode: new FormControl(this.defaultMode),
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

    this.internalFormGroup
      .get('mode')
      ?.valueChanges.pipe(
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
          this._onChange(this.value);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();

    this.refreshInternalForm();
  }

  public ngOnDestroy(): void {
    this.fm.stopMonitoring(this.elRef.nativeElement);
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

  private refreshInternalForm(): void {
    const d = this.cronDisplay;
    if (!this.internalFormGroup) return;

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
  }
}
