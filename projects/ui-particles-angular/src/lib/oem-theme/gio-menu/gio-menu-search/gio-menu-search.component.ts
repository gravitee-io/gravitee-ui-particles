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
import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GioMenuSearchService } from './gio-menu-search.service';

export interface MenuSearchItem {
  name: string;
  routerLink: string;
  category: string;
  groupIds?: string[];
}

@Component({
  selector: 'gio-menu-search',
  templateUrl: './gio-menu-search.component.html',
  styleUrls: ['./gio-menu-search.component.scss'],
  standalone: false,
})
export class GioMenuSearchComponent {
  protected control = new FormControl<string | MenuSearchItem>('');
  protected filteredItems$: Observable<MenuSearchItem[]> = this.control.valueChanges.pipe(
    startWith(''),
    map(value => {
      const name = typeof value === 'string' ? value : value?.name;
      return this._filter(name);
    }),
  );

  @Output()
  public valueChanges: EventEmitter<MenuSearchItem> = new EventEmitter<MenuSearchItem>();

  constructor(private readonly gioMenuSearchService: GioMenuSearchService) {}

  protected displayFn(item: MenuSearchItem): string {
    return item?.name ?? '';
  }

  protected onSelectionChange(event: MatAutocompleteSelectedEvent) {
    this.control.reset();
    this.valueChanges.emit(event.option.value);
  }

  private _filter(value: string | undefined): MenuSearchItem[] {
    if (!value) {
      return [];
    }

    const filterValue = this._normalizeValue(value);
    return this.gioMenuSearchService.menuSearchItems.filter(item => this._normalizeValue(item?.name).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
