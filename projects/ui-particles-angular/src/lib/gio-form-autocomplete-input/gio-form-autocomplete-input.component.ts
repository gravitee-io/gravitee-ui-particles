/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { isEmpty } from 'lodash';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';

type AutocompleteInputOptionsFlat = (string | { value: string; label: string })[];
type AutocompleteInputOptionsGroup = { groupLabel: string; groupOptions: AutocompleteInputOptionsFlat }[];

export type AutocompleteInputOptions = AutocompleteInputOptionsFlat | AutocompleteInputOptionsGroup;

@Component({
  selector: 'gio-form-autocomplete-input',
  templateUrl: './gio-form-autocomplete-input.component.html',
  styleUrls: ['./gio-form-autocomplete-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: GioFormAutocompleteInputComponent,
    },
  ],
  standalone: false,
})
export class GioFormAutocompleteInputComponent implements MatFormFieldControl<string>, ControlValueAccessor, DoCheck, OnDestroy {
  private static nextId = 0;

  public _onChange: (_value: string | null) => void = () => ({});
  public _onTouched: () => void = () => ({});
  private touched = false;

  @Input('aria-label')
  public ariaLabel = '';

  @Input()
  public set autocompleteInputOptions(
    v: AutocompleteInputOptions | ((search: string) => Observable<AutocompleteInputOptions>) | undefined,
  ) {
    this._autocompleteInputOptions = v;
  }

  public _autocompleteInputOptions?: AutocompleteInputOptions | ((search: string) => Observable<AutocompleteInputOptions>);

  /**
   * Display function to show the label for a given value
   */
  @Input()
  public displayWith?: (value: string) => string;

  @ViewChild('input')
  public set input(v: ElementRef<HTMLInputElement> | null) {
    if (v) {
      this.fm.monitor(v.nativeElement).subscribe(origin => {
        if (origin) {
          this.initAutocomplete();
        }
      });
    } else if (this._input) {
      this.fm.stopMonitoring(this._input.nativeElement);
    }

    this._input = v;
  }
  private _input: ElementRef<HTMLInputElement> | null = null;

  public autocompleteInputFilteredOptions$?: Observable<{ groupLabel?: string; groupOptions: { value: string; label: string }[] }[]>;
  public loading = false;
  public inputValue = '';

  public get value(): string | null {
    return this._value;
  }

  public set value(_value: string | null) {
    this._value = _value;
    this._onChange(_value);
    this.updateInputValue();
    this.stateChanges.next();
  }

  private _value: string | null = null;

  public stateChanges = new Subject<void>();

  @HostBinding('id')
  public id = `gio-form-autocomplete-input-${GioFormAutocompleteInputComponent.nextId++}`;

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }

  public set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _placeholder = '';

  public focused = false;

  public get empty(): boolean {
    return isEmpty(this.value) && isEmpty(this._input?.nativeElement?.value);
  }

  @HostBinding('class.floating')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }

  public set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  public get disabled(): boolean {
    return this._disabled || (this.ngControl && this.ngControl.disabled === true);
  }

  public set disabled(dis: boolean) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  private _disabled = false;

  public get errorState(): boolean {
    return (
      this.touched && ((this.required && this.empty) || (this.ngControl && this.ngControl.touched === true && !!this.ngControl.errors))
    );
  }

  public controlType = 'gio-form-autocomplete-input';

  public autofilled?: boolean;

  public userAriaDescribedBy?: string;

  constructor(
    @Optional() @Self() public readonly ngControl: NgControl,
    private readonly elRef: ElementRef,
    private readonly fm: FocusMonitor,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this._onTouched();
      this.touched = true;
      this.stateChanges.next();
    });
  }

  public ngDoCheck(): void {
    if (this.ngControl != null && this.touched !== this.ngControl.touched) {
      this.touched = this.ngControl.touched === true;
      this.stateChanges.next();
    }
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    if (this._input) {
      this.fm.stopMonitoring(this._input.nativeElement);
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(value: string): void {
    this._value = value;
    this.updateInputValue();
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  public registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  @HostBinding('attr.aria-describedby')
  public describedBy = '';

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  public onContainerClick(_event: MouseEvent): void {
    if (this._input) {
      this._input.nativeElement.focus();
    }
  }

  public onAutocompleteInputSelect(event: MatAutocompleteSelectedEvent): void {
    this.value = event.option.value;
  }

  public onInputChange(value: string): void {
    this.inputValue = value;
  }

  public getDisplayValue(value: string): string {
    if (this.displayWith) {
      return this.displayWith(value);
    }
    return value;
  }

  private updateInputValue(): void {
    if (this._value) {
      this.inputValue = this.getDisplayValue(this._value);
    } else {
      this.inputValue = '';
    }
  }

  private initAutocomplete(): void {
    if (this._autocompleteInputOptions && this._input?.nativeElement) {
      this.autocompleteInputFilteredOptions$ = fromEvent(this._input.nativeElement, 'input').pipe(
        startWith(''),
        debounceTime(300),
        tap(() => {
          this.loading = true;
        }),
        switchMap(() => {
          const searchValue = this._input?.nativeElement.value ?? '';
          if (typeof this._autocompleteInputOptions === 'function') {
            return this._autocompleteInputOptions(searchValue).pipe(map(options => sanitizeAutocompleteOptions(options)));
          }
          return of(defaultAutocompleteFilter(this._autocompleteInputOptions ?? [], searchValue));
        }),
        tap(() => {
          this.loading = false;
        }),
        distinctUntilChanged(),
      );
      this.changeDetectorRef.detectChanges();
    }
  }
}

const defaultAutocompleteFilter = (
  options: AutocompleteInputOptions,
  search: string,
): {
  groupLabel?: string;
  groupOptions: { value: string; label: string }[];
}[] => {
  const optionsFilter = (options: { value: string; label: string }[], search: string) => {
    return options.filter(
      option =>
        option.label.toLowerCase().includes((search ?? '').toLowerCase()) ||
        option.value.toLowerCase().includes((search ?? '').toLowerCase()),
    );
  };

  return sanitizeAutocompleteOptions(options)
    .map(group => ({
      groupLabel: group.groupLabel,
      groupOptions: optionsFilter(group.groupOptions, search),
    }))
    .filter(group => group.groupOptions.length > 0);
};

const sanitizeAutocompleteOptions = (
  options: AutocompleteInputOptions,
): {
  groupLabel?: string;
  groupOptions: { value: string; label: string }[];
}[] => {
  const sanitizeFlatOptions = (flatOptions: AutocompleteInputOptionsFlat): { value: string; label: string }[] =>
    flatOptions.map(option => {
      if (option && typeof option !== 'string' && 'value' in option && 'label' in option) {
        return option;
      }
      return { value: option, label: option };
    });

  if (
    Array.isArray(options) &&
    (options.length === 0 || typeof options[0] === 'string' || ('value' in options[0] && 'label' in options[0]))
  ) {
    const optionsFlat = options as AutocompleteInputOptionsFlat;
    return [
      {
        groupOptions: sanitizeFlatOptions(optionsFlat),
      },
    ];
  } else {
    const optionsGrouped = options as AutocompleteInputOptionsGroup;
    return optionsGrouped.map(group => ({
      groupLabel: group.groupLabel,
      groupOptions: sanitizeFlatOptions(group.groupOptions),
    }));
  }
};
