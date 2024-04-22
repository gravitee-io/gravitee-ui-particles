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
import { Injectable } from '@angular/core';
import { filter, intersection, isEqual, isNil, some } from 'lodash';

import { MenuSearchItem } from './gio-menu-search.component';

@Injectable({ providedIn: 'root' })
export class GioMenuSearchService {
  public menuSearchItems: MenuSearchItem[] = [];

  public addMenuSearchItems(items: MenuSearchItem[]): void {
    items.forEach(item => {
      const isDuplicate = some(this.menuSearchItems, existingItem => isEqual(existingItem, item));
      if (!isDuplicate) {
        this.menuSearchItems.push(item);
      }
    });
  }

  public removeMenuSearchItems(groupIds: string[]) {
    this.menuSearchItems = filter(this.menuSearchItems, item => isNil(item.groupIds) || !intersection(groupIds, item.groupIds).length);
  }
}
