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
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { A11yModule } from '@angular/cdk/a11y';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { GioIconsModule } from '../gio-icons/gio-icons.module';
import { GioFormSlideToggleModule } from '../gio-form-slide-toggle/gio-form-slide-toggle.module';
import { GioFormHeadersModule } from '../gio-form-headers/gio-form-headers.module';
import { GioMonacoEditorModule } from '../gio-monaco-editor/gio-monaco-editor.module';
import { GioFormCronModule } from '../gio-form-cron/gio-form-cron.module';

import { GioFjsNullTypeComponent } from './type-component/null-type.component';
import { GioFjsObjectTypeComponent } from './type-component/object-type.component';
import { GioFjsArrayTypeComponent } from './type-component/array-type.component';
import {
  typeValidationMessage,
  minLengthValidationMessage,
  maxLengthValidationMessage,
  minValidationMessage,
  maxValidationMessage,
  multipleOfValidationMessage,
  exclusiveMinimumValidationMessage,
  exclusiveMaximumValidationMessage,
  minItemsValidationMessage,
  maxItemsValidationMessage,
  constValidationMessage,
  patternValidationMessage,
} from './util/validation-message.util';
import { GioFormJsonSchemaComponent } from './gio-form-json-schema.component';
import { GioBannerWrapperComponent as GioBannerWrapperComponent } from './wrappers/gio-banner-wrapper.component';
import { bannerExtension } from './wrappers/gio-banner-extension';
import { GioFjsMultiSchemaTypeComponent } from './type-component/multischema-type.component';
import { GioFormlyJsonSchemaService } from './gio-formly-json-schema.service';
import { GioFjsToggleTypeComponent } from './type-component/toggle-type.component';
import { GioFjsHeadersTypeComponent } from './type-component/headers-type.component';
import { GioPasswordEyeWrapperComponent, passwordEyeExtension } from './wrappers/gio-password-eye.component';
import { GioFjsCodeEditorTypeComponent } from './type-component/code-editor-type.component';
import { GioFjsCronTypeComponent } from './type-component/cron-type.component';

@NgModule({
  declarations: [
    GioFormJsonSchemaComponent,
    GioFjsNullTypeComponent,
    GioFjsObjectTypeComponent,
    GioFjsMultiSchemaTypeComponent,
    GioFjsArrayTypeComponent,
    GioFjsToggleTypeComponent,
    GioFjsHeadersTypeComponent,
    GioFjsCodeEditorTypeComponent,
    GioFjsCronTypeComponent,
    GioBannerWrapperComponent,
    GioPasswordEyeWrapperComponent,
  ],
  imports: [
    CommonModule,
    A11yModule,
    ReactiveFormsModule,

    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'type', message: typeValidationMessage },
        { name: 'minLength', message: minLengthValidationMessage },
        { name: 'maxLength', message: maxLengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
        { name: 'multipleOf', message: multipleOfValidationMessage },
        { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
        { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
        { name: 'minItems', message: minItemsValidationMessage },
        { name: 'maxItems', message: maxItemsValidationMessage },
        { name: 'uniqueItems', message: 'Should NOT have duplicate items' },
        { name: 'const', message: constValidationMessage },
        { name: 'pattern', message: patternValidationMessage },
      ],
      wrappers: [
        { name: 'gio-with-banner', component: GioBannerWrapperComponent },
        { name: 'gio-password-eye', component: GioPasswordEyeWrapperComponent },
      ],
      types: [
        { name: 'null', component: GioFjsNullTypeComponent, wrappers: ['form-field'] },
        { name: 'array', component: GioFjsArrayTypeComponent },
        { name: 'object', component: GioFjsObjectTypeComponent },
        { name: 'multischema', component: GioFjsMultiSchemaTypeComponent },
        {
          name: 'toggle',
          component: GioFjsToggleTypeComponent,
        },
        {
          name: 'gio-code-editor',
          component: GioFjsCodeEditorTypeComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'gio-headers-array',
          component: GioFjsHeadersTypeComponent,
        },
        {
          name: 'gio-cron',
          component: GioFjsCronTypeComponent,
        },
      ],
      extensions: [
        { name: 'banner', extension: { onPopulate: bannerExtension } },
        { name: 'password-eye', extension: { onPopulate: passwordEyeExtension } },
      ],
      extras: {
        checkExpressionOn: 'changeDetectionCheck',
      },
    }),
    FormlyMaterialModule,

    MatInputModule,
    GioIconsModule,
    GioFormSlideToggleModule,
    GioFormHeadersModule,
    GioMonacoEditorModule,
    GioFormCronModule,

    MatSlideToggleModule,
    MatButtonModule,
  ],
  exports: [GioFormJsonSchemaComponent, FormlyModule],
  providers: [GioFormlyJsonSchemaService],
})
export class GioFormJsonSchemaModule {}
