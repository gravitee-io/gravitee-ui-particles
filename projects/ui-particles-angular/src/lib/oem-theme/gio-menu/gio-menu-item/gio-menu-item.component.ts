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
import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { of, Subject } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { GioMenuService } from '../gio-menu.service';

@Component({
  selector: 'gio-menu-item',
  templateUrl: './gio-menu-item.component.html',
  styleUrls: ['./gio-menu-item.component.scss'],
  standalone: false,
})
export class GioMenuItemComponent implements OnDestroy {
  @Input() public icon = '';
  @Input() public iconRight?: string;
  @Input() public active = false;
  @Input() public outlined = false;

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly gioMenuService: GioMenuService) {}

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  public onMouseLeave(): void {
    if (this.active) {
      this.gioMenuService.overlay({ open: false });
    }
  }

  public onMouseEnter($event: MouseEvent): void {
    if (this.active) {
      const menuItem = $event.target as HTMLInputElement;
      this.gioMenuService.overlay({ open: true, top: menuItem.getBoundingClientRect().top, parent: menuItem });
    }
  }

  @HostListener('click', ['$event'])
  public onClick($event: MouseEvent): void {
    of(true)
      .pipe(
        delay(0),
        tap(() => this.onMouseEnter($event)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }

  @HostListener('keydown', ['$event'])
  public onKeydownHandler($event: KeyboardEvent): void {
    of($event.key === 'Enter' && $event.target)
      .pipe(
        filter(enterKey => !!enterKey),
        switchMap(() => of($event.target as HTMLElement)),
        tap(menuItem => {
          this.gioMenuService.overlay({ open: false });
          if (this.active) {
            this.gioMenuService.overlay({ open: true, top: menuItem.getBoundingClientRect().top, parent: menuItem, focus: true });
          } else {
            menuItem.click();
          }
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }
}
