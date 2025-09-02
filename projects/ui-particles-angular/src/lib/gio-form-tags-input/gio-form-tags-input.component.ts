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
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { isEmpty } from 'lodash';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';

export type Tags = Array<string>;

export type AutocompleteOptions = (string | { value: string; label: string })[];

export type DisplayValueWithFn = (value: string) => Observable<string>;

@Component({
  selector: 'gio-form-tags-input',
  templateUrl: './gio-form-tags-input.component.html',
  styleUrls: ['./gio-form-tags-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: GioFormTagsInputComponent,
    },
  ],
  standalone: false,
})
export class GioFormTagsInputComponent implements MatFormFieldControl<Tags>, ControlValueAccessor, DoCheck, OnDestroy {
  private static nextId = 0;

  public _onChange: (_tags: Tags | null) => void = () => ({});

  public _onTouched: () => void = () => ({});
  private touched = false;

  @Input('aria-label')
  public ariaLabel = '';

  @Input()
  public addOnBlur = true;

  /**
   * Function called each time a tag is added, it can be used to hook inside the
   * addition process to, for instance, have custom validation in the components
   * using `gio-form-tags-input`.
   *
   * Parameters are:
   * - `tag`: The value of the tag to add
   * - `validationCb`: The callback function to call when validation is done. If
   * called with `true` it will add the tag, otherwise it will just ignore it
   */
  @Input()
  public tagValidationHook: ((tag: string, validationCb: (shouldAddTag: boolean) => void) => void) | undefined = undefined;

  @Input()
  public set autocompleteOptions(v: AutocompleteOptions | ((search: string) => Observable<AutocompleteOptions>) | undefined) {
    this._autocompleteOptions = v;
  }

  @Output()
  public tagClicked = new EventEmitter<string>();

  public _autocompleteOptions?: AutocompleteOptions | ((search: string) => Observable<AutocompleteOptions>);

  /**
   * Get the label of an option value.
   * To use with autocompleteOptions label & value mode.
   * Function called each time a tag needs to be displayed id defined.
   */
  @Input()
  public set displayValueWith(displayValueWith: DisplayValueWithFn) {
    this._displayValueWith = (value: string) => {
      if (this.displayValueCache[value]) {
        return of(this.displayValueCache[value]);
      }
      return displayValueWith(value).pipe(
        tap(label => {
          this.displayValueCache[value] = label;
        }),
      );
    };
  }

  /**
   * Set to true to force the chip to be part of the autocomplete options.
   */
  @Input()
  public useAutocompleteOptionValueOnly = false;

  @ViewChild('tagInput')
  public set tagInput(v: ElementRef<HTMLInputElement> | null) {
    if (v) {
      this.fm.monitor(v.nativeElement).subscribe(origin => {
        if (origin) {
          this.initAutocomplete();
        }
      });
    } else if (this._tagInput) {
      this.fm.stopMonitoring(this._tagInput.nativeElement);
    }

    this._tagInput = v;
  }
  private _tagInput: ElementRef<HTMLInputElement> | null = null;

  public autocompleteFilteredOptions$?: Observable<Record<string, string>[]>;

  public _displayValueWith?: (value: string) => Observable<string>;

  private displayValueCache: Record<string, string> = {};

  public loading = false;

  // From MatFormFieldControl interface
  public get value(): Tags | null {
    return this._value;
  }

  public set value(_tags: Tags | null) {
    this._value = _tags;
    this._onChange(_tags);
    this.stateChanges.next();
  }

  private _value: Tags | null = null;

  // From MatFormFieldControl interface
  public stateChanges = new Subject<void>();

  // From MatFormFieldControl interface
  @HostBinding('id')
  public id = `gio-form-tags-input-${GioFormTagsInputComponent.nextId++}`;

