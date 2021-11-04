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
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GioSaveBarComponent } from './gio-save-bar.component';
import { GioSaveBarModule } from './gio-save-bar.module';

export default {
  title: 'Components / Save Bar',
  component: GioSaveBarComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, GioSaveBarModule, BrowserAnimationsModule, ReactiveFormsModule],
    }),
  ],
} as Meta;

export const Default: Story = {
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
  render: () => {
    const form = new FormGroup({
      anInput: new FormControl('Edit me to display the save bar'),
    });

    const formInitialValues = form.getRawValue();

    return {
      template: `
      <form style="padding-bottom: 400px" [formGroup]="form" >
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
        form,
        formInitialValues,
      },
    };
  },
};

export const CreationMode: Story = {
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
