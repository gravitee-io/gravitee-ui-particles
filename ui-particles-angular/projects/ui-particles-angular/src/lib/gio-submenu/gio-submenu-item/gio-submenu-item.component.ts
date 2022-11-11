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
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'gio-submenu-item',
  templateUrl: './gio-submenu-item.component.html',
  styleUrls: ['./gio-submenu-item.component.scss'],
})
export class GioSubmenuItemComponent {
  @Input() public active = false;

  @ViewChild('gioSubmenuItem', { static: false })
  private gioSubmenuItem: ElementRef<HTMLDivElement> | undefined;

  @HostListener('keydown', ['$event'])
  public onKeydownHandler(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      this.gioSubmenuItem?.nativeElement.click();
    }
  }
}
