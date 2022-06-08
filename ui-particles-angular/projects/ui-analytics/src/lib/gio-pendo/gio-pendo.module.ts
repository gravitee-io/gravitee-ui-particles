/*
 * Copyright (C) 2022 The Gravitee team (http://gravitee.io)
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
import { NgModule, ModuleWithProviders } from '@angular/core';

import { GIO_PENDO_INITIALIZER_PROVIDER } from './gio-pendo.injectors';
import { GioPendoSettings } from './GioPendoSettings';
import { GioPendoService } from './gio-pendo.service';
import { GIO_PENDO_SETTINGS_TOKEN } from './gio-pendo.token';

@NgModule({
  providers: [GioPendoService],
})
export class GioPendoModule {
  public static forRoot(settings?: GioPendoSettings): ModuleWithProviders<GioPendoModule> {
    return {
      ngModule: GioPendoModule,
      providers: [
        {
          provide: GIO_PENDO_SETTINGS_TOKEN,
          useValue: settings,
        },
        GIO_PENDO_INITIALIZER_PROVIDER,
        GioPendoService,
      ],
    };
  }
}
