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
import { APP_ID, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, SecurityContext, SimpleChanges } from '@angular/core';
import { Asciidoctor } from 'asciidoctor';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { GioPrismJsService } from '../gio-prismjs/gio-prismjs.service';

import { GioAsciidoctorService } from './gio-asciidoctor.service';

@Component({
  selector: 'gio-asciidoctor',
  template: '',
  styleUrls: ['./gio-asciidoctor.component.scss'],
})
export class GioAsciidoctorComponent implements OnChanges, OnDestroy {
  @Input()
  public content?: string;

  @Input()
  public src?: string;

  private options: Asciidoctor.Options = {
    header_footer: false,
    attributes: {
      showtitle: true,
    },
    safe: 'secure',
  };

  private asciidoctor$ = new ReplaySubject<Asciidoctor>(1);
  private unsubscribe$ = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _uniqueId: string = (this.constructor as any)['ɵcmp'].id;

  constructor(
    private readonly gioAsciidoctorService: GioAsciidoctorService,
    private readonly gioPrismJsService: GioPrismJsService,
    private readonly sanitizer: DomSanitizer,
    private readonly elementRef: ElementRef,
    private readonly httpClient: HttpClient,
    @Inject(APP_ID) private readonly appId: string,
  ) {
    // Asynchronously load asciidoctor.js and prism.js
    forkJoin([this.gioAsciidoctorService.load(), this.gioPrismJsService.loadPrismJs()])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([asciidoctor]) => {
        this.asciidoctor$.next(asciidoctor);
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.content && this.content) {
      this.render(this.content);
    }
    if (changes.src && this.src) {
      this.httpClient
        .get(this.src, { responseType: 'text' })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(content => {
          this.render(content);
        });
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private render(content?: string): void {
    if (!content) {
      return;
    }

    // When asciidoctor is not loaded yet, wait for it
    this.asciidoctor$.pipe(takeUntil(this.unsubscribe$)).subscribe(asciidoctor => {
      const html = asciidoctor.convert(content, this.options);
      this.elementRef.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, html);

      // Highlight all code blocks with PrismJs
      const highlights = this.elementRef.nativeElement.querySelectorAll('pre.highlight');
      for (const element of highlights) {
        element.setAttribute('class', 'prismjs highlight');
        if (window.Prism) {
          window.Prism.highlightAllUnder(element);
        }
      }

      // Manually add Angular encapsulation attribute to all elements at the end
      const descandants = this.elementRef.nativeElement.querySelectorAll('*');
      for (const element of descandants) {
        element.setAttribute(`_ngcontent-${this.appId}-${this._uniqueId}`, '');
      }
    });
  }
}
