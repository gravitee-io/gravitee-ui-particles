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
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { GioIconsModule } from '../gio-icons/gio-icons.module';

@Component({
  selector: 'gio-action-menu-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, GioIconsModule, RouterLink],
  template: `
    <button mat-menu-item [disabled]="disabled()" [routerLink]="routerLink()">
      <mat-icon [svgIcon]="icon().startsWith('gio:') ? icon() : ''">{{ icon().startsWith('gio:') ? null : icon() }}</mat-icon>
      @if (label()) {
        <span>{{ label() }}</span>
      }
      <ng-content></ng-content>
    </button>
  `,
})
export class GioActionMenuItemComponent {
  public icon = input<string>('');
  public label = input<string>('');
  public disabled = input(false);
  public routerLink = input<string | string[]>();
}
