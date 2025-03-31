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
import { inject, provideAppInitializer, EnvironmentProviders } from '@angular/core';
import { interval } from 'rxjs';

import { GIO_PENDO_SETTINGS_TOKEN } from './gio-pendo.token';
import { GioPendoSettings } from './GioPendoSettings';

export const GIO_PENDO_INITIALIZER_PROVIDER: EnvironmentProviders = provideAppInitializer(() => {
  const initializerFn = pendoInitializer(inject(GIO_PENDO_SETTINGS_TOKEN));
  return initializerFn();
});

export function pendoInitializer(pendoSettings: GioPendoSettings): () => Promise<void> {
  return async () => {
    if (!pendoSettings.enabled || !pendoSettings.apiKey) {
      return;
    }

    await new Promise<void>((resolve, _reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://cdn.pendo.io/agent/static/${pendoSettings.apiKey}/pendo.js`;
      document.head.appendChild(script);
      script.onerror = async () => {
        // The script may have been blocked by an ad blocker
        resolve();
      };
      script.onload = async () => {
        // when enableDebugging should load extra js
        const sub = interval(100).subscribe(() => {
          if (window.pendo) {
            sub.unsubscribe();
            resolve();
          }
        });
      };
    });
  };
}
