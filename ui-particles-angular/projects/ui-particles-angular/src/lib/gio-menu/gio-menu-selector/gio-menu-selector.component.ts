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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

export type SelectorItem = {
  value: string;
  displayValue: string;
};

@Component({
  selector: 'gio-menu-selector',
  templateUrl: './gio-menu-selector.component.html',
  styleUrls: ['./gio-menu-selector.component.scss'],
})
export class GioMenuSelectorComponent {
  @Input()
  public selectorTitle = '';

  @Input()
  public selectorItems: SelectorItem[] = [];

  @Input()
  public selectedItemValue = '';

  @Input()
  public tabIndex = 1;

  @Output()
  public selectChange: EventEmitter<string> = new EventEmitter<string>();

  public onSelectionChange($event: MatSelectChange): void {
    this.selectChange.emit($event.value);
  }

  public isDisabled(): boolean {
    return this.selectorItems.length <= 1;
  }
}