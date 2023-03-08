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
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { FormlyJSONSchema7 } from './model/FormlyJSONSchema7';

@Component({
  selector: 'gio-demo',
  templateUrl: './gio-form-json-schema.stories.component.html',
  styleUrls: ['./gio-form-json-schema.stories.component.scss'],
})
export class DemoComponent implements OnChanges, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  public jsonSchema: FormlyJSONSchema7 = {};

  @Input()
  public initialValue = {};

  public form?: FormGroup;
  public options: FormlyFormOptions = {};

  public formValue: unknown;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnChanges(): void {
    this.form = new FormGroup({
      schemaValue: new FormControl(this.initialValue),
    });
    this.form.valueChanges.pipe(takeUntil(this.unsubscribe$), startWith(this.form.value)).subscribe(value => {
      this.formValue = value;
      this.changeDetectorRef.detectChanges();
    });
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  public jsonSchemaChange(jsonSchema: string): void {
    this.jsonSchema = JSON.parse(jsonSchema);
  }

  public onSubmit(): void {
    // eslint-disable-next-line no-console
    console.log('onSubmit output:', this.form?.getRawValue().schemaValue);
  }
}
