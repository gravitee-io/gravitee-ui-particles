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
import { Pipe, PipeTransform } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { isEmpty } from 'lodash';

@Pipe({
  name: 'sbGetIconsList',
  standalone: false,
})
export class SbGetIconsListPipe implements PipeTransform {
  private icons: string[] = [];

  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    matIconRegistry.getSvgIconFromUrl(sanitizer.bypassSecurityTrustResourceUrl('assets/gio-icons.svg')).subscribe(icon => {
      icon.querySelectorAll('symbol').forEach(icon => this.icons.push(icon.id));
    });
  }

  public transform(_: never, search: string): string[] {
    if (isEmpty(search)) {
      return this.icons;
    }
    return this.icons.filter(name => name.toLowerCase().includes(search.toLowerCase()));
  }
}
