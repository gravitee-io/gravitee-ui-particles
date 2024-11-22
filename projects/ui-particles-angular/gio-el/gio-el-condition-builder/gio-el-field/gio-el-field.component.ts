/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  inject,
  DestroyRef,
  HostBinding,
  Optional,
  Self,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { isEmpty, toString } from 'lodash';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { GioIconsModule } from '@gravitee/ui-particles-angular';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';

import { ConditionModel } from '../../models/ConditionModel';
import { ConditionsModel, isConditionModel, ParentConditionModel } from '../../models/ConditionsModel';

type FieldAutocompleteOption = ConditionModel;

type FieldAutocompleteGroup = {
  field: string;
  label: string;
  options: FieldAutocompleteOption[];
};

type FieldAutocompleteModel = (FieldAutocompleteOption | FieldAutocompleteGroup)[];

type Key1AutocompleteValue = { value: string; label: string };

@Component({
  selector: 'gio-el-field',
  imports: [CommonModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, MatButtonModule, GioIconsModule],
  templateUrl: './gio-el-field.component.html',
  styleUrl: './gio-el-field.component.scss',
  providers: [{ provide: MatFormFieldControl, useExisting: GioElFieldComponent }],
})
export class GioElFieldComponent implements OnChanges, MatFormFieldControl<ConditionModel>, ControlValueAccessor, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true })
  public conditionsModel: ConditionsModel = [];

  protected fieldFilteredOptions$ = new Observable<FieldAutocompleteModel>();
  protected key1FilteredOptions$ = new Observable<Key1AutocompleteValue[]>();

  protected selectedConditionModel: ConditionModel | null = null;

  protected fieldFormControl = new FormControl<ConditionModel | null>(null);
  protected key1FormControl = new FormControl<string | null>(null);
  protected key2FormControl = new FormControl<string | null>(null);

  // From MatFormFieldControl
  public set value(_value: ConditionModel | null) {
    // Not implemented. Only for select new value.
  }

  // From MatFormFieldControl
  public stateChanges = new Subject<void>();

  // From MatFormFieldControl
  public static nextId = 0;
  @HostBinding()
  public id = `gio-el-field-${GioElFieldComponent.nextId++}`;

  // From MatFormFieldControl
  @Input()
  public get placeholder() {
    return this._placeholder;
  }
  public set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string = '';

  // From MatFormFieldControl
  public focused = false;

  // From MatFormFieldControl
  public get empty() {
    return !this.fieldFormControl.value;
  }

  // From MatFormFieldControl
  @HostBinding('class.floating')
  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  // From MatFormFieldControl
  @Input()
  public get required() {
    return this._required;
  }
  public set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  // From MatFormFieldControl
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.fieldFormControl.disable() : this.fieldFormControl.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  public touched = false;

  // From MatFormFieldControl
  public get errorState(): boolean {
    return this.fieldFormControl.invalid && this.touched;
  }

  // From MatFormFieldControl
  public controlType = 'gio-el-field';

  // From MatFormFieldControl
  @HostBinding('attr.aria-describedBy')
  public userAriaDescribedBy?: string | undefined;

  // From MatFormFieldControl
  public setDescribedByIds(ids: string[]): void {
    this.userAriaDescribedBy = ids.join(' ');
  }

  // From MatFormFieldControl
  // disableAutomaticLabeling?: boolean | undefined;

  protected _onChange: (_value: ConditionModel | null) => void = () => ({});
  protected _onTouched: () => void = () => ({});

  constructor(
    @Optional() @Self() public readonly ngControl: NgControl,
    private elementRef: ElementRef<HTMLElement>,
    private focusMonitor: FocusMonitor,
  ) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.focusMonitor
      .monitor(this.elementRef.nativeElement, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(origin => {
        this.focused = !!origin;

        this.touched = true;
        this._onTouched();
        this.stateChanges.next();
      });
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.conditionsModel) {
      const flattenConditionsModelToOption = (
        conditions: ConditionsModel,
        parent: ParentConditionModel | null = null,
      ): FieldAutocompleteOption[] => {
        return conditions.flatMap(condition => {
          if (isConditionModel(condition)) {
            return {
              ...condition,
              label: parent ? `${parent.label} > ${condition.label}` : condition.label,
              field: parent ? `${parent.field}.${condition.field}` : condition.field,
            } satisfies FieldAutocompleteOption;
          }
          return flattenConditionsModelToOption(condition.conditions, {
            ...condition,
            field: parent ? `${parent.field}.${condition.field}` : condition.field,
            label: parent ? `${parent.label} > ${condition.label}` : condition.label,
          });
        });
      };

      const autocompleteModel: FieldAutocompleteModel = this.conditionsModel.map(conditionModel => {
        if (isConditionModel(conditionModel)) {
          return {
            ...conditionModel,
          } satisfies FieldAutocompleteOption;
        }
        return {
          field: conditionModel.field,
          label: conditionModel.label,
          options: flattenConditionsModelToOption(conditionModel.conditions).map(conditions => ({
            ...conditions,
            field: `${conditionModel.field}.${conditions.field}`,
          })),
        } satisfies FieldAutocompleteGroup;
      });

      if (autocompleteModel && !isEmpty(autocompleteModel)) {
        this.fieldFilteredOptions$ = this.fieldFormControl.valueChanges.pipe(
          takeUntilDestroyed(this.destroyRef),
          startWith(''),
          map(value => fieldFilterValues(autocompleteModel, toString(value) ?? '')),
        );
      }

      combineLatest([
        this.fieldFormControl.valueChanges,
        this.key1FormControl.valueChanges.pipe(startWith(this.key1FormControl.value)),
        this.key2FormControl.valueChanges.pipe(startWith(this.key1FormControl.value)),
      ])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([fieldValue, key1Value, key2Value]) => {
          let map = fieldValue?.map;
          if (map?.type === 'Map') {
            map = { ...map, key1Value };
          }
          if (map?.type === 'MultiMap') {
            map = { ...map, key1Value, key2Value };
          }

          if (fieldValue && isConditionModel(fieldValue)) {
            this._onChange({
              ...fieldValue,
              map,
            });
          } else {
            this._onChange(null);
          }
          this.stateChanges.next();
        });
    }
  }

  public displayFn(option: FieldAutocompleteOption | FieldAutocompleteGroup): string {
    return option?.field;
  }

  public onFieldSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedConditionModel = $event.option.value;

    const key1AutocompleteValues = this.selectedConditionModel?.map?.key1Values?.map(value =>
      typeof value === 'string' ? { value, label: value } : value,
    );

    if (key1AutocompleteValues && !isEmpty(key1AutocompleteValues)) {
      this.key1FilteredOptions$ = this.key1FormControl.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(''),
        map(value => key1FilterValues(key1AutocompleteValues, toString(value) ?? '')),
      );
    }
  }

  // From ControlValueAccessor interface
  public writeValue(): void {
    // Not implemented. Only for select new value.
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value: ConditionModel | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.fieldFormControl.disable();
    } else {
      this.fieldFormControl.enable();
    }
  }

  // From ControlValueAccessor interface
  public onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elementRef.nativeElement.querySelector('input')?.focus();
    }
  }

  public ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}

const fieldFilterValues = (autocompleteModel: FieldAutocompleteModel, value: string) => {
  const filterValue = value.toLowerCase();
  return autocompleteModel.filter(option => {
    if ('options' in option) {
      return option.options.filter(condition => condition.label.toLowerCase().includes(filterValue));
    }
    return option.label.toLowerCase().includes(filterValue);
  });
};

const key1FilterValues = (values: Key1AutocompleteValue[], value: string) => {
  const filterValue = value.toLowerCase();
  return values.filter(option => option.label.toLowerCase().includes(filterValue) || option.value.toLowerCase().includes(filterValue));
};
