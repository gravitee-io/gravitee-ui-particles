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
import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export const matIconRegisterProvider: (icons: { id: string; svg?: string }[]) => EnvironmentProviders = icons =>
  provideAppInitializer(() => {
    const initializerFn = ((matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) => () => {
      const BASE_64_PREFIX = 'data:image/svg+xml;base64,';

      icons.forEach(({ id, svg: icon }) => {
        if (icon && icon.startsWith(BASE_64_PREFIX)) {
          matIconRegistry.addSvgIconLiteralInNamespace(
            'gio-literal',
            id,
            // No Sonar because the bypass is deliberate and should only be used with safe data
            domSanitizer.bypassSecurityTrustHtml(atob(icon.replace(BASE_64_PREFIX, ''))), // NOSONAR
          );
        }
      });
    })(inject(MatIconRegistry), inject(DomSanitizer));
    return initializerFn();
  });
