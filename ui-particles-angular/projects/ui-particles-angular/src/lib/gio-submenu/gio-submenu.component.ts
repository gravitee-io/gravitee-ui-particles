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
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { GioMenuService } from '../gio-menu/gio-menu.service';

@Component({
  selector: 'gio-submenu',
  templateUrl: './gio-submenu.component.html',
  styleUrls: ['./gio-submenu.component.scss'],
})
export class GioSubmenuComponent implements OnInit, OnDestroy {
  public reduced = false;
  public overlayOptions = { open: false };
  private hover = false;
  @ViewChild('gioSubmenu', { static: false })
  private gioSubmenu: ElementRef<HTMLDivElement> | undefined;
  private unsubscribe$ = new Subject();

  constructor(private readonly gioMenuService: GioMenuService) {}

  public ngOnInit(): void {
    combineLatest([this.gioMenuService.reduce, this.gioMenuService.overlayObservable])
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(([reduced, overlayOptions]) => {
          this.reduced = reduced;
          if (this.gioSubmenu) {
            this.overlayOptions = overlayOptions;
            if (this.reduced) {
              const top = overlayOptions.top || 0;
              this.gioSubmenu.nativeElement.style.top = `${top}px`;
              this.gioSubmenu.nativeElement.style.height = 'auto';
              this.gioSubmenu.nativeElement.style.maxHeight = `calc(100vh - ${top + 8}px)`;
              return;
            }
            this.gioSubmenu.nativeElement.style.height = '100%';
            this.gioSubmenu.nativeElement.style.maxHeight = 'none';
          }
        }),
      )
      .subscribe();
  }

  public onMouseEnter(): void {
    this.hover = true;
    this.gioMenuService.overlay(this.overlayOptions);
  }

  public onMouseLeave(): void {
    this.hover = false;
    this.gioMenuService.overlay({ open: false });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}
