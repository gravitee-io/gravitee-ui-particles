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
import { Directive, HostListener, Renderer2, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: 'form[gioFormFocusInvalid]',
})
export class GioFormFocusInvalidDirective {
  constructor(private readonly renderer: Renderer2, @Optional() protected readonly formGroupDirective: FormGroupDirective) {}

  @HostListener('submit')
  public onFormSubmit() {
    const selector = '.ng-invalid[formControlName],input.ng-invalid,mat-select.ng-invalid,textarea.ng-invalid,.gio-ng-invalid';
    try {
      let invalidControl = this.renderer.selectRootElement(selector, true);

      // If the form is a GioFormJsonSchema, we need to focus the first invalid control inside
      if (invalidControl.tagName === 'GIO-FORM-JSON-SCHEMA') {
        invalidControl = invalidControl.querySelector(selector);
      }

      if (invalidControl) {
        // Mark all controls as touched to display errors
        if (this.formGroupDirective) {
          this.formGroupDirective.control.markAllAsTouched();
          this.formGroupDirective.control.updateValueAndValidity();
        }

        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus({ preventScroll: true });
      }
    } catch (error) {
      // Best effort. If the focus doesn't work it's not very important
      // 🧪 Useful to avoid som error in tests
    }
  }
}
