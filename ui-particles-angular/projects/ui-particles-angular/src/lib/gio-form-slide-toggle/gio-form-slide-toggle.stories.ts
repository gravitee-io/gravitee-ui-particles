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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { GioFormSlideToggleComponent } from './gio-form-slide-toggle.component';
import { GioFormSlideToggleModule } from './gio-form-slide-toggle.module';

export default {
  title: 'Components / Form Slide Toggle',
  component: GioFormSlideToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [GioFormSlideToggleModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatIconModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const OnlyToggle: StoryObj = {
  render: () => ({
    template: '<gio-form-slide-toggle><mat-slide-toggle gioFormSlideToggle></mat-slide-toggle></gio-form-slide-toggle>',
  }),
};

export const WithLabel1: StoryObj = {
  render: () => ({
    template: `
      <gio-form-slide-toggle>
        <gio-form-label>Label 1</gio-form-label>
        <mat-slide-toggle gioFormSlideToggle></mat-slide-toggle>
      </gio-form-slide-toggle>
    `,
  }),
};

export const WithLabel2: StoryObj = {
  render: () => ({
    template: `
      <gio-form-slide-toggle>
        Label 2 - Description
        <mat-slide-toggle gioFormSlideToggle></mat-slide-toggle>
      </gio-form-slide-toggle>
    `,
  }),
};

export const WithLabel1AndLabel2: StoryObj = {
  render: () => ({
    template: `
      <gio-form-slide-toggle>
        <gio-form-label>Label 1</gio-form-label>
        Label 2 - Description
        <mat-slide-toggle gioFormSlideToggle></mat-slide-toggle>
      </gio-form-slide-toggle>
    `,
  }),
};

export const SimilarToMatFormField: StoryObj = {
  render: ({ appearance }) => ({
    template: `
      <p>
        <mat-form-field [appearance]="appearance">
          <mat-label>Standard form field</mat-label>
          <input matInput placeholder="Placeholder">
          <mat-hint>Hint</mat-hint>
        </mat-form-field>
      </p>
      <p>
        <gio-form-slide-toggle [appearance]="appearance">
          <gio-form-label>Label 1</gio-form-label>
          Label 2 - Description
          <mat-slide-toggle gioFormSlideToggle></mat-slide-toggle>
        </gio-form-slide-toggle>
      </p>
    `,
    props: { appearance },
  }),
  argTypes: {
    appearance: {
      options: ['fill', 'outline'],
      control: { type: 'select' },
    },
  },
  args: {
    appearance: 'outline',
  },
};

export const SimilarToMatFormFieldWithIcon: StoryObj = {
  render: ({ appearance }) => ({
    template: `
      <p class="mat-body">
        <mat-form-field [appearance]="appearance">
          <mat-icon matIconPrefix>lock</mat-icon>
          <mat-label>Standard form field</mat-label>
          <input matInput placeholder="Placeholder">
          <mat-hint>Hint</mat-hint>
        </mat-form-field>
      </p>
      <p class="mat-body">
        <gio-form-slide-toggle [appearance]="appearance">
          <mat-icon gioFormPrefix>lock</mat-icon>
          <gio-form-label>Label 1</gio-form-label>
          Label 2 - Description
          <mat-slide-toggle gioFormSlideToggle></mat-slide-toggle>
        </gio-form-slide-toggle>
      </p>
    `,
    props: { appearance },
  }),
  argTypes: {
    appearance: {
      options: ['standard', 'fill', 'outline'],
      control: { type: 'select' },
    },
  },
  args: {
    appearance: 'outline',
  },
};

export const SimilarToMatFormFieldDisabled: StoryObj = {
  render: ({ disabled, appearance }) => ({
    template: `
      <p>
        <mat-form-field [appearance]="appearance">
          <mat-icon matIconPrefix>lock</mat-icon>
          <mat-label>Standard form field</mat-label>
          <input [disabled]="disabled" matInput value="Value">
          <mat-hint>Hint</mat-hint>
        </mat-form-field>
      </p>
      <p>
        <gio-form-slide-toggle [appearance]="appearance">
          <mat-icon gioFormPrefix>lock</mat-icon>
          <gio-form-label>Label 1</gio-form-label>
          Label 2 - Description
          <mat-slide-toggle gioFormSlideToggle [disabled]="disabled"></mat-slide-toggle>
        </gio-form-slide-toggle>
      </p>
    `,
    props: { disabled, appearance },
  }),
  argTypes: {
    disabled: {
      type: { name: 'boolean', required: false },
    },
    appearance: {
      options: ['standard', 'fill', 'outline'],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: true,
    appearance: 'outline',
  },
};

export const FullWidth: StoryObj = {
  render: ({ disabled, appearance }) => ({
    template: `
      <p>
        <mat-form-field [appearance]="appearance" style="width:100%">
          <mat-icon matIconPrefix>lock</mat-icon>
          <mat-label>Standard form field</mat-label>
          <input [disabled]="disabled" matInput value="Value">
          <mat-hint>Hint</mat-hint>
        </mat-form-field>
      </p>
      <p>
        <gio-form-slide-toggle [appearance]="appearance" style="width:100%">
          <mat-icon gioFormPrefix>lock</mat-icon>
          <gio-form-label>Label 1</gio-form-label>
          Label 2 - Description - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget
          <mat-slide-toggle gioFormSlideToggle [disabled]="disabled"></mat-slide-toggle>
        </gio-form-slide-toggle>
      </p>
    `,
    props: { disabled, appearance },
  }),
  argTypes: {
    disabled: {
      type: { name: 'boolean', required: false },
    },
    appearance: {
      options: ['standard', 'fill', 'outline'],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: true,
    appearance: 'outline',
  },
};
