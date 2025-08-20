/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { GioPopoverComponent } from './gio-popover.component';

@Directive({
  selector: '[gioPopoverTrigger]',
})
export class PopoverTriggerDirective {
  @Input({ required: true })
  public gioPopoverTriggerFor!: GioPopoverComponent;

  @Input()
  public gioPopoverTriggerBasedOnElement?: ElementRef;

  constructor(private elementRef: ElementRef) {}

  @HostListener('click')
  public togglePopover(): void {
    if (this.gioPopoverTriggerFor) {
      // If a specific element is provided, use it as the trigger
      this.gioPopoverTriggerFor.trigger = this.gioPopoverTriggerBasedOnElement ?? this.elementRef;
      this.gioPopoverTriggerFor.open();
    }
  }
}
