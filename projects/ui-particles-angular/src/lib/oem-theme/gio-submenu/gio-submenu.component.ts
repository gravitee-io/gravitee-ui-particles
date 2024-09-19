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
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { of, Subject } from 'rxjs';
import { delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { GioMenuService, OverlayOptions } from '../gio-menu';

@Directive({
  selector: '[gioSubmenuTitle]',
})
export class GioSubmenuTitleDirective {}

export type GioSubmenuTheme = 'dark' | 'light';

@Component({
  selector: 'gio-submenu',
  templateUrl: './gio-submenu.component.html',
  styleUrls: ['./gio-submenu.component.scss'],
})
export class GioSubmenuComponent implements AfterViewInit, OnDestroy {
  @Input()
  public theme: GioSubmenuTheme = 'dark';

  @Input()
  public static = false;

  public reduced = false;
  public loaded = false;
  public overlayOptions: OverlayOptions = { open: false };
  private hover = false;
  @ViewChild('gioSubmenu', { static: false })
  private gioSubmenu!: ElementRef<HTMLDivElement>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly gioMenuService: GioMenuService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    // When the menu is reduced
    const reduced$ = of({}).pipe(
      tap(() => {
        this.reduced = true;
        this.loaded = true;
        this.gioSubmenu.nativeElement.style.height = 'auto';
        this.gioSubmenu.nativeElement.style.maxHeight = `0vh`;
        this.changeDetectorRef.detectChanges();
      }),
      // On hover root menu item, open the submenu with top position
      switchMap(() => this.gioMenuService.overlayObservable),
      tap(overlayOptions => {
        this.overlayOptions = overlayOptions;
        if (overlayOptions.open) {
          const top = overlayOptions.top || 0;
          this.gioSubmenu.nativeElement.style.top = `${top}px`;
          this.gioSubmenu.nativeElement.style.maxHeight = `calc(100vh - ${top + 8}px)`;
        }
      }),
      filter(overlayOptions => !!overlayOptions.focus),
      // Focus the first submenu item
      delay(200),
      map(() => this.gioSubmenu.nativeElement.querySelectorAll<HTMLElement>('gio-submenu-item')),
      filter(submenuItems => submenuItems.length > 0),
      tap(submenuItems => submenuItems[0].focus()),
    );

    // When the menu is not reduced
    const notReduced$ = of({}).pipe(
      tap(() => {
        this.reduced = false;
        this.loaded = true;
        this.gioSubmenu.nativeElement.style.height = '100%';
        this.gioSubmenu.nativeElement.style.maxHeight = 'unset';
        this.gioSubmenu.nativeElement.style.top = 'unset';
      }),
    );

    this.gioMenuService.reduced$
      .pipe(
        switchMap(reduced => (reduced && !this.static ? reduced$ : notReduced$)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
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
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }
}
