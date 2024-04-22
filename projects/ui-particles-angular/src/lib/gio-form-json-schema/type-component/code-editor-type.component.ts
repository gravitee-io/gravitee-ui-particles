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
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';

import { MonacoEditorLanguageConfig } from '../../gio-monaco-editor/gio-monaco-editor.component';

export type GioMonacoEditorConfig = {
  language: 'json';
};

type CodeEditorProps = FormlyFieldProps & {
  monacoEditorConfig?: GioMonacoEditorConfig;
};

@Component({
  selector: 'gio-fjs-code-editor-type',
  template: `
    <gio-monaco-editor
      gioMonacoEditorFormField
      ngDefaultControl
      [formControl]="formControl"
      [languageConfig]="languageConfig"
    ></gio-monaco-editor>
  `,
  styles: [
    `
      gio-monaco-editor {
        min-height: 38px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioFjsCodeEditorTypeComponent extends FieldType<FieldTypeConfig<CodeEditorProps>> implements OnInit {
  public languageConfig?: MonacoEditorLanguageConfig;

  public ngOnInit(): void {
    const language = this.props.monacoEditorConfig?.language;

    switch (language) {
      case 'json':
        this.languageConfig = {
          language: 'json',
          schemas: [],
        };
        break;
      default:
        this.languageConfig = undefined;
    }
  }
}
