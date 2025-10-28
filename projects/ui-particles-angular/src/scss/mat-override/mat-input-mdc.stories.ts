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
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UntypedFormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { action } from 'storybook/actions';
import { MatSelectModule } from '@angular/material/select';

import { Tags } from '../../lib/gio-form-tags-input/gio-form-tags-input.component';
import { GioFormTagsInputModule, GioIconsModule } from '../../public-api';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [
        MatInputModule,
        MatIconModule,
        GioIconsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        GioFormTagsInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
      ],
    }),
  ],
  render: () => ({}),
  parameters: {
    chromatic: { delay: 500 },
  },
} as Meta;

export const MatInputMDC: StoryObj = {
  render: () => ({
    template: `
        <h3>Design System inputs</h3>
        
        <div class="container">
          <mat-form-field>
            <mat-label>Simple input</mat-label>
            <input matInput>
          </mat-form-field>
          <mat-form-field>
            <mat-icon svgIcon="gio:star-outline" matIconPrefix></mat-icon>
            <mat-label>Simple input with icon</mat-label>
            <input matInput>
          </mat-form-field>
          <mat-form-field>
            <mat-icon svgIcon="gio:star-outline" matIconPrefix></mat-icon>
            <mat-label>Simple input with icon and hint</mat-label>
            <input matInput>
            <mat-hint>This is a hint text</mat-hint>
          </mat-form-field>
          <mat-form-field >
            <mat-icon svgIcon="gio:star-outline" matIconPrefix></mat-icon>
            <mat-label>Click to see control with error</mat-label>
            <input matInput required [formControl]="errorFormControl">
            <mat-error *ngIf="errorFormControl.hasError('required')">This is an error message</mat-error>
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Number input</mat-label>
            <input matInput type="number">
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Color input</mat-label>
            NB: a custom component is available in APIM
            <input matInput type="color">
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Password input</mat-label>
            <input matInput type="password">
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Multi text input</mat-label>
            <gio-form-tags-input [disabled]="disabled" [required]="required" [placeholder]="placeholder" [ngModel]="fruits" (ngModelChange)="onTagsChange($event)">
            </gio-form-tags-input>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Multi text input with icon prefix</mat-label>
            <mat-icon svgIcon="gio:star-outline" matIconPrefix></mat-icon>
            <gio-form-tags-input [disabled]="disabled" [required]="required" [placeholder]="placeholder" [ngModel]="fruits" (ngModelChange)="onTagsChange($event)">
            </gio-form-tags-input>
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Input with text prefix</mat-label>
            <span matTextPrefix>http://&nbsp;</span>
            <input matInput>
          </mat-form-field>
  
          <mat-form-field>
            <mat-label>Search input</mat-label>
            <mat-icon svgIcon="gio:search" matIconPrefix></mat-icon>
            <input matInput #input>
            <mat-icon svgIcon="gio:cancel" matSuffix (click)="input.value = ''"></mat-icon>
          </mat-form-field>
  
          <mat-form-field appearance="outline">
            <mat-label>Select input</mat-label>
            <mat-select>
                <mat-option value="option1">Option 1</mat-option>
                <mat-option value="option2">Option 2</mat-option>
                <mat-option value="option3">Option 3</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date picker</mat-label>
            <input matInput [matDatepicker]="picker">
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Text area</mat-label>
            <textarea matInput #text></textarea>
            <mat-hint>{{text.value.length}}/250</mat-hint>
          </mat-form-field>
        </div>
        `,
    styles: [
      `
            .container {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 500px;
                margin-bottom: 16px;
            }
       `,
    ],
    props: {
      errorFormControl: new UntypedFormControl('', [Validators.required]),
      fruits: ['Lemon', 'Lime', 'Apple'],
      onTagsChange: (e: Tags[]) => action('Tags')(e),
    },
  }),
};
