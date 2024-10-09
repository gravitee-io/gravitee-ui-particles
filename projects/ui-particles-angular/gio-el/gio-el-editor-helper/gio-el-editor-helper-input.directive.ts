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
import { DestroyRef, Directive, inject, Input, Optional, Self, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GioElEditorHelperToggleComponent } from './gio-el-editor-helper-toggle.component';

@Directive({
  selector: 'input[gioElEditorHelper], gio-el-editor-input[gioElEditorHelper]',
  standalone: true,
  providers: [],
})
export class GioElEditorHelperInputDirective implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private disabled = false;

  private gioElEditorHelperToggleComponent?: GioElEditorHelperToggleComponent;

  @Input()
  public set gioElEditorHelper(gioElEditorHelperToggleComponent: GioElEditorHelperToggleComponent) {
    this.gioElEditorHelperToggleComponent = gioElEditorHelperToggleComponent;
    gioElEditorHelperToggleComponent.setDisabledState(this.disabled);

    gioElEditorHelperToggleComponent.elValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.control?.control?.setValue(value);
    });
  }

  constructor(@Self() @Optional() private control: NgControl) {}

  public ngOnInit() {
    this.control.control?.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(status => {
      this.disabled = status !== 'VALID';
      this.gioElEditorHelperToggleComponent?.setDisabledState(this.disabled);
    });
  }
}
