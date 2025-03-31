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
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
import Ajv from 'ajv';

import GioJsonSchema from './model/GioJsonSchema.json';
import { FormlyJSONSchema7 } from './model/FormlyJSONSchema7';
import { GioJsonSchemaContext } from './model/GioJsonSchemaContext';

const ajv = new Ajv({ strict: false, logger: false });
@Component({
  selector: 'gio-demo',
  templateUrl: './gio-form-json-schema.stories.component.html',
  styleUrls: ['./gio-form-json-schema.stories.component.scss'],
  standalone: false,
})
export class DemoComponent implements OnChanges, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  public jsonSchema: FormlyJSONSchema7 = {};

  @Input()
  public initialValue = {};

  @Input()
  public isChromatic = false;

  @Input()
  public disabled = false;

  @Input()
  public withToggle = false;

  @Input()
  public context?: GioJsonSchemaContext;

  public form?: UntypedFormGroup;
  public options: FormlyFormOptions = {};
  public formValue: unknown;
  public formValueError?: string;
  public formValueErrorNumber?: number;

  public inputValueControl?: UntypedFormControl;
  public jsonSchemaControl?: UntypedFormControl;

  public monacoEditorJsonSchemaLanguage = {
    language: 'json',
    schemas: [
      {
        uri: 'http://myserver/foo-schema.json',
        schema: GioJsonSchema,
      },
    ],
  };
  public monacoEditorJsonLanguage = {
    language: 'json',
  };

  public monacoEditorReadonlyOptions = {
    readOnly: true,
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnChanges(): void {
    this.jsonSchemaControl = new UntypedFormControl(JSON.stringify(this.jsonSchema, null, 2));
    this.inputValueControl = new UntypedFormControl(JSON.stringify(this.initialValue, null, 2));

    combineLatest([
      this.jsonSchemaControl.valueChanges.pipe(startWith(this.jsonSchemaControl.value)),
      this.inputValueControl.valueChanges.pipe(startWith(this.inputValueControl.value)),
    ])
      .pipe(
        tap(() => {
          // Clear variable, wait, and re-init. To force sub components to re-render.
          this.form = undefined;
          this.formValue = undefined;
        }),
        debounceTime(500),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(([jsonSchemaValue, inputValue]) => {
        try {
          this.jsonSchema = JSON.parse(jsonSchemaValue);
          this.initialValue = JSON.parse(inputValue);

          this.resetUiPreview();
          this.changeDetectorRef.detectChanges();
        } catch (e) {
          // Ignore if not valid JSON
          return;
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  private resetUiPreview() {
    this.form = new UntypedFormGroup({
      schemaValue: new UntypedFormControl({
        value: this.initialValue,
        disabled: this.disabled ?? false,
      }),
    });
    this.changeDetectorRef.detectChanges();
    this.form.valueChanges.pipe(startWith(this.form.value), takeUntil(this.unsubscribe$)).subscribe(value => {
      this.formValue = value.schemaValue;
      this.validateSchema();
      this.changeDetectorRef.detectChanges();
    });
  }

  public validateSchema(): void {
    const schema = this.jsonSchema;
    const validate = ajv.compile(schema);
    validate(this.formValue);

    this.formValueError = JSON.stringify(validate.errors, null, 2) || undefined;
    this.formValueErrorNumber = validate.errors?.length || undefined;
  }

  public onSubmit(): void {
    // eslint-disable-next-line no-console
    console.log('onSubmit output:', this.form?.getRawValue().schemaValue);
  }

  public toggleDisabledProperty(toggle: boolean): void {
    toggle ? this.form?.disable() : this.form?.enable();
  }
}
