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
  @Input() public items: GioMenuItem[] = [];
  protected readonly panelOpenState = signal(false);
}

export interface GioMenuItem {
  title: string;
  active?: boolean;
  routerLink?: string;
}
