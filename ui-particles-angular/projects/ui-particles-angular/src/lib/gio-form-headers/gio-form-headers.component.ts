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

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';

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
  public headersFormArray = new FormArray([
    new FormGroup({
      key: new FormControl(''),
      value: new FormControl(''),
    }),
  ]);

  constructor() {
    this.mainForm = new FormGroup({
      headers: this.headersFormArray,
    });
  }

  public ngOnInit(): void {
    // When user start to complete last header add new empty one a the end
    this.headersFormArray.valueChanges
      .pipe(
        tap((headers: Header[]) => {
          if (headers[headers.length - 1].key !== '' || headers[headers.length - 1].value !== '') {
            this.addEmptyHeader();
          }
        }),
      )
      .subscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.headers.currentValue !== changes.headers.previousValue) {
      // Clear all previous headers
      this.headersFormArray.clear();

      // Populate headers array from headers
      this.headers.forEach(({ key, value }) => {
        this.headersFormArray.push(
          new FormGroup({
            key: new FormControl(key),
            value: new FormControl(value),
          }),
          {
            emitEvent: false,
          },
        );
      });

      // add one empty header a the end
      this.addEmptyHeader();
    }
  }

  public onDeleteHeader(headerIndex: number): void {
    this.headersFormArray.removeAt(headerIndex);
  }

  private addEmptyHeader() {
    this.headersFormArray.push(
      new FormGroup({
        key: new FormControl(''),
        value: new FormControl(''),
      }),
      { emitEvent: false },
    );
  }
}
