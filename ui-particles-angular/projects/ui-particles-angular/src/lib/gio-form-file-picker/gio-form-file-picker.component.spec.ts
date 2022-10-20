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
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { GioFormFilePickerInputHarness } from './gio-form-file-picker.component.harness';
import { NewFile } from './gio-form-file-picker.model';
import { GioFormFilePickerModule } from './gio-form-file-picker.module';

@Component({
  selector: 'gio-test-file-picker-input',
  template: `
    <form [formGroup]="myForm">
      <gio-form-file-picker
        formControlName="file"
        [multiple]="multiple"
        [accept]="accept"
        (ngModelChange)="ngModelChange()"
      ></gio-form-file-picker>
      <gio-form-file-picker
        formControlName="fileRequired"
        [multiple]="multiple"
        [accept]="accept"
        (ngModelChange)="ngModelChange()"
      ></gio-form-file-picker>
    </form>
  `,
})
export class TestFilePickerInputComponent {
  public multiple = false;
  public accept = '*';
  public ngModelChange: () => void = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  public myForm = new FormBuilder().group({
    file: [],
    fileRequired: [undefined, Validators.required],
  });
}

describe('FilePickerInputComponent', () => {
  let loader: HarnessLoader;
  let fixture: ComponentFixture<TestFilePickerInputComponent>;
  let component: TestFilePickerInputComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, GioFormFilePickerModule, MatIconTestingModule],
        declarations: [TestFilePickerInputComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFilePickerInputComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    GioFormFilePickerInputHarness.forceImageOnload(['file.json']);
  });

  it('should have accept input', async () => {
    component.accept = 'images/*';
    fixture.detectChanges();

    const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
    expect(await filePickerInputHarness.getInputFileAccept()).toEqual('images/*');
  });

  describe('with multiple=false', () => {
    beforeEach(() => {
      component.multiple = false;
      fixture.detectChanges();
    });

    it('should add drop file to the form', async () => {
      const FILE = newFile('file.png');

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
      await filePickerInputHarness.dropFiles([FILE]);

      expect(component.myForm.controls.file.value).toEqual([
        {
          dataUrl: expect.any(String),
          file: FILE,
          name: FILE.name,
        },
      ]);
      expect(component.myForm.controls.file.value[0]).toBeInstanceOf(NewFile);
    });
  });

  describe('with multiple=true', () => {
    beforeEach(() => {
      component.multiple = true;
      fixture.detectChanges();
    });

    it('should add drop files to the form', async () => {
      const FILES = [newFile('file1.png'), newFile('file2.png')];

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
      await filePickerInputHarness.dropFiles(FILES);

      expect(component.myForm.controls.file.value).toEqual([
        { dataUrl: expect.any(String), file: FILES[0], name: 'file1.png' },
        { dataUrl: expect.any(String), file: FILES[1], name: 'file2.png' },
      ]);
    });
  });

  describe('with error', () => {
    it('should add error class after the form is touched ', async () => {
      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'fileRequired' }));

      expect(await filePickerInputHarness.hasErrorClass()).toEqual(false);

      await filePickerInputHarness.clickInside();
      fixture.detectChanges();

      expect(await filePickerInputHarness.hasErrorClass()).toEqual(true);
      expect(component.myForm.touched).toEqual(true);
      expect(component.myForm.dirty).toEqual(false);
    });
  });

  describe('with init values', () => {
    it('should display the remote file', async () => {
      component.myForm.controls.file.setValue(['file.json']);
      fixture.detectChanges();

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));

      const previewImages = await filePickerInputHarness.getPreviews();
      expect(previewImages).toEqual(['file.json']);
      expect(await filePickerInputHarness.isAddButtonPresent()).toBeFalsy();
    });

    it('should display the remote image file', async () => {
      component.myForm.controls.file.setValue(['rperr-aa.png']);
      fixture.detectChanges();

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));

      const previewImages = await filePickerInputHarness.getPreviews();
      expect(previewImages).toEqual(['background-image: url(rperr-aa.png);']);
      expect(await filePickerInputHarness.isAddButtonPresent()).toBeFalsy();
    });

    it('should display the multiple remote files', async () => {
      component.myForm.controls.file.setValue(['rperr-aa.png', 'mschaller-shocked.gif']);
      component.multiple = true;
      fixture.detectChanges();

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));

      const previewImages = await filePickerInputHarness.getPreviews();
      expect(previewImages).toEqual(['background-image: url(rperr-aa.png);', 'background-image: url(mschaller-shocked.gif);']);
      expect(await filePickerInputHarness.isAddButtonPresent()).toBeTruthy();
    });

    it('should return initial input values and new dropped file', async () => {
      const INITIAL_VALUES = ['gbihet-ça-tricote-pas.png', 'gmaisse-lapin-réjoui.jpg'];
      component.myForm.controls.file.setValue(INITIAL_VALUES);
      component.multiple = true;
      fixture.detectChanges();
      const FILE = newFile('actual-file.png');

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
      await filePickerInputHarness.dropFiles([FILE]);

      expect(component.myForm.controls.file.value).toEqual([
        ...INITIAL_VALUES,
        {
          dataUrl: expect.any(String),
          file: FILE,
          name: 'actual-file.png',
        },
      ]);
    });

    it('should remove initial input value', async () => {
      component.myForm.controls.file.setValue(['tavenier-selfie-réjoui.tiff']);
      component.ngModelChange = jest.fn();

      fixture.detectChanges();

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
      await filePickerInputHarness.deleteFile();

      expect(component.myForm.controls.file.value).toEqual([]);
    });

    it('should remove added file', async () => {
      const INITIAL_VALUES = [
        'savon-ça-coupe.tiff',
        'gbihet-ça-tricote-pas.png',
        {
          dataUrl: 'data:image/png;base64,',
          isImage: true,
          isNew: false,
          name: 'gmaisse-lapin-réjoui.jpg',
        },
      ];
      component.myForm.controls.file.setValue(INITIAL_VALUES);
      component.multiple = true;
      fixture.detectChanges();
      const FILE = newFile('actual-file.png');
      const FILE_TO_REMOVE = newFile('gio-gio-blink.gif');

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
      await filePickerInputHarness.dropFiles([FILE, FILE_TO_REMOVE]);
      await filePickerInputHarness.deleteFile(1); // Delete the second initial value
      await filePickerInputHarness.deleteFile(3); // Delete the last dropped file

      expect(component.myForm.controls.file.value).toEqual([
        INITIAL_VALUES[0],
        INITIAL_VALUES[2],
        {
          dataUrl: expect.any(String),
          file: FILE,
          name: 'actual-file.png',
        },
      ]);
    });

    it('should remove added file when form reset()', async () => {
      const INITIAL_VALUES = ['gbihet-ça-tricote-pas.png', 'gmaisse-lapin-réjoui.jpg'];
      component.myForm.controls.file.setValue(INITIAL_VALUES);
      component.multiple = true;
      fixture.detectChanges();
      const FILE = newFile('actual-file.png');

      const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));
      await filePickerInputHarness.dropFiles([FILE]);

      expect(component.myForm.controls.file.value).toEqual([
        ...INITIAL_VALUES,
        {
          dataUrl: expect.any(String),
          file: FILE,
          name: 'actual-file.png',
        },
      ]);
      expect((await filePickerInputHarness.getPreviews()).length).toEqual(3);

      component.myForm.reset();
      expect(component.myForm.controls.file.value).toEqual(null);
      expect((await filePickerInputHarness.getPreviews()).length).toEqual(0);
    });

    describe('disabled component', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should disable with form control', async () => {
        component.myForm.controls.file.disable();

        const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));

        expect(await filePickerInputHarness.isDisabled()).toEqual(true);
        expect(await filePickerInputHarness.isAddButtonPresent()).toBeFalsy();
      });

      it('should load placeholder correctly', async () => {
        component.myForm.controls.file.disable();
        const filePickerInputHarness = await loader.getHarness(GioFormFilePickerInputHarness.with({ formControlName: 'file' }));

        expect(await filePickerInputHarness.isDisabled()).toEqual(true);
        expect(await filePickerInputHarness.isAddButtonPresent()).toBeFalsy();
      });
    });
  });
});

function newFile(fileName: string) {
  return new File([''], fileName, {});
}
