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
import { Component, ContentChild } from '@angular/core';

import { GioMonacoEditorComponent } from './gio-monaco-editor.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[gioMonacoClipboardCopy]',
  styleUrls: ['./gio-monaco-clipboard-copy.component.scss'],
  template: `
    <div class="editor-wrapper">
      <ng-content></ng-content>
      <gio-clipboard-copy-icon class="copy-btn" [contentToCopy]="monacoEditor?.value ?? ''"></gio-clipboard-copy-icon>
    </div>
  `,
  standalone: false,
})
export class GioMonacoClipboardCopyComponent {
  @ContentChild(GioMonacoEditorComponent, { static: false })
  public monacoEditor: GioMonacoEditorComponent | null = null;
}
