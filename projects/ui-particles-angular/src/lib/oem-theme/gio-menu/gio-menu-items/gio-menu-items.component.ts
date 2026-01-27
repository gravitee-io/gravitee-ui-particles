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

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, Input, signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { ConnectedPosition } from '@angular/cdk/overlay';

import { GioMenuService } from '../gio-menu.service';

@Component({
  selector: 'gio-menu-items',
  templateUrl: './gio-menu-items.component.html',
  styleUrls: ['./gio-menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  // Add host class for scoping styles
  host: {
    class: 'gio-menu-items-host',
  },
})
export class GioMenuItemsComponent {
  @Input() public icon = '';
  @Input() public iconRight?: string;
  @Input() public title = 'default';
  @Input() public active = false;
  @Input() public routerBasePath?: string;

  private readonly router = inject(Router);
  private readonly gioMenuService = inject(GioMenuService);
  private readonly destroyRef = inject(DestroyRef);

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly showOverlay = signal(false);
  protected readonly reduced = toSignal(this.gioMenuService.reduced$, { initialValue: false });

  protected readonly isRouteActive = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => !!this.routerBasePath && this.router.url.startsWith(this.routerBasePath)),
    ),
    { initialValue: false },
  );

  protected readonly isPanelActive = computed(() => this.active || this.isRouteActive());
  protected readonly isPanelExpanded = computed(() => this.isPanelActive() || (this.reduced() && this.showOverlay()));

  // Overlay position configuration: position to the right of the trigger
  protected readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 8, // 8px gap between trigger and overlay
    },
  ];

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
    });
  }

  public get isActive(): boolean {
    return this.active;
  }

  public onHeaderClick(): void {
    if (this.routerBasePath) {
      this.router.navigate([this.routerBasePath]);
    }
  }

  public onPanelHeaderClick(event: Event): void {
    event.stopPropagation();
    this.onHeaderClick();
  }

  public onMouseEnter(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.showOverlay.set(true);
  }

  public onMouseLeave(): void {
    this.closeTimeout = setTimeout(() => {
      this.showOverlay.set(false);
      this.closeTimeout = null;
    }, 200);
  }
}
