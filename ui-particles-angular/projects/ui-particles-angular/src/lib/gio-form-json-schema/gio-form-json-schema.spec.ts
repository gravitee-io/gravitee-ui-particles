import { InteractivityChecker } from '@angular/cdk/a11y';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { GioJsonSchema } from './model/GioJsonSchema';
import { GioFormJsonSchemaModule } from './gio-form-json-schema.module';
import { GioFormJsonSchemaComponent } from './gio-form-json-schema.component';

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
      <form [formGroup]="form">
        <gio-form-json-schema *ngIf="jsonSchema" formControlName="config" [jsonSchema]="jsonSchema"></gio-form-json-schema>
        <button type="submit">Submit</button>
      </form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestComponent {
    public form = new FormGroup({
      config: new FormControl(),
    });
    public jsonSchema?: GioJsonSchema;

    public disableFormFields() {
      this.form.disable();
    }

    public enableFormFields() {
      this.form.enable();
    }
  }

  describe('GioFormJsonSchemaModule', () => {
    let fixture: ComponentFixture<TestComponent>;
    let loader: HarnessLoader;
    let testComponent: TestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [NoopAnimationsModule, ReactiveFormsModule, GioFormJsonSchemaModule, MatIconTestingModule],
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
      expect(testComponent.form.valid).toEqual(true);
      expect(testComponent.form.status).toEqual('VALID');
      expect(testComponent.form.invalid).toEqual(false); // Valid after initialization

      const simpleStringInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="simpleString"]' }));
      await simpleStringInput.setValue('What the fox say?');

      expect(testComponent.form.get('config')?.value).toEqual({
        simpleString: 'What the fox say?',
      });
      expect(testComponent.form.touched).toEqual(true);
      expect(testComponent.form.dirty).toEqual(true);
      expect(testComponent.form.invalid).toEqual(false);

      // No banner on simple elements
      const banner = fixture.nativeElement.querySelector('.banner');
      expect(banner).toBeNull();
    });

    it('should init invalid form', async () => {
      fixture.componentInstance.jsonSchema = {
        type: 'object',
        properties: {
          simpleString: {
            title: 'Simple String',
            description: 'Simple string without validation',
            type: 'string',
          },
        },
        required: ['simpleString'],
      };
      fixture.detectChanges();
      await fixture.whenStable();
      expect(testComponent.form.touched).toEqual(false);
      expect(testComponent.form.dirty).toEqual(false);
      expect(testComponent.form.invalid).toEqual(true);
    });

    it('should switch between valid and invalid state', async () => {
      fixture.componentInstance.jsonSchema = {
        type: 'object',
        properties: {
          simpleString: {
            title: 'Simple String',
            description: 'Simple string without validation',
            type: 'string',
          },
        },
        required: ['simpleString'],
      };
      fixture.detectChanges();
      await fixture.whenStable();
      expect(testComponent.form.touched).toEqual(false);
      expect(testComponent.form.dirty).toEqual(false);
      expect(testComponent.form.status).toEqual('INVALID');
      expect(testComponent.form.invalid).toEqual(true);

      const simpleStringInput = await loader.getHarness(MatInputHarness.with({ selector: '[id*="simpleString"]' }));
      await simpleStringInput.setValue('a');

      expect(testComponent.form.touched).toEqual(true);
      expect(testComponent.form.dirty).toEqual(true);
      expect(testComponent.form.invalid).toEqual(false);

      await simpleStringInput.setValue('');
      expect(testComponent.form.invalid).toEqual(true);
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

    describe('disable/enable toggle tests', () => {
      it('should disable all form fields in the array', fakeAsync(async () => {
        fixture.componentInstance.jsonSchema = {
          type: 'object',
          additionalProperties: false,
          properties: {
            arrayOfString: {
              type: 'array',
              title: 'Array',
              description: 'Array description. With min and max items',
              items: {
                type: 'string',
              },
              minItems: 1,
            },
          },
        };
        tick(100);

        const addButton = await loader.getHarness(MatButtonHarness.with({ selector: '[aria-label="Add"]' }));
        await addButton.click();

        const input1 = await loader.getHarness(MatInputHarness.with({ selector: '[id*="string_0_0"]' }));
        expect(await input1.isDisabled()).toEqual(false);
        await input1.setValue('test-1');
        tick(100);
        expect(await input1.getValue()).toStrictEqual('test-1');

        fixture.componentInstance.disableFormFields();

        expect(await input1.isDisabled()).toEqual(true);
        expect(await addButton.isDisabled()).toEqual(true);

        fixture.componentInstance.enableFormFields();

        expect(await input1.isDisabled()).toEqual(false);
        expect(await addButton.isDisabled()).toEqual(false);

        await addButton.click();
        tick(100);
        const input2 = await loader.getHarness(MatInputHarness.with({ selector: '[id*="string_1_1"]' }));
        expect(await input2.isDisabled()).toEqual(false);

        await input2.setValue('test-2');
        tick(100);
        expect(await input2.getValue()).toStrictEqual('test-2');
      }));
    });
  });

  describe('GioFormJsonSchemaComponent.isDisplayable', () => {
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
