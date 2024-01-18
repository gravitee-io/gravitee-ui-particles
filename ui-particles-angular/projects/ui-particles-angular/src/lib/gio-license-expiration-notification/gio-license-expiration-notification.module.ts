/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GioIconsModule } from '../gio-icons/gio-icons.module';

import { GioLicenseExpirationNotificationComponent } from './gio-license-expiration-notification.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatTooltipModule, GioIconsModule],
  declarations: [GioLicenseExpirationNotificationComponent],
  exports: [GioLicenseExpirationNotificationComponent],
})
export class GioLicenseExpirationNotificationModule {}
