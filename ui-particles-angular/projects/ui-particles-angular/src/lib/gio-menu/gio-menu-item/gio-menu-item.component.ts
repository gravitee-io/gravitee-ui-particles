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

import { GioMenuService } from '../gio-menu.service';

@Component({
  selector: 'gio-menu-item',
  templateUrl: './gio-menu-item.component.html',
  styleUrls: ['./gio-menu-item.component.scss'],
})
export class GioMenuItemComponent {
  @Input() public icon = '';
  @Input() public active = false;
  @Input() public outlined = false;

  @ViewChild('gioMenuItem', { static: false })
  private gioMenuItem: ElementRef<HTMLDivElement> | undefined;

  constructor(private readonly gioMenuService: GioMenuService) {}

  public onMouseLeave($event: MouseEvent): void {
    if (this.active) {
      const target = $event.target as HTMLInputElement;
      const menuItem = target.closest('.gio-menu-item') as HTMLInputElement;
      setTimeout(() => this.gioMenuService.mouseOverItem({ enter: false, top: menuItem.getBoundingClientRect().top }), 50);
    }
  }

  public onMouseEnter($event: MouseEvent): void {
    if (this.active) {
      const target = $event.target as HTMLInputElement;
      const menuItem = target.closest('.gio-menu-item') as HTMLInputElement;
      this.gioMenuService.mouseOverItem({ enter: true, top: menuItem.getBoundingClientRect().top });
    }
  }

  @HostListener('click', ['$event'])
  public onClick($event: MouseEvent): void {
    setTimeout(() => this.onMouseEnter($event), 0);
  }

  @HostListener('keydown', ['$event'])
  public onKeydownHandler(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      this.gioMenuItem?.nativeElement.click();
    }
  }
}
