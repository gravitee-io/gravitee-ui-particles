/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { GioMonacoEditorModule } from '@gravitee/ui-particles-angular';

@Component({
  selector: 'gio-mcp-tools-editor',
  imports: [ReactiveFormsModule, GioMonacoEditorModule, GioMonacoEditorModule],
  templateUrl: './gio-mcp-tools-editor.component.html',
  styleUrl: './gio-mcp-tools-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GioMcpToolsEditorComponent),
      multi: true,
    },
  ],
})
export class GioMcpToolsEditorComponent implements ControlValueAccessor {
  public control = new FormControl<string>('', { nonNullable: true });

  private onChange: (_: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.control.valueChanges.subscribe(value => {
      this.onChange(this.transformToToolsValue(value));
    });
  }

  public writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });

    // Update parent form with the transformed tools value on init
    setTimeout(() => {
      this.onChange(this.transformToToolsValue(value));
    });
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  private transformToToolsValue(value: string): string {
    // Transform the value to the desired format
    return value.toUpperCase();
  }
}
