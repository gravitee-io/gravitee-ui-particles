import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';

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
describe('GioFormJsonSchema', () => {
  @Component({
    template: `
      <form [formGroup]="form" (ngSubmit)="onSubmit(model)">
        <formly-form [form]="form" [fields]="fields"></formly-form>
        <button type="submit">Submit</button>
      </form>
    `,
  })
  class TestComponent {
    public form = new FormGroup({});
    public fields: FormlyFieldConfig[] = [];

    constructor(private readonly formlyJsonschema: FormlyJsonschema) {
      this.fields = [
        this.formlyJsonschema.toFieldConfig({
          type: 'object',
          properties: {
            simpleString: {
              title: 'Simple String',
              description: 'Simple string without validation',
              type: 'string',
            },
          },
        }),
      ];
    }
  }

  describe('GioFormJsonSchemaModule', () => {
    let fixture: ComponentFixture<TestComponent>;
    let loader: HarnessLoader;
    let testComponent: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [NoopAnimationsModule, ReactiveFormsModule, GioFormJsonSchemaModule],
      });
      fixture = TestBed.createComponent(TestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      testComponent = fixture.componentInstance;
    });

    it('should complete form field and submit', async () => {
      fixture.detectChanges();

      const simpleStringInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="simpleString"]' }));
      await simpleStringInput.setValue('What the fox say?');

      expect(testComponent.form.getRawValue()).toEqual({
        simpleString: 'What the fox say?',
      });
    });
  });
});
