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
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { GioLoaderModule } from '../gio-loader/gio-loader.module';

import { GioFormTagsInputComponent } from './gio-form-tags-input.component';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    MatChipsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    GioLoaderModule,
  ],
  declarations: [GioFormTagsInputComponent],
  exports: [GioFormTagsInputComponent],
})
export class GioFormTagsInputModule {}
