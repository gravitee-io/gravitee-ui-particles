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
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { GioBannerModule } from '../gio-banner/gio-banner.module';

import { GioConfirmAndValidateDialogComponent } from './gio-confirm-and-validate-dialog.component';

@NgModule({
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, A11yModule, GioBannerModule],
  declarations: [GioConfirmAndValidateDialogComponent],
  exports: [GioConfirmAndValidateDialogComponent],
})
export class GioConfirmAndValidateDialogModule {}
