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
import { from, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

/**
 * The `@asciidoctor/core` module itself: since 4.0.0 the package exposes its API as module level
 * functions instead of the instance built by the default exported factory.
 */
export type Asciidoctor = typeof import('@asciidoctor/core');

declare global {
  interface Window {
    _gioAsciidoctor: Asciidoctor;
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
    if (!window._gioAsciidoctor) {
      const loadAsciidoctor = async () => {
        window._gioAsciidoctor = await import('@asciidoctor/core');
        return window._gioAsciidoctor;
      };

      return from(loadAsciidoctor());
    } else {
      return of(window._gioAsciidoctor);
    }
  }
}
