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
import { ChangeDetectorRef, Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { isEmpty } from 'lodash';
import { fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

export type Tags = Array<string>;

@Component({
  selector: 'gio-form-tags-input',
  templateUrl: './gio-form-tags-input.component.html',
  styleUrls: ['./gio-form-tags-input.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: GioFormTagsInputComponent,
    },
  ],
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
  public set autocompleteOptions(v: string[] | undefined) {
    this._autocompleteOptions = v;
    this.initAutocomplete();
  }
  public _autocompleteOptions?: string[];

  @ViewChild('tagInput')
  public set tagInput(v: ElementRef<HTMLInputElement> | null) {
    this._tagInput = v;
    this.initAutocomplete();
  }
  private _tagInput: ElementRef<HTMLInputElement> | null = null;

  // From ControlValueAccessor interface
  public get value(): Tags | null {
    return this._value;
  }

  public set value(_tags: Tags | null) {
    this._value = _tags;
    this._onChange(_tags);
    this.stateChanges.next();
  }

  private _value: Tags | null = null;

  // From ControlValueAccessor interface
  public stateChanges = new Subject<void>();

  // From ControlValueAccessor interface
  @HostBinding('id')
  public id = `gio-form-tags-input-${GioFormTagsInputComponent.nextId++}`;

  // From ControlValueAccessor interface
  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }

  public set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _placeholder = '';

  public autocompleteFilteredOptions$?: Observable<string[]>;

  // From ControlValueAccessor interface
  public focused = false;

  // From ControlValueAccessor interface
  public get empty(): boolean {
    return isEmpty(this.value) && isEmpty(this._tagInput?.nativeElement?.value);
  }

  // From ControlValueAccessor interface
  @HostBinding('class.floating')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  // From ControlValueAccessor interface
  @Input()
  public get required(): boolean {
    return this._required;
  }

  public set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _required = false;

  // From ControlValueAccessor interface
  @Input()
  public get disabled(): boolean {
    return this._disabled || (this.ngControl && this.ngControl.disabled === true);
  }

  public set disabled(dis: boolean) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  private _disabled = false;

  // From ControlValueAccessor interface
  public get errorState(): boolean {
    return (
      this.touched &&
      // if required check if is empty
      ((this.required && this.empty) ||
        // if there is a touched control check if there is an error
        (this.ngControl && this.ngControl.touched === true && !!this.ngControl.errors))
    );
  }

  // From ControlValueAccessor interface
  public controlType?: string;

  // From ControlValueAccessor interface
  public autofilled?: boolean;

  // From ControlValueAccessor interface
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
  }

  // From ControlValueAccessor interface
  public writeValue(value: string[]): void {
    this._value = value;
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (tags: Tags | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  @HostBinding('attr.aria-describedby')
  public describedBy = '';

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  // From ControlValueAccessor interface
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
    // Give priority to the `onAutocompleteSelect` when validating with the blur event
    setTimeout(() => {
      this.addChipToFormControl({ value: this._tagInput?.nativeElement.value ?? '' });
    }, 100);
  }

  private initAutocomplete(): void {
    if (this._autocompleteOptions && this._tagInput?.nativeElement) {
      this.autocompleteFilteredOptions$ = fromEvent(this._tagInput.nativeElement, 'keyup').pipe(
        startWith([] as string[]),
        map(() => {
          return (this._autocompleteOptions ?? []).filter(defaultHeader =>
            defaultHeader.toLowerCase().includes((this._tagInput?.nativeElement.value ?? '').toLowerCase()),
          );
        }),
        distinctUntilChanged(),
      );
      this.changeDetectorRef.detectChanges();
    }
  }
}
