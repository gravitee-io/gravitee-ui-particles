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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, Input } from '@angular/core';

@Component({
  selector: 'gio-form-selection-inline-card',
  template: `
    <div matRipple [matRippleDisabled]="_disabled" class="card" [class.selected]="selected" [class.disabled]="_disabled">
      <span class="selection-icon">
        @if (lock) {
          <mat-icon class="selection-icon__lock-icon" svgIcon="gio:lock"></mat-icon>
        }
        <mat-icon class="selection-icon__radio-icon">{{ selected ? 'radio_button_checked' : 'radio_button_unchecked' }}</mat-icon>
      </span>

      <div class="card__content"><ng-content></ng-content></div>
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

  @HostBinding('class.disabled')
  public get _disabled() {
    return this.disabled || this._parendDisabled || this.lock;
  }

  @HostBinding('class.selected')
  public selected = false;

  public _parendDisabled = false;

  public onSelectFn?: (value?: string) => void;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  @HostListener('click')
  public onSelectCard() {
    if (!this._disabled && !this.lock) {
      this.selected = !this.selected;

      if (this.onSelectFn) {
        this.onSelectFn(this.value);
      }
    }
  }

  public _markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }
}
