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
import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GIO_FORM_SELECTION_INLINE_STATE, GioFormSelectionInlineState } from './gio-form-selection-inline-state.token';

@Component({
  selector: 'gio-form-selection-inline',
  templateUrl: './gio-form-selection-inline.component.html',
  styleUrls: ['./gio-form-selection-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GioFormSelectionInlineComponent),
    },
    {
      provide: GIO_FORM_SELECTION_INLINE_STATE,
      useFactory: (component: GioFormSelectionInlineComponent) => component.getState(),
      deps: [forwardRef(() => GioFormSelectionInlineComponent)],
    },
  ],
  standalone: false,
})
export class GioFormSelectionInlineComponent implements ControlValueAccessor {
  private readonly _disabled = signal<boolean>(false);
  private readonly _selection = signal<string | undefined>(undefined);

  private _onChange: (value?: string) => void = () => ({});

  private _onTouched: () => void = () => ({});

  constructor() {}

  // Expose state for injection token
  public getState(): GioFormSelectionInlineState {
    return {
      disabled: this._disabled.asReadonly(),
      selectedValue: this._selection.asReadonly(),
      onCardSelect: (value?: string) => {
        if (!this._disabled()) {
          this.updateCardsSelection(value);
        }
      },
    };
  }

  // From ControlValueAccessor interface
  public writeValue(value: string): void {
    this._selection.set(value);
    this.updateCardsSelection(value);
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value?: string) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  private updateCardsSelection(value?: string) {
    this._selection.set(value);
    this._onChange(this._selection());
    this._onTouched();
  }
}
