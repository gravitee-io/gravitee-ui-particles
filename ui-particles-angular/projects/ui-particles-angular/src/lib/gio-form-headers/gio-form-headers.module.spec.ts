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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Header } from './gio-form-headers.component';
import { GioFormHeadersHarness } from './gio-form-headers.harness';
import { GioFormHeadersModule } from './gio-form-headers.module';

@Component({
  template: `<gio-form-headers [formControl]="headersControl" [adaptOutputFn]="adaptOutputFn"></gio-form-headers> `,
})
class TestComponent {
  public headersControl = new FormControl([]);
  public adaptOutputFn: unknown = undefined;
}

describe('GioFormHeadersModule', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let testComponent: TestComponent;

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
      imports: [NoopAnimationsModule, GioFormHeadersModule, MatIconTestingModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    testComponent = fixture.componentInstance;
  });

  it('should display headers', async () => {
    testComponent.headersControl.setValue(HEADERS);
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

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

    let addedHeaderRow = (await formHeaders.getHeaderRows())[0];
    expect({ key: await addedHeaderRow.keyInput.getValue(), value: await addedHeaderRow.valueInput.getValue() }).toEqual({
      key: 'host',
      value: 'api.gravitee.io',
    });

    // Expect new row was added
    await formHeaders.addHeader({ key: 'accept', value: '*/*' });

    addedHeaderRow = (await formHeaders.getHeaderRows())[1];
    expect({ key: await addedHeaderRow.keyInput.getValue(), value: await addedHeaderRow.valueInput.getValue() }).toEqual({
      key: 'accept',
      value: '*/*',
    });

    expect(testComponent.headersControl.value).toEqual([
      { key: 'host', value: 'api.gravitee.io' },
      { key: 'accept', value: '*/*' },
    ]);
  });

  it('should edit header', async () => {
    testComponent.headersControl.setValue(HEADERS);
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    const headerRowToEdit = (await formHeaders.getHeaderRows())[1];

    await headerRowToEdit.keyInput.setValue('Content-Type');
    await headerRowToEdit.valueInput.setValue('text/html; charset=UTF-8');

    const editedHeaderRow = (await formHeaders.getHeaderRows())[1];
    expect({ key: await editedHeaderRow.keyInput.getValue(), value: await editedHeaderRow.valueInput.getValue() }).toEqual({
      key: 'Content-Type',
      value: 'text/html; charset=UTF-8',
    });

    expect(testComponent.headersControl.value).toEqual([
      HEADERS[0],
      {
        key: 'Content-Type',
        value: 'text/html; charset=UTF-8',
      },
      HEADERS[2],
    ]);
  });

  it('should remove header row', async () => {
    testComponent.headersControl.setValue(HEADERS);
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    const initialHeaderRows = await formHeaders.getHeaderRows();
    expect(initialHeaderRows.length).toEqual(4);

    const headerRowToRemove = initialHeaderRows[1];
    await headerRowToRemove.removeButton?.click();

    const newHeaderRows = await formHeaders.getHeaderRows();
    expect(newHeaderRows.length).toEqual(3);

    // Check last row dose not have remove button
    expect(newHeaderRows[2].removeButton).toEqual(null);

    expect(testComponent.headersControl.value).toEqual([HEADERS[0], HEADERS[2]]);
  });

  it('should handle touched & dirty on focus and change value', async () => {
    testComponent.headersControl.setValue(HEADERS);
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    expect(testComponent.headersControl.touched).toEqual(false);
    expect(testComponent.headersControl.dirty).toEqual(false);

    await (await formHeaders.getHeaderRows())[0].keyInput.focus();

    expect(testComponent.headersControl.touched).toEqual(true);
    expect(testComponent.headersControl.dirty).toEqual(false);

    await (await formHeaders.getHeaderRows())[0].keyInput.setValue('Content-Type');

    expect(testComponent.headersControl.touched).toEqual(true);
    expect(testComponent.headersControl.dirty).toEqual(true);
  });

  it('should handle touched & dirty on focus and change value', async () => {
    testComponent.headersControl.setValue(HEADERS);
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    expect(testComponent.headersControl.touched).toEqual(false);
    expect(testComponent.headersControl.dirty).toEqual(false);

    await (await formHeaders.getHeaderRows())[0].removeButton?.click();

    expect(testComponent.headersControl.touched).toEqual(true);
    expect(testComponent.headersControl.dirty).toEqual(true);
  });

  it('should filter header keys', async () => {
    testComponent.headersControl.setValue(HEADERS);
    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    const headerRowToEdit = (await formHeaders.getHeaderRows())[1];
    await headerRowToEdit.keyInput.setValue('');
    let matOptionHarnesses = await headerRowToEdit.keyAutocomplete.getOptions();
    expect(matOptionHarnesses.length).toEqual(71);

    await headerRowToEdit.keyInput.setValue('Content-Type');
    matOptionHarnesses = await headerRowToEdit.keyAutocomplete.getOptions();
    expect(matOptionHarnesses.length).toEqual(1);
  });

  it('should display disabled headers', async () => {
    testComponent.headersControl.setValue([]);
    fixture.detectChanges();
    testComponent.headersControl.disable();
    fixture.detectChanges();
    testComponent.headersControl.setValue(HEADERS);
    fixture.detectChanges();

    const formHeaders = await loader.getHarness(GioFormHeadersHarness);
    expect(await formHeaders.isDisabled()).toEqual(true);

    const headerRows = await formHeaders.getHeaderRows();

    expect(await headerRows[0].keyInput.isDisabled()).toEqual(true);
    expect(await headerRows[0].valueInput.isDisabled()).toEqual(true);

    const headers = await Promise.all(
      headerRows.map(async row => ({
        key: await row.keyInput.getValue(),
        value: await row.valueInput.getValue(),
      })),
    );
    expect(headers).toEqual(HEADERS);
  });

  it('should change output with `adaptOutputFn`', async () => {
    testComponent.adaptOutputFn = (headers: Header[]) => headers.map(header => ({ name: header.key, value: header.value }));

    const formHeaders = await loader.getHarness(GioFormHeadersHarness);

    expect((await formHeaders.getHeaderRows()).length).toEqual(1);

    // Add header on last header row
    const emptyLastHeaderRow = await formHeaders.getLastHeaderRow();
    await emptyLastHeaderRow.keyInput.setValue('host');
    await emptyLastHeaderRow.valueInput.setValue('api.gravitee.io');

    expect(testComponent.headersControl.value).toEqual([{ name: 'host', value: 'api.gravitee.io' }]);
  });
});
