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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Header } from './gio-form-headers.component';
import { GioFormHeadersHarness } from './gio-form-headers.harness';
import { GioFormHeadersModule } from './gio-form-headers.module';

@Component({
  template: `<gio-form-headers [headers]="headers"></gio-form-headers> `,
})
class TestComponent {
  public headers: Header[] = [];
}

describe('GioFormHeadersModule', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  const HEADERS = [
    {
      key: 'host',
      value: 'api.gravitee.io',
    },
    {
      key: 'accept',
      value: '*/*',
    },
    {
      key: 'connection',
      value: 'keep-alive',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, GioFormHeadersModule, MatIconTestingModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display headers', async () => {
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);
    fixture.componentInstance.headers = HEADERS;

    const headerRows = await formHeaders.getHeaderRows();

    const headers = await Promise.all(
      headerRows.map(async row => ({
        key: await row.keyInput.getValue(),
        value: await row.valueInput.getValue(),
      })),
    );

    expect(headers).toEqual([
      ...HEADERS,
      {
        key: '',
        value: '',
      },
    ]);
  });

  it('should add new header', async () => {
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    expect((await formHeaders.getHeaderRows()).length).toEqual(1);

    // Add header on last header row
    const emptyLastHeaderRow = await formHeaders.getLastHeaderRow();
    await emptyLastHeaderRow.keyInput.setValue('host');

    // Expect new row was added
    expect((await formHeaders.getHeaderRows()).length).toEqual(2);

    await emptyLastHeaderRow.valueInput.setValue('api.gravitee.io');

    const addedHeaderRow = (await formHeaders.getHeaderRows())[0];
    expect({ key: await addedHeaderRow.keyInput.getValue(), value: await addedHeaderRow.valueInput.getValue() }).toEqual({
      key: 'host',
      value: 'api.gravitee.io',
    });
  });

  it('should edit header', async () => {
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);
    fixture.componentInstance.headers = HEADERS;

    const headerRowToEdit = (await formHeaders.getHeaderRows())[1];

    await headerRowToEdit.keyInput.setValue('Content-Type');
    await headerRowToEdit.valueInput.setValue('text/html; charset=UTF-8');

    const editedHeaderRow = (await formHeaders.getHeaderRows())[1];
    expect({ key: await editedHeaderRow.keyInput.getValue(), value: await editedHeaderRow.valueInput.getValue() }).toEqual({
      key: 'Content-Type',
      value: 'text/html; charset=UTF-8',
    });
  });
});
