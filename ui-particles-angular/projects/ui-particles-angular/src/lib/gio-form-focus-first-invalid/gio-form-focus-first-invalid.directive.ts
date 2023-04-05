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
import { Directive, HostListener, Optional, ElementRef } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

import { GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR } from './gio-form-focus-first-invalid-ignore.directive';

@Directive()
export class GioBaseFormFocusInvalidDirective {
  constructor(private readonly hostElement: ElementRef, @Optional() protected readonly formGroupDirective: FormGroupDirective) {}

  protected focusOnFirstInvalid() {
    const selector = '.ng-invalid[formControlName],input.ng-invalid,mat-select.ng-invalid,textarea.ng-invalid,.gio-ng-invalid';

    try {
      // Mark all controls as touched to display errors
      if (this.formGroupDirective) {
        this.formGroupDirective.control.markAllAsTouched();
        this.formGroupDirective.control.updateValueAndValidity();
      }

      const parentForm = (this.hostElement.nativeElement as Element).closest('form');
      const invalidFieldElements = parentForm?.querySelectorAll<HTMLElement>(selector);
      const invalidControl = this.getFirstInvalidControl(invalidFieldElements);

      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus({ preventScroll: true });
      }
    } catch (error) {
      // Best effort. If the focus doesn't work it's not very important
      // 🧪 Useful to avoid som error in tests
    }
  }

  private getFirstInvalidControl(invalidFieldElements: NodeListOf<HTMLElement> | undefined, index = 0): HTMLElement | undefined {
    let invalidControl = invalidFieldElements?.item(index);
    const hasIgnoreAttribute = (invalidControl as HTMLInputElement)?.attributes?.getNamedItem(GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR);
    if (hasIgnoreAttribute) {
      invalidControl = this.getFirstInvalidControl(invalidFieldElements, index + 1);
    }
    return invalidControl;
  }
}

@Directive({
  selector: 'form[gioFormFocusInvalid]',
})
export class GioFormFocusInvalidFormDirective extends GioBaseFormFocusInvalidDirective {
  @HostListener('submit')
  public onFormSubmit() {
    this.focusOnFirstInvalid();
  }
}

@Directive({
  selector: 'button[gioFormFocusInvalid]',
})
export class GioButtonFocusInvalidButtonDirective extends GioBaseFormFocusInvalidDirective {
  @HostListener('click')
  public onClick() {
    this.focusOnFirstInvalid();
  }
}
