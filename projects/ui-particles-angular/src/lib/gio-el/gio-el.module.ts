/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GioIconsModule } from '../gio-icons/gio-icons.module';
import { GioBannerModule } from '../gio-banner/gio-banner.module';
import { GioClipboardModule } from '../gio-clipboard/gio-clipboard.module';

import { GioElPromptComponent } from './gio-el-prompt/gio-el-prompt.component';
import { GioElService } from './gio-el.service';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatProgressBarModule,
    MatTooltipModule,
    GioIconsModule,
    GioBannerModule,
    GioClipboardModule,
  ],
  declarations: [GioElPromptComponent],
  exports: [GioElPromptComponent, GioElService],
})
export class GioElModule {}
