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
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, shareReplay, switchMap } from 'rxjs/operators';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Prism: any | undefined;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GioPrismJsService {
  public loadPrismJs(): Observable<void> {
    // First load PrismJs
    return this.loadPrimeJsCore().pipe(
      // Then load PrismJs components
      switchMap(() => this.loadPrismJsComponent('json')),
      // Small delay to ensure PrismJs take language into account
      delay(100),
      // If already loaded, we don't want to load it again
      shareReplay(1),
      // Ignore error
      catchError(() => of(undefined)),
    );
  }

  private loadPrimeJsCore(): Observable<void> {
    return new Observable<void>(observer => {
      const onGotPrismJs = () => {
        observer.next();
        observer.complete();
      };

      if (!window.Prism) {
        const loaderPrismjs = document.createElement('script');
        loaderPrismjs.type = 'text/javascript';
        loaderPrismjs.src = 'assets/prismjs/prism.js';
        loaderPrismjs.addEventListener('load', onGotPrismJs);
        loaderPrismjs.addEventListener('error', err => observer.error(err));
        document.body.appendChild(loaderPrismjs);
      } else {
        onGotPrismJs();
      }
    });
  }

  private loadPrismJsComponent(name: string): Observable<void> {
    return new Observable<void>(observer => {
      const onGotPrismJsComponent = () => {
        observer.next();
        observer.complete();
      };

      if (!window.Prism.languages[name]) {
        const loaderPrismjsJson = document.createElement('script');
        loaderPrismjsJson.type = 'text/javascript';
        loaderPrismjsJson.src = `assets/prismjs/components/prism-${name}.js`;
        loaderPrismjsJson.addEventListener('load', onGotPrismJsComponent);
        loaderPrismjsJson.addEventListener('error', err => observer.error(err));
        document.body.appendChild(loaderPrismjsJson);
      } else {
        onGotPrismJsComponent();
      }
    });
  }
}