  // From MatFormFieldControl interface
  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }

  public set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _placeholder = '';

  // From MatFormFieldControl interface
  public focused = false;

  // From MatFormFieldControl interface
  public get empty(): boolean {
    return isEmpty(this.value) && isEmpty(this._tagInput?.nativeElement?.value);
  }

  // From MatFormFieldControl interface
  @HostBinding('class.floating')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  // From MatFormFieldControl interface
  @Input()
  public get required(): boolean {
    return this._required;
  }

  public set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  // From MatFormFieldControl interface
  @Input()
  public get disabled(): boolean {
    return this._disabled || (this.ngControl && this.ngControl.disabled === true);
  }

  public set disabled(dis: boolean) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  private _disabled = false;

  // From MatFormFieldControl interface
  public get errorState(): boolean {
    return (
      this.touched &&
      // if required check if is empty
      ((this.required && this.empty) ||
        // if there is a touched control check if there is an error
        (this.ngControl && this.ngControl.touched === true && !!this.ngControl.errors))
    );
  }

  // From MatFormFieldControl interface
  public controlType?: string;

  // From MatFormFieldControl interface
  public autofilled?: boolean;

  // From MatFormFieldControl interface
  public userAriaDescribedBy?: string;

  constructor(
    // From ControlValueAccessor interface
    @Optional() @Self() public readonly ngControl: NgControl,
    private readonly elRef: ElementRef,
    private readonly fm: FocusMonitor,
    private changeDetectorRef: ChangeDetectorRef,
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
      this.stateChanges.next();
    });
  }

  public ngDoCheck(): void {
    // sync control touched with local touched
    if (this.ngControl != null && this.touched !== this.ngControl.touched) {
      this.touched = this.ngControl.touched === true;
      this.stateChanges.next();
    }
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    if (this._tagInput) {
      this.fm.stopMonitoring(this._tagInput.nativeElement);
    }
  }

  // From ControlValueAccess interface
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // From ControlValueAccessor interface
  public writeValue(value: string[]): void {
    this._value = value;
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (tags: Tags | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From MatFormFieldControl interface
  @HostBinding('attr.aria-describedby')
  public describedBy = '';

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  // From MatFormFieldControl interface
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public onContainerClick(_event: MouseEvent): void {}

  public addChipToFormControl(event: { value: string }): void {
    const input = this._tagInput?.nativeElement;
    const tagToAdd = (event.value ?? '').trim();

    if (isEmpty(tagToAdd)) {
      return;
    }

    // Add the tag only if shouldAddTag in validationCb return true
    // Set default callback if not defined
    const tagValidationHook = this.tagValidationHook ?? ((_, validationCb) => validationCb(true));

    const validationCb = (shouldAddTag: boolean) => {
      // Add new Tag in form control
      if (shouldAddTag) {
        // Delete Tag if already existing
        const formControlValue = [...(this.value ?? [])].filter(v => v !== tagToAdd);

        this.value = [...formControlValue, tagToAdd];
      }
    };

    // Reset the input value
    if (input) {
      input.value = '';
    }

    tagValidationHook(tagToAdd, validationCb);
  }

  public removeChipToFormControl(tag: string): void {
    this.value = [...(this.value ?? [])].filter(v => v !== tag);
    this.changeDetectorRef.detectChanges();
  }

  public onAutocompleteSelect(event: MatAutocompleteSelectedEvent): void {
    this.addChipToFormControl({ value: event.option.value });
  }

  public onMatChipTokenEnd(): void {
    if (this.useAutocompleteOptionValueOnly) {
      return;
    }
    // Give priority to the `onAutocompleteSelect` when validating with the blur event
    this.addChipToFormControl({ value: this._tagInput?.nativeElement.value ?? '' });
  }

  private initAutocomplete(): void {
    if (this._autocompleteOptions && this._tagInput?.nativeElement) {
      this.autocompleteFilteredOptions$ = fromEvent(this._tagInput.nativeElement, 'keyup').pipe(
        startWith([] as string[]),
        tap(() => {
          this.loading = true;
        }),
        switchMap(() => {
          if (typeof this._autocompleteOptions === 'function') {
            return this._autocompleteOptions(this._tagInput?.nativeElement.value ?? '').pipe(
              map(options => sanitizeAutocompleteOptions(options)),
              // Add options to displayValueCache to avoid call on select
              tap(options => {
                options.forEach(option => {
                  this.displayValueCache[option.value] = option.label;
                });
              }),
            );
          }
          return of(defaultAutocompleteFilter(this._autocompleteOptions ?? [], this._tagInput?.nativeElement.value ?? ''));
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
  options: AutocompleteOptions,
  search: string,
): {
  value: string;
  label: string;
}[] => {
  return sanitizeAutocompleteOptions(options).filter(
    defaultHeader =>
      defaultHeader.label.toLowerCase().includes((search ?? '').toLowerCase()) ||
      defaultHeader.value.toLowerCase().includes((search ?? '').toLowerCase()),
  );
};

const sanitizeAutocompleteOptions = (
  options: AutocompleteOptions,
): {
  value: string;
  label: string;
}[] => {
  return options.map(option => {
    if (option && typeof option !== 'string' && 'value' in option && 'label' in option) {
      return option;
    }
    return { value: option, label: option };
  });
};
