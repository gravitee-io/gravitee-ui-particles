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
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { GioIconsModule } from '../gio-icons/gio-icons.module';

import { GioFormSelectionInlineCardComponent } from './gio-form-selection-inline-card.component';
import { GioFormSelectionInlineComponent } from './gio-form-selection-inline.component';
import {
  GioFormSelectionInlineCardContentComponent,
  GioFormSelectionInlineCardSubtitleComponent,
  GioFormSelectionInlineCardTitleComponent,
} from './gio-form-selection-inline-card-content/gio-form-selection-inline-card-content.component';

@NgModule({
  imports: [CommonModule, MatCardModule, MatIconModule, MatRippleModule, GioIconsModule],
  declarations: [
    GioFormSelectionInlineComponent,
    GioFormSelectionInlineCardComponent,
    GioFormSelectionInlineCardSubtitleComponent,
    GioFormSelectionInlineCardTitleComponent,
    GioFormSelectionInlineCardContentComponent,
  ],
  exports: [
    GioFormSelectionInlineComponent,
    GioFormSelectionInlineCardComponent,
    GioFormSelectionInlineCardSubtitleComponent,
    GioFormSelectionInlineCardTitleComponent,
    GioFormSelectionInlineCardContentComponent,
  ],
})
export class GioFormSelectionInlineModule {}
