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
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { GioMenuService } from './gio-menu.service';

@Component({
  selector: 'gio-menu',
  templateUrl: './gio-menu.component.html',
  styleUrls: ['./gio-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class GioMenuComponent implements OnChanges {
  @Input()
  public reduced = false;

  public reduce$ = this.gioMenuService.reduced$;

  constructor(private readonly gioMenuService: GioMenuService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.reduced) {
      this.gioMenuService.reduce(this.reduced);
    }
  }

  public reduceMenu(reduced: boolean | null): void {
    this.gioMenuService.reduce(!reduced);
  }

  public onMouseLeave(reduced: boolean | null): void {
    if (reduced) {
      this.gioMenuService.overlay({ open: false });
    }
  }
}
