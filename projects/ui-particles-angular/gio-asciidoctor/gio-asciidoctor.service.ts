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
import { from, Observable } from 'rxjs';

/**
 * The `@asciidoctor/core` module itself: since 4.0.0 the package exposes its API as module level
 * functions instead of the instance built by the default exported factory.
 */
export type Asciidoctor = typeof import('@asciidoctor/core');

declare global {
  interface Window {
    /** The pending — then settled — import, shared by every caller. See `GioAsciidoctorService`. */
    _gioAsciidoctor?: Promise<Asciidoctor>;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GioAsciidoctorService {
  public load(): Observable<Asciidoctor> {
    return from(this.loadAsciidoctor());
  }

  /**
   * Imports the module once, however many callers ask for it.
   *
   * The promise is held on the window rather than on the service so that several root injectors —
   * several Angular applications on the same page — share a single import.
   */
  private loadAsciidoctor(): Promise<Asciidoctor> {
    if (!window._gioAsciidoctor) {
      // Nothing is awaited between the check and the assignment, so components created in the same
      // tick join the same import instead of each starting one.
      window._gioAsciidoctor = import('@asciidoctor/core').catch((error: unknown) => {
        // Forget a failed import, otherwise every later caller would be handed the same rejection.
        window._gioAsciidoctor = undefined;
        throw error;
      });
    }

    return window._gioAsciidoctor;
  }
}
