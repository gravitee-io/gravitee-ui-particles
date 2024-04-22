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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GioMonacoEditorFormFieldDirective } from './gio-monaco-editor-form-field.directive';
import { GioMonacoEditorComponent } from './gio-monaco-editor.component';
import { GioMonacoEditorConfig, GIO_MONACO_EDITOR_CONFIG } from './models/GioMonacoEditorConfig';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [GioMonacoEditorComponent, GioMonacoEditorFormFieldDirective],
  exports: [GioMonacoEditorComponent, GioMonacoEditorFormFieldDirective],
  providers: [
    {
      provide: GIO_MONACO_EDITOR_CONFIG,
      useValue: {} as GioMonacoEditorConfig,
    },
  ],
})
export class GioMonacoEditorModule {
  public static forRoot(config: GioMonacoEditorConfig) {
    return {
      ngModule: GioMonacoEditorModule,
      providers: [
        {
          provide: GIO_MONACO_EDITOR_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
