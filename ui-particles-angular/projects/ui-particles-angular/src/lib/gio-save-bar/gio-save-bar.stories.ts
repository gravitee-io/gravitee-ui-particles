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
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { GioSaveBarComponent } from './gio-save-bar.component';
import { GioSaveBarModule } from './gio-save-bar.module';

export default {
  title: 'Components / Save Bar',
  component: GioSaveBarComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, MatButtonModule, GioSaveBarModule, BrowserAnimationsModule, ReactiveFormsModule],
    }),
  ],
} as Meta;

export const SimpleUsageInUpdateMode: Story = {
  name: 'Update Mode / Simple Usage',
  render: () => ({
    template: `
    <div style="padding: 16px">
       <gio-save-bar
        [creationMode]="false"
        [opened]="true">
      </gio-save-bar>
    </div>
    `,
  }),
};

export const Default: Story = {
  name: 'Update Mode / Direct Bindings Usage',
  render: () => ({
    template: `
    <div style="padding-bottom: 400px">
      <button (click)="opened = !opened">Click to toggle the Save Bar</button>
      <button *ngIf="opened" (click)="invalidState = !invalidState">Click to toggle submit button validation</button>
      <div>A long form, with many many fields</div>
      <div style="display: flex; flex-direction: column;"
           *ngFor="let item of [].constructor(40)">
           Input {{item}}
           <input/>
      </div>
      <gio-save-bar
        [opened]="opened"
        [invalidState]="invalidState"
        (resetClicked)="onReset($event)"
        (submitted)="onSubmit($event)"
        (submittedInvalidState)="onSubmitInvalidState($event)">
      </gio-save-bar>
    </div>
    `,
    props: {
      onReset: (e: unknown) => action('Reset')(e),
      onSubmit: (e: unknown) => action('Submit')(e),
      onSubmitInvalidState: (e: unknown) => action('Submit invalid state')(e),
    },
  }),
};

export const ReactiveForm: Story = {
  name: 'Update Mode / Reactive Form',

  render: () => {
    const form = new FormGroup({
      anInput: new FormControl('Edit me to display the save bar'),
    });

    const formInitialValues = form.getRawValue();

    return {
      template: `
      <form style="padding-bottom: 400px" [formGroup]="form" (ngSubmit)="ngSubmit($event)" >
        <div>A long form, with many many fields</div>
        <div style="display: flex; flex-direction: column;"
           *ngFor="let item of [].constructor(40)">
           Input {{item}}
          <input formControlName="anInput"/>
        </div>
        <gio-save-bar
          [form]="form"
          [formInitialValues]="formInitialValues"
          >
        </gio-save-bar>
      </form>
      `,
      props: {
        ngSubmit: (e: unknown) => action('Submit')(e),
        form,
        formInitialValues,
      },
    };
  },
};

export const SimpleUsageInCreationMode: Story = {
  name: 'Creation Mode / Simple Usage',
  render: () => ({
    template: `
    <div style="padding: 16px">
       <gio-save-bar
        [creationMode]="true"
        [opened]="true">
      </gio-save-bar>
    </div>
    `,
  }),
};

export const CustomInnerButtonInCreationMode: Story = {
  name: 'Creation Mode / Custom Inner Button',
  render: () => ({
    template: `
    <div style="padding: 16px">
       <gio-save-bar
        [creationMode]="true"
        [hideSubmitButton]="true"
        >
        <button mat-flat-button color="primary">Next</button>
      </gio-save-bar>
    </div>
    `,
  }),
};

export const CustomInnerButtonInUpdateMode: Story = {
  name: 'Update Mode / Custom Inner Button',
  render: () => ({
    template: `
    <div style="padding: 16px">
       <gio-save-bar
        [creationMode]="false"
        [opened]="true"
        [hideSubmitButton]="true"
        [hideDiscardButton]="true"
        >
        <button mat-flat-button color="primary">Next</button>
      </gio-save-bar>
    </div>
    `,
  }),
};

export const CreationMode: Story = {
  name: 'Creation Mode / Form',
  render: () => ({
    template: `
    <div style="padding-bottom: 400px">
      <div>A long form, with many many fields</div>
      <div style="display: flex; flex-direction: column;"
           *ngFor="let item of [].constructor(40)">
           Input {{item}}
           <input/>
      </div>
      <gio-save-bar
        [creationMode]="true"
        (resetClicked)="onReset($event)"
        (submitted)="onSubmit($event)">
      </gio-save-bar>
    </div>
    `,
    props: {
      onReset: (e: unknown) => action('Reset')(e),
      onSubmit: (e: unknown) => action('Submit')(e),
    },
  }),
};
