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
import { Component, Input } from '@angular/core';

@Component({
  selector: 'gio-radio-button-title',
  template: `<ng-content></ng-content>`,
})
export class GioRadioButtonTitleComponent {}

@Component({
  selector: 'gio-radio-button-subtitle',
  template: `<ng-content></ng-content>`,
})
export class GioRadioButtonSubitleComponent {}

@Component({
  selector: 'gio-radio-button-content',
  templateUrl: './gio-radio-button-content.component.html',
  styleUrls: ['./gio-radio-button.scss'],
})
export class GioRadioButtonContentComponent {
  @Input()
  public icon: string | undefined;
}
