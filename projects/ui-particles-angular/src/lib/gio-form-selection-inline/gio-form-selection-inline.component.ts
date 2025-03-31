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
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  forwardRef,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GioFormSelectionInlineCardComponent } from './gio-form-selection-inline-card.component';

@Component({
  selector: 'gio-form-selection-inline',
  templateUrl: './gio-form-selection-inline.component.html',
  styleUrls: ['./gio-form-selection-inline.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GioFormSelectionInlineComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioFormSelectionInlineComponent implements ControlValueAccessor, AfterContentInit {
  @ContentChildren(forwardRef(() => GioFormSelectionInlineCardComponent), { descendants: true })
  private selectCardsList?: QueryList<GioFormSelectionInlineCardComponent>;

  public selection?: string;

  public disabled = false;

  private _onChange: (value?: string) => void = () => ({});

  private _onTouched: () => void = () => ({});

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterContentInit() {
    this.selectCardsList?.forEach(card => {
      card._parendDisabled = this.disabled;

      if (card.value === this.selection) {
        card.selected = true;

        this.changeDetector.markForCheck();
      }

      card.onSelectFn = value => {
        if (!this.disabled) {
          this.updateCardsSelection(value);
        }
      };
      card._markForCheck();
    });
  }

  // From ControlValueAccessor interface
  public writeValue(value: string): void {
    this.selection = value;
    this.updateCardsSelection(value);
    this.changeDetector.markForCheck();
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
    this.disabled = isDisabled;
    if (this.selectCardsList) {
      this.selectCardsList.forEach(card => {
        card._parendDisabled = this.disabled;
        card._markForCheck();
      });
    }
    this.changeDetector.markForCheck();
  }

  private updateCardsSelection(value?: string) {
    if (this.selectCardsList) {
      this.selectCardsList.forEach(card => {
        const newSelectedValue = card.value === value;

        if (newSelectedValue !== card.selected) {
          card.selected = card.value === value;
          card._markForCheck();
        }
      });

      this.selection = value;
      this._onChange(this.selection);
      this._onTouched();
    }
  }
}
