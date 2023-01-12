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
import { capitalize } from 'lodash';

import { FormlyJSONSchema7 } from './model/FormlyJSONSchema7';
import { fakeInteger } from './testing-json-schema/integer';
import { fakeMixed } from './testing-json-schema/mixed';
import { fakeString } from './testing-json-schema/string';

const JSON_SCHEMA_MAP: Record<string, FormlyJSONSchema7> = {
  mixed: fakeMixed,
  string: fakeString,
  integer: fakeInteger,
};

@Component({
  selector: 'gio-demo',
  templateUrl: './gio-form-json-schema.stories.component.html',
})
export class DemoComponent {
  @Input()
  public set jsonSchemaName(v: string) {
    const jsonSchema = JSON_SCHEMA_MAP[v];
    if (!jsonSchema) {
      throw new Error(`No JSON schema found for name ${v}`);
    }
    this.fields = [this.formlyJsonschema.toFieldConfig(jsonSchema)];
    this.title = capitalize(v);
  }

  public title = 'Demo';
  public form = new FormGroup({});
  public options: FormlyFormOptions = {};
  public fields: FormlyFieldConfig[] = [];

  constructor(private readonly formlyJsonschema: FormlyJsonschema) {}

  public onSubmit(): void {
    alert(JSON.stringify(this.form.getRawValue(), null, 4));
  }
}
