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
import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

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
export class GioSaveBarComponent implements OnDestroy {
  public isSubmitted = false;

  @HostBinding('class.save-bar-sticky')
  public get isSticky(): boolean {
    return !this.creationMode;
  }

  @Input()
  public opened = false;

  /**
   * When true, the submit button have invalidate display
   * And on submit clicked the output event is emit on submitInvalidState (and not on submit)
   */
  @Input()
  public invalidState?: boolean = false;

  @Input()
  public creationMode = false;

  @Input()
  public form?: FormGroup;

  private hasSubmitLock = true;
  private submitLockSubscription?: Subscription;

  @Input()
  public formInitialValues?: unknown;

  @Input()
  public hideSubmitButton = false;

  @Input()
  public hideDiscardButton = false;

  @Output()
  public resetClicked = new EventEmitter<void>();

  @Output()
  public submitted = new EventEmitter<void>();

  @Output()
  public submittedInvalidState = new EventEmitter();

  @HostBinding('class.is-open')
  public get isOpen(): boolean {
    if (this.creationMode) {
      return true;
    }

    if (this.form) {
      return this.form.dirty;
    }
    return this.opened;
  }

  public ngOnDestroy() {
    this.submitLockSubscription?.unsubscribe();
  }

  public onResetClicked(): void {
    if (this.form) {
      this.form.reset(this.formInitialValues);
      this.form.markAsPristine();
    }
    this.resetClicked.emit();
  }

  @HostListener('disable-submit-lock')
  public onDisableSubmitLock(): void {
    this.hasSubmitLock = false;
  }

  public onSubmitClicked(): void {
    if ((this.form && this.form.invalid) || this.invalidState) {
      this.form?.markAllAsTouched();
      this.submittedInvalidState.emit();
      return;
    }

    if (this.isSubmitted) {
      return;
    }

    this.submitted.emit();
    if (this.hasSubmitLock) {
      this.submitLockSubscription = of(undefined)
        .pipe(
          // Arrange js microtask queue to be sure that the disabled button state is set after triggering the ngSubmit event
          delay(0),
          tap(() => (this.isSubmitted = true)),
          delay(2000),
          tap(() => (this.isSubmitted = false)),
        )
        .subscribe();
    }
  }
}
