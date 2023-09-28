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
import { Component, ElementRef, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'gio-form-cron',
  templateUrl: './gio-form-cron.component.html',
  styleUrls: ['./gio-form-cron.component.scss'],
})
export class GioFormCronComponent implements ControlValueAccessor, OnDestroy {
  public _onChange: (value: string | null) => void = () => ({});

  public _onTouched: () => void = () => ({});

  private touched = false;
  private focused = false;

  private value?: string;

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

  public ngOnDestroy(): void {
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  // From ControlValueAccessor interface
  public writeValue(value: string): void {
    this.value = value;
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
