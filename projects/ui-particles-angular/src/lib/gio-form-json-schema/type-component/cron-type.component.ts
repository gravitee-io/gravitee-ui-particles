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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';

type CronProps = FormlyFieldProps;

@Component({
  selector: 'gio-fjs-code-editor-type',
  template: `
    <gio-form-cron [formControl]="formControl">
      <gio-form-cron-label *ngIf="props.label">{{ props.label }}</gio-form-cron-label>
      <gio-form-cron-hint *ngIf="props.description">{{ props.description }}</gio-form-cron-hint>
    </gio-form-cron>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioFjsCronTypeComponent extends FieldType<FieldTypeConfig<CronProps>> {}
