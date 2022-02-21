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
import { Meta, moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-7-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

export default {
  title: 'Material Override / MatFormField',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatHintAndErrorFontSize: Story = {
  render: () => ({
    template: `
      <p>
      "mat-error" and "mat-hint" should have caption font-size
      </p>
      
      <mat-card>
        <p style="display:flex; flex-direction:column;">
          <mat-form-field appearance="fill">
            <mat-label>Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Hint</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="standard">
            <mat-label>Click to see mat-error</mat-label>
            <input matInput placeholder="Placeholder" required [formControl]="emailFormControl"/>
            <mat-error *ngIf="emailFormControl.hasError('email') && !emailFormControl.hasError('required')">
              Please enter a valid email address
            </mat-error>
            <mat-error *ngIf="emailFormControl.hasError('required')">
              Email is <strong>required</strong>
            </mat-error>
          </mat-form-field>
        </p>
      </mat-card>
    `,
    props: {
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    },
  }),
};

export const MarginBetweenMatFormField: Story = {
  render: () => ({
    template: `
      <p>
      Add default top margin between mat-form-field
      </p>
      
      <mat-card>
        <p style="display:flex; flex-direction:column;">
          <mat-form-field appearance="fill">
            <mat-label>Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Hint</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Second Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Hint</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="standard">
            <mat-label>Click to see mat-error</mat-label>
            <input matInput placeholder="Placeholder" required [formControl]="emailFormControl"/>
            <mat-error *ngIf="emailFormControl.hasError('email') && !emailFormControl.hasError('required')">
              Please enter a valid email address
            </mat-error>
            <mat-error *ngIf="emailFormControl.hasError('required')">
              Email is <strong>required</strong>
            </mat-error>
          </mat-form-field>
        </p>
      </mat-card>
    `,
    props: {
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    },
  }),
};
