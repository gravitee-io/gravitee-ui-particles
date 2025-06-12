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
import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSuffix } from '@angular/material/form-field';

import { GioElEditorHelperToggleComponent } from '../gio-el-editor-helper/gio-el-editor-helper-toggle.component';
import { GioElEditorInputComponent } from '../gio-el-editor-input/gio-el-editor-input.component';
import { GioElEditorHelperInputDirective } from '../gio-el-editor-helper/gio-el-editor-helper-input.directive';

import { GioFjsElInputTypeComponent } from './el-input-type.component';
import { GioElHelperWrapperComponent } from './gio-el-helper-wrapper.component';

@NgModule({
  declarations: [GioFjsElInputTypeComponent, GioElHelperWrapperComponent],
  imports: [
    GioElEditorInputComponent,
    GioElEditorHelperToggleComponent,
    GioElEditorHelperInputDirective,
    FormlyModule.forChild({
      types: [
        {
          name: 'gio-el-input',
          component: GioFjsElInputTypeComponent,
          defaultOptions: {
            props: {
              displayMode: 'input',
            },
          },
          wrappers: ['form-field', 'gio-el-helper'],
        },
        {
          name: 'gio-el-textarea',
          component: GioFjsElInputTypeComponent,
          defaultOptions: {
            props: {
              displayMode: 'textarea',
            },
          },
          wrappers: ['form-field', 'gio-el-helper'],
        },
      ],
      wrappers: [{ name: 'gio-el-helper', component: GioElHelperWrapperComponent }],
    }),
    ReactiveFormsModule,
    MatSuffix,
  ],
})
export class GioElFormJsonSchemaChildModule {}
