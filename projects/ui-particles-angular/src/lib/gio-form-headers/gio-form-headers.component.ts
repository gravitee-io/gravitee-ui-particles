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

import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, forwardRef, HostBinding, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { dropRight, isEmpty } from 'lodash';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ElColumns, GioUiTypeConfig } from '../gio-form-json-schema/model/GioJsonSchema';

export type Header = { key: string; value: string };

export type FormHeaderFieldMapper = {
  keyName: string;
  valueName: string;
};

export function isFormHeaderElConfig(value: unknown): value is ElColumns {
  const validValues = ['key', 'value', 'both', 'neither'];
  return validValues.includes(value as string);
}

const HEADER_NAMES = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Ranges',
  'Access-Control-Allow-Credentials',
  'Access-Control-Allow-Headers',
  'Access-Control-Allow-Methods',
  'Access-Control-Allow-Origin',
  'Access-Control-Expose-Headers',
  'Access-Control-Max-Age',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Method',
  'Age',
  'Allow',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Content-Disposition',
  'Content-Encoding',
  'Content-ID',
  'Content-Language',
  'Content-Length',
  'Content-Location',
  'Content-MD5',
  'Content-Range',
  'Content-Type',
  'Cookie',
  'Date',
  'ETag',
  'Expires',
  'Expect',
  'Forwarded',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Unmodified-Since',
  'Keep-Alive',
  'Last-Modified',
  'Location',
  'Link',
  'Max-Forwards',
  'MIME-Version',
  'Origin',
  'Pragma',
  'Proxy-Authenticate',
  'Proxy-Authorization',
  'Proxy-Connection',
  'Range',
  'Referer',
  'Retry-After',
  'Server',
  'Set-Cookie',
  'Set-Cookie2',
  'TE',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade',
  'User-Agent',
  'Vary',
  'Via',
  'Warning',
  'WWW-Authenticate',
  'X-Forwarded-For',
  'X-Forwarded-Proto',
  'X-Forwarded-Server',
  'X-Forwarded-Host',
  'X-Forwarded-Port',
  'X-Forwarded-Prefix',
];

@Component({
  selector: 'gio-form-headers',
  templateUrl: './gio-form-headers.component.html',
  styleUrls: ['./gio-form-headers.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GioFormHeadersComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GioFormHeadersComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class GioFormHeadersComponent implements OnInit, ControlValueAccessor, Validator {
  @Input()
  public headerFieldMapper: FormHeaderFieldMapper = {
    keyName: 'key',
    valueName: 'value',
  };
  @Input()
  public config: GioUiTypeConfig['uiTypeProps'] = {
    elColumns: 'neither',
  };

  @Input()
  public autocompleteDisabled?: boolean = false;

  public mainForm: UntypedFormGroup;
  public headersFormArray = new UntypedFormArray([
    new UntypedFormGroup({
      key: new UntypedFormControl('', Validators.pattern('^\\S*$')),
      value: new UntypedFormControl(''),
    }),
  ]);

  @HostBinding('class.disabled')
  public disabled = false;

  private headers: Header[] = [];

  private _onChange: (_headers: Header[] | null) => void = () => ({});

  private _onTouched: () => void = () => ({});

  private filteredHeaderNames: Observable<string[]>[] = [];

  constructor(
    private readonly fm: FocusMonitor,
    private readonly elRef: ElementRef,
  ) {
    this.mainForm = new UntypedFormGroup({
      headers: this.headersFormArray,
    });
  }

  // From ControlValueAccessor interface
  public writeValue(value: Record<string, string>[] | null): void {
    if (!value) {
      return;
    }

    this.headers = [...(value ?? [])].map((header: Record<string, string>) => {
      return {
        key: header[this.headerFieldMapper.keyName],
        value: header[this.headerFieldMapper.valueName],
      };
    });
    this.initHeadersForm();
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (headers: unknown) => void): void {
    if (this.headerFieldMapper) {
      this._onChange = (headers: Header[] | null) => fn(this.toHeaders(headers));
      return;
    }
    this._onChange = fn;
  }

  private toHeaders(headers: Header[] | null) {
    return [...(headers ?? [])].map(header => {
      return {
        [this.headerFieldMapper.keyName]: header.key,
        [this.headerFieldMapper.valueName]: header.value,
      };
    });
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled === this.disabled) {
      // do nothing if the disabled state is not changed
      return;
    }

    this.disabled = isDisabled;
    if (isDisabled) {
      this.headersFormArray.disable({ emitEvent: false });
      this.removeLastHeader();
      return;
    }
    this.headersFormArray.enable({ emitEvent: false });
    this.addEmptyHeader();
  }

  public ngOnInit(): void {
    // When user start to complete last header add new empty one a the end
    this.headersFormArray?.valueChanges
      .pipe(
        tap(headers => headers.length > 0 && this._onChange(removeLastEmptyHeader(headers))),
        tap((headers: Header[]) => {
          if (headers.length > 0 && (headers[headers.length - 1].key !== '' || headers[headers.length - 1].value !== '')) {
            this.addEmptyHeader();
          }
        }),
      )
      .subscribe();

    this.fm.monitor(this.elRef.nativeElement, true).subscribe(() => {
      this._onTouched();
    });
  }

  public initHeadersForm(): void {
    // Clear all previous headers
    this.headersFormArray.clear();

    // Populate headers array from headers
    this.headers.forEach(({ key, value }, headerIndex) => {
      this.headersFormArray.push(
        new UntypedFormGroup({
          key: this.initKeyFormControl(key, headerIndex),
          value: new UntypedFormControl({ value, disabled: this.disabled }),
        }),
        {
          emitEvent: false,
        },
      );
    });

    // add one empty header a the end
    this.addEmptyHeader();
  }

  public getFilteredHeaderNames(headerIndex: number, header: Header): Observable<string[]> {
    if (!this.filteredHeaderNames[headerIndex]) {
      return this.filteredHeaderNames[headerIndex];
    }
    if (header.key != null && header.key != '') {
      this.filteredHeaderNames[headerIndex] = of(header.key).pipe(map(value => this._filter(value)));
      return this.filteredHeaderNames[headerIndex];
    }
    return of(HEADER_NAMES);
  }

  // From Validator interface
  public validate(_control: AbstractControl): ValidationErrors | null {
    if (this.headersFormArray.invalid) {
      return { invalid: true };
    }
    return null;
  }

  private initKeyFormControl(key: string, headerIndex: number) {
    const control = new UntypedFormControl({ value: key, disabled: this.disabled }, Validators.pattern('^\\S*$'));
    const filteredKeys = control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.filteredHeaderNames.splice(headerIndex, 0, filteredKeys);
    return control;
  }

  public onDeleteHeader(headerIndex: number): void {
    this._onTouched();
    this.headersFormArray.removeAt(headerIndex);
  }

  private addEmptyHeader() {
    if (this.disabled) {
      return;
    }

    this.headersFormArray.push(
      new UntypedFormGroup({
        key: this.initKeyFormControl('', this.headersFormArray.length),
        value: new UntypedFormControl(''),
      }),
      { emitEvent: false },
    );
  }

  private removeLastHeader() {
    this.headersFormArray.removeAt(this.headersFormArray.length - 1, { emitEvent: false });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return HEADER_NAMES.filter(option => option.toLowerCase().includes(filterValue));
  }
}

const removeLastEmptyHeader = (headers: Header[]) => {
  const lastHeader = headers[headers.length - 1];

  if (lastHeader && isEmpty(lastHeader.key) && isEmpty(lastHeader.value)) {
    return dropRight(headers);
  }
  return headers;
};
