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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isArray, isNil, remove } from 'lodash';
import { ReadFile, ReadMode } from 'ngx-file-helpers';
import { tap } from 'rxjs/operators';

import { NewFile } from './gio-form-file-picker.model';

type FileValue = {
  name: string;
  isNew: boolean;
  dataUrl: string;
  file?: File;
  isImage: boolean;
};

@Component({
  selector: 'gio-form-file-picker',
  templateUrl: './gio-form-file-picker.component.html',
  styleUrls: ['./gio-form-file-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioFormFilePickerComponent implements OnInit, ControlValueAccessor {
  @Input()
  public multiple = false;

  @Input()
  public accept = '*';

  @Input()
  public set disabled(disabled: boolean) {
    this.setDisabledState(disabled);
  }

  public fileValues: FileValue[] = [];
  public readMode: ReadMode = ReadMode.dataURL;
  public dragHover = false;
  public isDisabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeCallback: (files: (string | NewFile)[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouchedCallback = () => {};

  constructor(private changeDetectorRef: ChangeDetectorRef, @Self() @Optional() public ngControl?: NgControl) {
    if (ngControl) {
      // Setting the value accessor directly (instead of using
      // the providers `NG_VALUE_ACCESSOR`) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    if (this.ngControl && this.ngControl.statusChanges) {
      // As the change detection is OnPush we have to markForCheck the component after a validation change because no input/output or values have changed
      this.ngControl.statusChanges.pipe(tap(() => this.changeDetectorRef.markForCheck())).subscribe();
    }
  }

  public get isComplete(): boolean {
    return (!this.multiple && this.fileValues.length === 1) || false;
  }

  public get isValid(): boolean | null {
    return !this.ngControl || !this.ngControl.touched || this.ngControl.valid;
  }

  // implement by ControlValueAccessor
  public async writeValue(inputs?: string[]): Promise<void> {
    if (isNil(inputs) || !isArray(inputs)) {
      this.fileValues = [];
      return Promise.resolve();
    }

    this.fileValues = await Promise.all(
      inputs.map(async input => ({
        isNew: false,
        name: input,
        dataUrl: input,
        isImage: await isImgUrl(input),
      })),
    );
    this.changeDetectorRef.markForCheck();
  }

  // implement by ControlValueAccessor
  public registerOnChange(fn: (v: unknown) => void): void {
    this.onChangeCallback = fn;
  }

  // implement by ControlValueAccessor
  public registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  // implement by ControlValueAccessor
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  public onFilePicked(event: ReadFile): void {
    this.handleReceivedFileEvent(event);
  }

  public onFileDropped(event: ReadFile): void {
    this.handleReceivedFileEvent(event);
  }

  public onRemoveFile(file: FileValue): void {
    this.onTouchedCallback();
    this.dragHover = false;

    remove(this.fileValues, { name: file.name });

    this.emitFileValue();
  }

  public onTouched(): void {
    this.onTouchedCallback();
    this.dragHover = false;
  }

  public onDragEnter($event: DragEvent): void {
    const el = $event.target as HTMLElement | null;
    if (el) {
      this.dragHover = true;
      this.onTouchedCallback();
    }
  }

  public onDragOver($event: DragEvent): void {
    const el = $event.target as HTMLElement | null;

    if (el) {
      this.dragHover = false;
      this.onTouchedCallback();
    }
  }

  private handleReceivedFileEvent(event: ReadFile) {
    this.onTouchedCallback();

    this.dragHover = false;

    if (!this.multiple) {
      this.fileValues = [];
    }

    this.fileValues.push({
      name: event.name,
      isNew: true,
      dataUrl: event.content,
      file: event.underlyingFile,
      isImage: event.type.startsWith('image/'),
    });

    this.emitFileValue();
  }

  private emitFileValue() {
    this.onChangeCallback(
      this.fileValues.map(fileValue =>
        fileValue.isNew ? new NewFile(fileValue.name, fileValue.dataUrl, fileValue.file) : fileValue.dataUrl,
      ),
    );
  }
}

const isImgUrl = (url: string): Promise<boolean> => {
  try {
    const img = new Image();
    img.src = url;
    return new Promise(resolve => {
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
    });
  } catch (error) {
    return Promise.resolve(false);
  }
};
