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
import { DestroyRef, Directive, inject, Input, Optional, Self, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { GioElEditorHelperToggleComponent } from './gio-el-editor-helper-toggle.component';

@Directive({
  selector:
    'input[gioElEditorHelper],textarea[gioElEditorHelper], gio-el-editor-input[gioElEditorHelper], gio-el-editor-helper-toggle[gioElEditorHelper]',
  standalone: true,
  providers: [],
})
export class GioElEditorHelperInputDirective implements OnInit, OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  private disabled = false;

  private gioElEditorHelperToggleComponent?: GioElEditorHelperToggleComponent;
  private statusChangesSubscription?: Subscription;

  @Input()
  public set gioElEditorHelper(gioElEditorHelperToggleComponent: GioElEditorHelperToggleComponent) {
    // this.gioElEditorHelperToggleComponent = gioElEditorHelperToggleComponent;
    gioElEditorHelperToggleComponent.setDisabledState(this.disabled);
    gioElEditorHelperToggleComponent.elValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      // Todo: Maybe for textarea (and why not input) it's better to find a way to add new value a the cursor position
      // Or add an option to this directive to allow this behavior
      this.getControl()?.setValue(value);
    });
  }

  @Input()
  public control: AbstractControl | undefined;

  constructor(@Self() @Optional() private ngControl: NgControl) {}

  public ngOnInit() {
    this.statusChangesSubscription = this.getControl()
      ?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => {
        this.disabled = status !== 'VALID';
        this.gioElEditorHelperToggleComponent?.setDisabledState(this.disabled);
      });

    if (this.getControl()?.disabled) {
      this.disabled = true;
      this.gioElEditorHelperToggleComponent?.setDisabledState(true);
    }
  }

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges?.control?.currentValue) {
      // this.statusChangesSubscription?.unsubscribe();

      this.ngOnInit();
    }
  }

  private getControl(): AbstractControl | undefined {
    if (this.ngControl && this.ngControl.control) {
      return this.ngControl.control;
    }
    if (this.control) {
      return this.control;
    }
    return undefined;
  }
}
