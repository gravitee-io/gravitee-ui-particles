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
import { FormlyFormOptions } from '@ngx-formly/core';

import { FormlyJSONSchema7 } from './model/FormlyJSONSchema7';

@Component({
  selector: 'gio-demo',
  templateUrl: './gio-form-json-schema.stories.component.html',
  styleUrls: ['./gio-form-json-schema.stories.component.scss'],
})
export class DemoComponent {
  @Input()
  public jsonSchema: FormlyJSONSchema7 = {};

  public form = new FormGroup({});
  public options: FormlyFormOptions = {};

  public jsonSchemaChange(jsonSchema: string): void {
    this.jsonSchema = JSON.parse(jsonSchema);
  }

  public onSubmit(): void {
    alert(JSON.stringify(this.form.getRawValue(), null, 4));
  }
}
