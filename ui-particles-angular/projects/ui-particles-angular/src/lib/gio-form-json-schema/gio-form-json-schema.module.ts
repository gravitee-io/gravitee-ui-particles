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

import { GioIconsModule } from '../gio-icons/gio-icons.module';

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
} from './util/validation-message.util';
import { GioFormJsonSchemaComponent } from './gio-form-json-schema.component';
import { GioFormFieldWrapperComponent } from './wrappers/gio-form-field-wrapper.component';
import { bannerExtension } from './wrappers/gio-banner-extension';
import { GioFjsMultiSchemaTypeComponent } from './type-component/multischema-type.component';

@NgModule({
  declarations: [
    GioFormJsonSchemaComponent,
    GioFjsNullTypeComponent,
    GioFjsObjectTypeComponent,
    GioFjsMultiSchemaTypeComponent,
    GioFjsArrayTypeComponent,
    GioFormFieldWrapperComponent,
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
      ],
      wrappers: [{ name: 'gio-with-banner', component: GioFormFieldWrapperComponent }],
      types: [
        { name: 'null', component: GioFjsNullTypeComponent, wrappers: ['form-field'] },
        { name: 'array', component: GioFjsArrayTypeComponent },
        { name: 'object', component: GioFjsObjectTypeComponent },
        { name: 'multischema', component: GioFjsMultiSchemaTypeComponent },
      ],
      extensions: [{ name: 'banner', extension: { onPopulate: bannerExtension } }],
      extras: {
        checkExpressionOn: 'changeDetectionCheck',
      },
    }),
    FormlyMaterialModule,
    GioIconsModule,
  ],
  exports: [GioFormJsonSchemaComponent, FormlyModule],
})
export class GioFormJsonSchemaModule {}
