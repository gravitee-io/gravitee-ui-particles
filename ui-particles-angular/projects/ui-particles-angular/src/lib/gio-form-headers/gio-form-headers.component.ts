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

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { startWith, tap } from 'rxjs/operators';

export type Header = { key: string; value: string };

@Component({
  selector: 'gio-form-headers',
  templateUrl: './gio-form-headers.component.html',
  styleUrls: ['./gio-form-headers.component.scss'],
})
export class GioFormHeadersComponent implements OnInit, OnChanges {
  @Input()
  public headers: Header[] = [];

  public mainForm: FormGroup;
  public headersFormArray = new FormArray([]);

  constructor() {
    this.mainForm = new FormGroup({
      headers: this.headersFormArray,
    });
  }

  public ngOnInit(): void {
    this.headersFormArray.valueChanges
      .pipe(
        startWith([]),
        tap((headers: Header[]) => {
          if (headers.length == 0 || headers[headers.length - 1].key !== '' || headers[headers.length - 1].value !== '') {
            this.headersFormArray.push(
              new FormGroup({
                key: new FormControl(''),
                value: new FormControl(''),
              }),
              { emitEvent: false },
            );
          }
        }),
      )
      .subscribe();
  }

  public ngOnChanges(): void {
    this.headersFormArray.clear();

    this.headers.forEach(({ key, value }) => {
      this.headersFormArray.push(
        new FormGroup({
          key: new FormControl(key),
          value: new FormControl(value),
        }),
      );
    });
  }

  public onDeleteHeader(headerIndex: number): void {
    this.headersFormArray.removeAt(headerIndex);
  }
}
