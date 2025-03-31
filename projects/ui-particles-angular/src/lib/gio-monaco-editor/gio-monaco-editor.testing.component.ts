/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { Component } from '@angular/core';

import { GioMonacoEditorComponent } from './gio-monaco-editor.component';

/**
 * This component is used to test the GioMonacoEditorComponent.
 * This component simulates monaco editor with a simple input.
 */
@Component({
  selector: 'gio-monaco-editor',
  template: '<input type="text" [value]="getValue" [disabled]="readOnly" (input)="changeValue($any($event).target?.value)" />',
  standalone: false,
})
export class GioMonacoEditorTestingComponent extends GioMonacoEditorComponent {
  public get getValue(): string {
    return this.value;
  }

  public changeValue(value: string) {
    this._onTouched();
    this._onChange(value);
  }
}
