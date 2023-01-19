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
import { GioIconsModule } from 'ui-particles-angular';
import { MatIconModule } from '@angular/material/icon';
import { Story } from '@storybook/angular/types-7-0';
import { Meta, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [
        MatInputModule,
        MatIconModule,
        GioIconsModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatInput: Story = {
  render: () => ({
    template: `
        <h3>Design System inputs</h3>
        
        <div class="container">
          <mat-form-field appearance="outline">
            <mat-label>Simple input</mat-label>
            <input matInput>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-icon svgIcon="gio:star-outline" matPrefix></mat-icon>
            <mat-label>Simple input with icon</mat-label>
            <input matInput>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-icon svgIcon="gio:star-outline" matPrefix></mat-icon>
            <mat-label>Simple input with icon and hint</mat-label>
            <input matInput>
            <mat-hint>This is a hint text</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="outline" >
            <mat-icon svgIcon="gio:star-outline" matPrefix></mat-icon>
            <mat-label>Click to see control with error</mat-label>
            <input matInput required [formControl]="errorFormControl">
            <mat-error *ngIf="errorFormControl.hasError('required')">This is an error message</mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Number input</mat-label>
            <input matInput type="number">
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Color input</mat-label>
            <input matInput type="color">
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Password input</mat-label>
            <input matInput type="password">
          </mat-form-field>

          <mat-form-field class="example-chip-list" appearance="outline">
            <mat-label>Multi text input</mat-label>
            <mat-chip-list #chipList aria-label="Fruit selection">
              <mat-chip *ngFor="let fruit of fruits" (removed)="removeFruit(fruit, fruits)">
                {{fruit.name}}
                <button matChipRemove>
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip>
              <input placeholder="New fruit..."
                     [matChipInputFor]="chipList"
                     (matChipInputTokenEnd)="addFruit($event, fruits)"
              >
            </mat-chip-list>
          </mat-form-field>
          <mat-form-field class="example-chip-list" appearance="outline">
            <mat-label>Multi text input with icon prefix</mat-label>
            <mat-icon svgIcon="gio:star-outline" matPrefix></mat-icon>
            <mat-chip-list #chipList aria-label="Fruit selection">
              <mat-chip *ngFor="let fruit of fruits" (removed)="removeFruit(fruit, fruits)">
                {{fruit.name}}
                <button matChipRemove>
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip>
              <input placeholder="New fruit..."
                     [matChipInputFor]="chipList"
                     (matChipInputTokenEnd)="addFruit($event, fruits)"
              >
            </mat-chip-list>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Input with text prefix</mat-label>
            <mat-label matPrefix>http://</mat-label>
            <input matInput>
          </mat-form-field>
  
          <mat-form-field appearance="outline">
            <mat-label>Search input</mat-label>
            <mat-icon svgIcon="gio:search" matPrefix></mat-icon>
            <input matInput #input>
            <mat-icon svgIcon="gio:cancel" matSuffix (click)="input.value = ''"></mat-icon>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date picker</mat-label>
            <input matInput [matDatepicker]="picker">
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
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
      errorFormControl: new FormControl('', [Validators.required]),
      fruits: [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }],
      addFruit: (event: MatChipInputEvent, fruits: { name: string }[]) => {
        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
          fruits.push({ name: value });
        }

        // Clear the input value
        event.chipInput?.clear();
      },

      removeFruit: (fruit: { name: string }, fruits: { name: string }[]) => {
        const index = fruits.indexOf(fruit);

        if (index >= 0) {
          fruits.splice(index, 1);
        }
      },
    },
  }),
};
