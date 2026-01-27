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

import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { GioMenuService } from '../gio-menu.service';

@Component({
  selector: 'gio-menu-items',
  templateUrl: './gio-menu-items.component.html',
  styleUrls: ['./gio-menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioMenuItemsComponent {
  @Input() public icon = '';
  @Input() public iconRight?: string;
  @Input() public title = 'default';
  @Input() public active = false;
  @Input() public routerBasePath?: string;

  protected readonly showOverlay = signal(false);

  public reduced$ = this.gioMenuService.reduced$;

  public isRouteActive$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.routerBasePath && this.router.url.startsWith(this.routerBasePath)),
  );

  constructor(
    private readonly router: Router,
    private readonly gioMenuService: GioMenuService,
  ) { }

  public get isActive(): boolean {
    return this.active;
  }

  public onHeaderClick(): void {
    if (this.routerBasePath) {
      this.router.navigate([this.routerBasePath]);
    }
  }

  public onMouseEnter(): void {
    this.showOverlay.set(true);
  }

  public onMouseLeave(): void {
    this.showOverlay.set(false);
  }
}
