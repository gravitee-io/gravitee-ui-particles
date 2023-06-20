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
import { Observable } from 'rxjs';
import { Asciidoctor } from 'asciidoctor';
import { shareReplay } from 'rxjs/operators';

import type AsciidoctorProcessor from 'asciidoctor';

type AsciidoctorProcessor = typeof AsciidoctorProcessor;

declare global {
  interface Window {
    Asciidoctor: AsciidoctorProcessor;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GioAsciidoctorService {
  public load(): Observable<Asciidoctor> {
    return this.loadAsciidoctor().pipe(
      // If already loaded, we don't want to load it again
      shareReplay(1),
    );
  }

  private loadAsciidoctor(): Observable<Asciidoctor> {
    return new Observable<Asciidoctor>(observer => {
      const onGotAsciidoctor = () => {
        observer.next(window.Asciidoctor());
        observer.complete();
      };

      if (!window.Asciidoctor) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = 'assets/asciidoctor/asciidoctor.js';
        loaderScript.addEventListener('load', onGotAsciidoctor);
        loaderScript.addEventListener('error', err => observer.error(err));
        document.body.appendChild(loaderScript);
      } else {
        onGotAsciidoctor();
      }
    });
  }
}
