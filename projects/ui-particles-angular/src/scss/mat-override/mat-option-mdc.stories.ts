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
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [MatInputModule, MatAutocompleteModule, MatOptionModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatOption: StoryObj = {
  render: () => ({
    template: `
        <mat-form-field [floatLabel]="'never'">
            <input id="input" matInput placeholder="Name..." [matAutocomplete]="names" />
        </mat-form-field>
        <mat-autocomplete #names="matAutocomplete">
          <mat-option *ngFor="let option of options" [value]="option">{{option}}</mat-option>
        </mat-autocomplete>`,
    props: {
      options: ['Abel', 'Constance', 'Léon', 'Jeanne', 'Noame'],
    },
    styles: [
      `
        :host {
          display: block;
          min-height: 500px;
        }
        `,
    ],
  }),
  play: ({ canvasElement }) => {
    const matInput = canvasElement.querySelector('#input') as HTMLInputElement;
    matInput.focus();
  },
};
