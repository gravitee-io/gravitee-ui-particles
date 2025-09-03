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
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

import { GioIconsModule } from '../gio-icons/gio-icons.module';
import { GioElPromptComponent } from '../gio-el';
import { GioPopoverComponent, PopoverTriggerDirective } from '../gio-popover';

import { GioFormHeadersComponent } from './gio-form-headers.component';
import { GioFormHeadersLabelComponent } from './gio-form-headers-label.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    GioIconsModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule,
    GioElPromptComponent,
    GioPopoverComponent,
    PopoverTriggerDirective,
  ],
  declarations: [GioFormHeadersComponent, GioFormHeadersLabelComponent],
  exports: [GioFormHeadersComponent, GioFormHeadersLabelComponent],
})
export class GioFormHeadersModule {}
