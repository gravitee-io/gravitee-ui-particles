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
import { AfterViewInit, Component, Directive, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { of, Subject } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { GioMenuService, OverlayOptions } from '../gio-menu/gio-menu.service';

@Directive({
  selector: '[gioSubmenuTitle]',
})
export class GioSubmenuTitleDirective {}

@Component({
  selector: 'gio-submenu',
  templateUrl: './gio-submenu.component.html',
  styleUrls: ['./gio-submenu.component.scss'],
})
export class GioSubmenuComponent implements AfterViewInit, OnDestroy {
  public reduced = false;
  public loaded = false;
  public overlayOptions: OverlayOptions = { open: false };
  private hover = false;
  @ViewChild('gioSubmenu', { static: false })
  private gioSubmenu!: ElementRef<HTMLDivElement>;
  private unsubscribe$ = new Subject();

  constructor(private readonly gioMenuService: GioMenuService) {}

  public ngAfterViewInit(): void {
    this.gioMenuService.reduce
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(reduced => reduced),
        tap(() => {
          this.reduced = true;
          this.loaded = true;
        }),
        switchMap(() => this.gioMenuService.overlayObservable),
        tap(overlayOptions => {
          this.overlayOptions = overlayOptions;
          if (overlayOptions.open) {
            const top = overlayOptions.top || 0;
            this.gioSubmenu.nativeElement.style.top = `${top}px`;
            this.gioSubmenu.nativeElement.style.height = 'auto';
            this.gioSubmenu.nativeElement.style.maxHeight = `calc(100vh - ${top + 8}px)`;
          }
        }),
        filter(overlayOptions => !!overlayOptions.focus),
        delay(200),
        switchMap(() => of(this.gioSubmenu.nativeElement.querySelectorAll<HTMLElement>('gio-submenu-item'))),
        filter(submenuItems => submenuItems.length > 0),
        tap(submenuItems => submenuItems[0].focus()),
      )
      .subscribe();

    this.gioMenuService.reduce
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(reduced => !reduced),
        tap(() => {
          this.reduced = false;
          this.loaded = true;
          this.gioSubmenu.nativeElement.style.height = '100%';
          this.gioSubmenu.nativeElement.style.maxHeight = 'none';
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  public onMouseEnter(): void {
    this.hover = true;
    this.gioMenuService.overlay(this.overlayOptions);
  }

  public onMouseLeave(): void {
    this.hover = false;
    this.gioMenuService.overlay({ open: false });
  }

  @HostListener('keydown', ['$event'])
  public onKeydownHandler(event: KeyboardEvent): void {
    of(this.reduced && event.key === 'Escape')
      .pipe(
        filter(reducedAndEscape => reducedAndEscape),
        tap(() => this.gioMenuService.overlay({ open: false })),
        delay(100),
        tap(() => this.overlayOptions.parent?.focus()),
      )
      .subscribe();
  }
}
