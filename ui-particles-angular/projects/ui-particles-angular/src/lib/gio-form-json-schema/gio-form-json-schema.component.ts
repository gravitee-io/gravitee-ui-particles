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
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { isObject } from 'lodash';

import { FormlyJSONSchema7 } from './model/FormlyJSONSchema7';

@Component({
  selector: 'gio-form-json-schema',
  template: `<formly-form [fields]="fields" [options]="options" [form]="formGroup"></formly-form>`,
})
export class GioFormJsonSchemaComponent {
  @Input()
  public set jsonSchema(jsonSchema: FormlyJSONSchema7) {
    if (isObject(jsonSchema)) {
      this.fields = [this.toFormlyFieldConfig(jsonSchema)];
    }
  }
  @Input()
  public formGroup: FormGroup = new FormGroup({});

  @Input()
  public options: FormlyFormOptions = {};

  public fields: FormlyFieldConfig[] = [];

  constructor(private readonly formlyJsonschema: FormlyJsonschema) {}

  private toFormlyFieldConfig(jsonSchema: FormlyJSONSchema7): FormlyFieldConfig {
    return this.formlyJsonschema.toFieldConfig(jsonSchema);
  }
}