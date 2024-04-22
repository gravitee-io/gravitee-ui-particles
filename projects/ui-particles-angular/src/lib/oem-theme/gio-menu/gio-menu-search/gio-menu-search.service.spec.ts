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
import { GioMenuSearchService } from './gio-menu-search.service';
import { MenuSearchItem } from './gio-menu-search.component';

describe('GioMenuSearchService', () => {
  const item1: MenuSearchItem = { name: 'item-1', routerLink: 'item-1', category: 'item-1', groupIds: ['item-1'] };
  const item2: MenuSearchItem = { name: 'item-2', routerLink: 'item-2', category: 'item-2', groupIds: ['item-2'] };
  const item3: MenuSearchItem = { name: 'item-3', routerLink: 'item-3', category: 'item-3', groupIds: ['item-1', 'item-3'] };
  const item4: MenuSearchItem = { name: 'item-3', routerLink: 'item-3', category: 'item-3' };

  let service: GioMenuSearchService;

  beforeEach(() => {
    service = new GioMenuSearchService();
  });

  it('should add search items to the list', () => {
    expect(service.menuSearchItems).toStrictEqual([]);
    service.addMenuSearchItems([item1, item2, item3]);
    expect(service.menuSearchItems).toStrictEqual([item1, item2, item3]);
  });

  it('should not allow to add a duplicated entry', () => {
    service.addMenuSearchItems([{ ...item1 }, { ...item1 }]);
    expect(service.menuSearchItems).toStrictEqual([item1]);
  });

  it('should remove items by group ids', () => {
    service.addMenuSearchItems([item1, item2, item3, item4]);
    expect(service.menuSearchItems).toStrictEqual([item1, item2, item3, item4]);

    service.removeMenuSearchItems(['item-1', 'item-3']);

    expect(service.menuSearchItems).toStrictEqual([item2, item4]);
  });
});
