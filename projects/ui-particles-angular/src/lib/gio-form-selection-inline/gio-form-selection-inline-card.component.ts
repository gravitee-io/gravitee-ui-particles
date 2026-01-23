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
import { Component, HostBinding, HostListener, Input, inject, computed, ChangeDetectionStrategy } from '@angular/core';

import { GIO_FORM_SELECTION_INLINE_STATE } from './gio-form-selection-inline-state.token';

@Component({
  selector: 'gio-form-selection-inline-card',
  template: `
    <div matRipple [matRippleDisabled]="_disabled" class="card" [class.selected]="_selected" [class.disabled]="_disabled">
      <span class="selection-icon">
        @if (lock) {
          <mat-icon class="selection-icon__lock-icon" svgIcon="gio:lock"></mat-icon>
        }
        <mat-icon class="selection-icon__radio-icon">{{ _selected ? 'radio_button_checked' : 'radio_button_unchecked' }}</mat-icon>
      </span>

      <div class="card__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./gio-form-selection-inline-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioFormSelectionInlineCardComponent {
  @Input()
  public value?: string;

  @Input()
  public lock: boolean = false;

  @Input()
  public disabled: boolean = false;

  private readonly parentState = inject(GIO_FORM_SELECTION_INLINE_STATE, { optional: true });

  @HostBinding('attr.value')
  public get valueAttr() {
    return this.value ?? null;
  }

  @HostBinding('class.disabled')
  public get _disabled() {
    return this._disabledState();
  }

  @HostBinding('class.selected')
  public get _selected(): boolean {
    return this._selectedState();
  }

  private readonly _disabledState = computed(() => {
    const parentDisabled = this.parentState?.disabled() ?? false;
    return this.disabled || parentDisabled || this.lock;
  });

  private readonly _selectedState = computed(() => {
    if (!this.parentState) {
      return false;
    }
    return this.value === this.parentState.selectedValue();
  });

  public onSelectFn?: (value?: string) => void;

  constructor() {}

  @HostListener('click')
  public onSelectCard() {
    if (!this._disabled && !this.lock) {
      // Use injected callback if available, otherwise fall back to onSelectFn
      if (this.parentState) {
        this.parentState.onCardSelect(this.value);
      } else if (this.onSelectFn) {
        this.onSelectFn(this.value);
      }
    }
  }
}
