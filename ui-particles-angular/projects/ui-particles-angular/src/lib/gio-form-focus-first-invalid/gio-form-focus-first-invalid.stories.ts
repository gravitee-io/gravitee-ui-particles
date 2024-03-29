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
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { GioSaveBarModule } from '../gio-save-bar/gio-save-bar.module';
import { GioFormTagsInputModule } from '../gio-form-tags-input/gio-form-tags-input.module';
import { GioFormCronModule } from '../gio-form-cron/gio-form-cron.module';

import { GioFormFocusInvalidFormDirective } from './gio-form-focus-first-invalid.directive';
import { GioFormFocusInvalidModule } from './gio-form-focus-first-invalid.module';

export default {
  title: 'Components / Form Focus invalid',
  component: GioFormFocusInvalidFormDirective,
  decorators: [
    moduleMetadata({
      imports: [
        GioFormFocusInvalidModule,
        GioSaveBarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        GioFormTagsInputModule,
        GioFormCronModule,
      ],
    }),
  ],
} as Meta;

export const Demo: StoryObj = {
  render: () => {
    const form = new UntypedFormGroup({
      anInput: new UntypedFormControl(null, Validators.required),
      cron: new UntypedFormControl(null, Validators.required),
      aSelect: new UntypedFormControl(null, Validators.required),
      aTextarea: new UntypedFormControl(null, Validators.required),
      aTagsInput: new UntypedFormControl(null, Validators.required),
      aColorInput: new UntypedFormControl(null, Validators.required),
    });

    return {
      template: `
    <form style="padding-bottom: 400px" [formGroup]="form" gioFormFocusInvalid>
      <p>A long form, with many many fields</p>
      <p>When clicking on save the 1st input in error is focused</p>
      <div style="display: flex; flex-direction: column;">

        <mat-form-field>
          <mat-label>Input</mat-label>
          <input gioFormFocusInvalidIgnore matInput required formControlName="anInput">
        </mat-form-field>

        <br *ngFor="let item of [].constructor(30)">

        <gio-form-cron formControlName="cron">
          <gio-form-cron-label>Cron</gio-form-cron-label>
        </gio-form-cron>

        <br *ngFor="let item of [].constructor(30)">

        <mat-form-field>
          <mat-label>Select</mat-label>
          <mat-select required formControlName="aSelect">
            <mat-option value="one">First option</mat-option>
            <mat-option value="two">Second option</mat-option>
          </mat-select>
        </mat-form-field>

        <br *ngFor="let item of [].constructor(30)">

        <mat-form-field>
          <mat-label>Textarea</mat-label>
          <textarea matInput required formControlName="aTextarea"></textarea>
        </mat-form-field>

        <br *ngFor="let item of [].constructor(30)">

        <mat-form-field>
          <mat-label>My tags</mat-label>
          <gio-form-tags-input required formControlName="aTagsInput">
          </gio-form-tags-input>
        </mat-form-field>
        <!-- Uncomment when gio-form-color-input is available
        <br *ngFor="let item of [].constructor(30)">

        <mat-form-field>
          <mat-label>Select color</mat-label>
          <gio-form-color-input required formControlName="aColorInput">
          </gio-form-color-input>
        </mat-form-field>
        -->
        <br *ngFor="let item of [].constructor(30)">

      </div>
      <p>Focusing the 1st input in error when form is submitted</p>
      <gio-save-bar
        [creationMode]="true"
        [form]="form">
      </gio-save-bar>

      <p>Focusing the 1st input in error with simple button</p>
      <button
        type="button"
        gioFormFocusInvalid
        mat-raised-button
        >Go to first form error</button>
    </form>
    `,
      props: {
        form,
      },
    };
  },
};
