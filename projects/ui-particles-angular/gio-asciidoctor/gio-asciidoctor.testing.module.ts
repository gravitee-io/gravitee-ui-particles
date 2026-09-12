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
import { of } from 'rxjs';

import { Asciidoctor, GioAsciidoctorService } from './gio-asciidoctor.service';

/**
 * Stands in for the real conversion, wrapping the content so that a test can tell the component
 * rendered it.
 */
export const asciidoctorTestingConvert = (content: string): Promise<string> =>
  Promise.resolve(`<div class="asciidoctor-content">${content}</div>`);

/**
 * Replaces `GioAsciidoctorService` in a test bed.
 *
 * `@asciidoctor/core` 4 cannot be loaded under jsdom at all — its browser build is ESM using
 * `import.meta`, and its CommonJS build calls `createRequire()` on `document.baseURI` — so any test
 * rendering a `<gio-asciidoctor>` has to replace the service that imports it.
 */
@NgModule({
  providers: [
    {
      provide: GioAsciidoctorService,
      useValue: {
        load: () => of({ convert: asciidoctorTestingConvert } as unknown as Asciidoctor),
      },
    },
  ],
})
export class GioAsciidoctorTestingModule {}
