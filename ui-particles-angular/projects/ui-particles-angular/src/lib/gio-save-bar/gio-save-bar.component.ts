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
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'gio-save-bar',
  templateUrl: './gio-save-bar.component.html',
  styleUrls: ['./gio-save-bar.component.scss'],
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ transform: 'translateY(40vh)', opacity: '0' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: '1' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: '1' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ transform: 'translateY(40vh)', opacity: '0' })),
      ]),
    ]),
  ],
})
export class GioSaveBarComponent {
  @Input()
  opened = false;

  /**
   * When true, the submit button have invalidate display
   * And on submit clicked the output event is emit on submitInvalidState (and not on submit)
   */
  @Input()
  invalidState?: boolean = false;

  @Input()
  creationMode = false;

  @Input()
  form?: FormGroup;

  @Input()
  formInitialValues?: unknown;

  @Output()
  resetClicked = new EventEmitter<void>();

  @Output()
  submitted = new EventEmitter<void>();

  @Output()
  submittedInvalidState = new EventEmitter();

  isOpen() {
    if (this.creationMode) {
      return true;
    }

    if (this.form) {
      return this.form.dirty;
    }
    return this.opened;
  }

  onResetClicked(): void {
    if (this.form) {
      this.form.reset(this.formInitialValues);
      this.form.markAsPristine();
    }
    this.resetClicked.emit();
  }

  onSubmitClicked(): void {
    if ((this.form && this.form.invalid) || this.invalidState) {
      this.form?.markAllAsTouched();
      this.submittedInvalidState.emit();
      return;
    }

    this.submitted.emit();
  }
}
