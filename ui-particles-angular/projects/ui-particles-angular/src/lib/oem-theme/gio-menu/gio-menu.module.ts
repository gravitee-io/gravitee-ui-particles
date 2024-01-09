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
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { GioIconsModule } from '../../gio-icons/gio-icons.module';

import { GioMenuItemComponent } from './gio-menu-item/gio-menu-item.component';
import { GioMenuComponent } from './gio-menu.component';
import { GioMenuFooterComponent } from './gio-menu-footer/gio-menu-footer.component';
import { GioMenuListComponent } from './gio-menu-list/gio-menu-list.component';
import { GioMenuSelectorComponent } from './gio-menu-selector/gio-menu-selector.component';
import { GioMenuHeaderComponent } from './gio-menu-header/gio-menu-header.component';
import { GioMenuLicenseExpirationNotificationComponent } from './gio-menu-license-expiration-notification/gio-menu-license-expiration-notification.component';

@NgModule({
  declarations: [
    GioMenuComponent,
    GioMenuItemComponent,
    GioMenuFooterComponent,
    GioMenuListComponent,
    GioMenuHeaderComponent,
    GioMenuSelectorComponent,
    GioMenuLicenseExpirationNotificationComponent,
  ],
  exports: [
    GioMenuComponent,
    GioMenuItemComponent,
    GioMenuFooterComponent,
    GioMenuListComponent,
    GioMenuHeaderComponent,
    GioMenuSelectorComponent,
    GioMenuLicenseExpirationNotificationComponent,
  ],
  imports: [CommonModule, MatIconModule, GioIconsModule, MatSelectModule],
})
export class GioMenuModule {}
