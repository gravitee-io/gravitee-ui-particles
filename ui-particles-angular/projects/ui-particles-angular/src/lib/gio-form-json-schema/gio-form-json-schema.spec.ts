import { InteractivityChecker } from '@angular/cdk/a11y';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GioFormJsonSchemaComponent } from './gio-form-json-schema.component';
import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';
import { GioJsonSchema } from './model/GioJsonSchema';

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
        <gio-form-json-schema formControlName="config" [jsonSchema]="jsonSchema"></gio-form-json-schema>
        <button type="submit">Submit</button>
      </form>
    `,
  })
  class TestComponent {
    public form = new FormGroup({
      config: new FormControl(),
    });
    public jsonSchema: GioJsonSchema = {};
  }

  describe('GioFormJsonSchemaModule', () => {
    let fixture: ComponentFixture<TestComponent>;
    let loader: HarnessLoader;
    let testComponent: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [NoopAnimationsModule, ReactiveFormsModule, GioFormJsonSchemaModule],
      }).overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true, // This checks focus trap, set it to true to  avoid the warning
        },
      });
      fixture = TestBed.createComponent(TestComponent);
      loader = TestbedHarnessEnvironment.loader(fixture);
      testComponent = fixture.componentInstance;
    });

    it('should complete form field and submit', async () => {
      fixture.componentInstance.jsonSchema = {
        type: 'object',
        properties: {
          simpleString: {
            title: 'Simple String',
            description: 'Simple string without validation',
            type: 'string',
          },
        },
      };
      fixture.detectChanges();
      expect(testComponent.form.touched).toEqual(false);
      expect(testComponent.form.dirty).toEqual(false);

      const simpleStringInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="simpleString"]' }));
      await simpleStringInput.setValue('What the fox say?');

      expect(testComponent.form.get('config')?.value).toEqual({
        simpleString: 'What the fox say?',
      });
      expect(testComponent.form.touched).toEqual(true);
      expect(testComponent.form.dirty).toEqual(true);

      // No banner on simple elements
      const banner = fixture.nativeElement.querySelector('.banner');
      expect(banner).toBeNull();
    });

    it('should show banner', async () => {
      fixture.componentInstance.jsonSchema = {
        type: 'object',
        properties: {
          stringWithBanner: {
            title: 'String with banner',
            description: 'Simple string with banner',
            type: 'string',
            gioConfig: {
              banner: {
                title: 'banner title',
                text: 'banner text',
              },
            },
          },
        },
      };

      fixture.detectChanges();
      const banner = fixture.nativeElement.querySelector('.banner');
      expect(banner).toBeDefined();
      expect(banner.textContent).toContain('banner title');
      expect(banner.textContent).toContain('banner text');
    });
  });

  describe('GioFormJsonSchemaComponentisDisplayable', () => {
    it('should return true if schema has properties', () => {
      const schema: GioJsonSchema = {
        type: 'object',
        properties: {
          simpleString: {
            title: 'Simple String',
            description: 'Simple string without validation',
            type: 'string',
          },
        },
      };
      expect(GioFormJsonSchemaComponent.isDisplayable(schema)).toEqual(true);
    });

    it('should return true if schema has oneOf', () => {
      const schema: GioJsonSchema = {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            properties: {
              simpleString: {
                title: 'Simple String',
                description: 'Simple string without validation',
                type: 'string',
              },
            },
          },
        ],
      };
      expect(GioFormJsonSchemaComponent.isDisplayable(schema)).toEqual(true);
    });

    it('should return false if schema has no properties or oneOf', () => {
      const schema: GioJsonSchema = {
        type: 'object',
        properties: {},
        oneOf: [],
      };
      expect(GioFormJsonSchemaComponent.isDisplayable(schema)).toEqual(false);
    });
  });
});
