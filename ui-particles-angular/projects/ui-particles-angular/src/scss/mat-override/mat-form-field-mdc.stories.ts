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
import { UntypedFormControl, ReactiveFormsModule, Validators } from '@angular/forms';

export default {
  title: 'Material Override / MatFormField MDC',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const SubscriptSizing: Story = {
  render: () => ({
    template: `
      <p>
      by default, subscript sizing is set to "dynamic" (see GioMatConfigModule)
      (only for mdc component)
      </p>
      
      <mat-card>
      <mat-card-content>
        <p style="display:flex; flex-direction:column;">
          <mat-form-field appearance="fill">
            <mat-label>Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Hint</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Multiline hint Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br> Nullam auctor, nunc vel<br> Nullam auctor, nunc vel</mat-hint>
          </mat-form-field>
          <mat-form-field>
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
        </mat-card-content>
      </mat-card>
    `,
    props: {
      emailFormControl: new UntypedFormControl('', [Validators.required, Validators.email]),
    },
  }),
};

export const MarginMatFormField: Story = {
  render: () => ({
    template: `
      <p>
      Add default margin to mat-mdc-form-field
      </p>
      
      <mat-card>
      <mat-card-content>
        <p style="display:flex; flex-direction:column;">
          <mat-form-field appearance="fill">
            <mat-label>Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br> Nullam auctor, nunc vel</mat-hint>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Second Fill form field</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Hint</mat-hint>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Click to see mat-error</mat-label>
            <input matInput placeholder="Placeholder" required [formControl]="emailFormControl"/>
            <mat-error *ngIf="emailFormControl.hasError('email') && !emailFormControl.hasError('required')">
              Please enter a valid email address
            </mat-error>
            <mat-error *ngIf="emailFormControl.hasError('required')">
              Email is <strong>required</strong>
            </mat-error>
          </mat-form-field>
          <mat-form-field subscriptSizing="fixed">
            <mat-label>Form field with fixed subscriptSizing</mat-label>
            <input matInput placeholder="Placeholder" />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>SubscriptSizing = fixed </mat-hint>
          </mat-form-field>
        </p>
      </mat-card-content>
      </mat-card>
    `,
    props: {
      emailFormControl: new UntypedFormControl('', [Validators.required, Validators.email]),
    },
  }),
};

export const DisabledMatFormFieldShouldHaveNotAllowedCursor: Story = {
  render: () => ({
    template: `
      <p>
      Set cursor not-allowed on disabled form field
      </p>
      
      <mat-card>
      <mat-card-content>
        <p style="display:flex; flex-direction:column;">
          <mat-form-field appearance="fill" disabled="true">
            <mat-label>Fill form field</mat-label>
            <input matInput placeholder="Placeholder" disabled />
            <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
            <mat-hint>Hint</mat-hint>
          </mat-form-field>
        </p>
      </mat-card-content>
      </mat-card>
    `,
    props: {
      emailFormControl: new UntypedFormControl('', [Validators.required, Validators.email]),
    },
  }),
};
