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
  selector: 'gio-form-selection-inline-card-content',
  template: `<div class="content">
    @if (icon) {
      <mat-icon class="content__icon" [svgIcon]="icon"></mat-icon>
    } @else if (img) {
      <img class="content__icon" [src]="img" />
    }
    <div class="content__title">
      <ng-content select="gio-card-content-title"></ng-content>
    </div>
    <div class="content__subtitle">
      <ng-content select="gio-card-content-subtitle"></ng-content>
    </div>
  </div>`,
  styleUrls: ['./gio-form-selection-inline-card-content.component.scss'],
})
export class GioFormSelectionInlineCardContentComponent {
  @Input()
  public icon: string | undefined;

  @Input()
  public img: string | undefined;
}

@Component({
  selector: 'gio-card-content-title',
  template: `<ng-content></ng-content>`,
})
export class GioFormSelectionInlineCardTitleComponent {}

@Component({
  selector: 'gio-card-content-subtitle',
  template: `<ng-content></ng-content>`,
})
export class GioFormSelectionInlineCardSubtitleComponent {}
