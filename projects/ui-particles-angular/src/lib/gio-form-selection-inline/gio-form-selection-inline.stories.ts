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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';

import { GioFormSelectionInlineModule } from './gio-form-selection-inline.module';
import { GioFormSelectionInlineComponent } from './gio-form-selection-inline.component';

export default {
  title: 'Components / Form selection inline',
  component: GioFormSelectionInlineComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, GioFormSelectionInlineModule, MatCardModule],
    }),
  ],
  render: () => ({}),
  argTypes: {
    disabled: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
} as Meta;

export const Simple: StoryObj = {
  render: args => ({
    template: `
    <gio-form-selection-inline [disabled]="disabled" [ngModel]="selected" (ngModelChange)="onSelect($event)">
      <gio-form-selection-inline-card value="A">Hello</gio-form-selection-inline-card>
      <gio-form-selection-inline-card value="B">Hello</gio-form-selection-inline-card>
      <gio-form-selection-inline-card [disabled]="true" value="C">Disabled</gio-form-selection-inline-card>
      <gio-form-selection-inline-card  value="D">Hello</gio-form-selection-inline-card>
      <gio-form-selection-inline-card [lock]="true" value="E">Locked</gio-form-selection-inline-card>
    </gio-form-selection-inline>
    `,
    props: {
      ...args,
      selected: 'E',
      onSelect: (e: string) => action('On select')(e),
    },
  }),
};

export const ReactiveForms: StoryObj = {
  render: args => {
    const selectControl = new FormControl({
      value: 'A',
      disabled: args.disabled,
    });

    selectControl.valueChanges.subscribe(value => {
      action('On select')(value);
    });

    return {
      template: `
      <gio-form-selection-inline [formControl]="selectControl">
        <gio-form-selection-inline-card value="A">Hello</gio-form-selection-inline-card>
        <gio-form-selection-inline-card value="B">Hello</gio-form-selection-inline-card>
        <gio-form-selection-inline-card [disabled]="true" value="C">Disabled</gio-form-selection-inline-card>
        <gio-form-selection-inline-card value="D">Hello</gio-form-selection-inline-card>
        <gio-form-selection-inline-card [lock]="true" value="E">Locked</gio-form-selection-inline-card>
      </gio-form-selection-inline>
      ---<br>
      Touched: {{ selectControl.touched }} Dirty: {{ selectControl.dirty }}
      `,
      props: {
        selectControl,
      },
    };
  },
};

export const Disable: StoryObj = {
  render: args => {
    const selectControl = new FormControl({
      value: 'A',
      disabled: args.disabled,
    });
    selectControl.valueChanges.subscribe(value => {
      action('On select')(value);
    });

    return {
      template: `
      <gio-form-selection-inline [formControl]="selectControl">
        <gio-form-selection-inline-card value="A">A card</gio-form-selection-inline-card>
        <gio-form-selection-inline-card value="B">B card</gio-form-selection-inline-card>
        <gio-form-selection-inline-card value="C" [disabled]="true">C card</gio-form-selection-inline-card>
        <gio-form-selection-inline-card value="D">D card</gio-form-selection-inline-card>
        <gio-form-selection-inline-card value="E" [lock]="true" value="E">E card</gio-form-selection-inline-card>
      </gio-form-selection-inline>
      `,
      props: {
        selectControl,
      },
    };
  },
  args: {
    disabled: true,
  },
};

export const WithContent: StoryObj = {
  render: () => {
    const selectControl = new FormControl({ value: 'A', disabled: false });

    selectControl.valueChanges.subscribe(value => {
      action('On select')(value);
    });

    return {
      template: `
      <gio-form-selection-inline [formControl]="selectControl">
        <gio-form-selection-inline-card value="fox">
            <gio-form-selection-inline-card-content icon="gio:gitlab">
                <gio-card-content-title>Fox</gio-card-content-title>
                <gio-card-content-subtitle>This is a fox icon</gio-card-content-subtitle>
            </gio-form-selection-inline-card-content>
        </gio-form-selection-inline-card>

        <gio-form-selection-inline-card value="cat" [lock]="true" value="E">
          <gio-form-selection-inline-card-content icon="gio:github">
            <gio-card-content-title>Cat</gio-card-content-title>
            <gio-card-content-subtitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit</gio-card-content-subtitle>
          </gio-form-selection-inline-card-content>
        </gio-form-selection-inline-card>

        <gio-form-selection-inline-card value="dog">
          <gio-form-selection-inline-card-content icon="gio:cpu">
            <gio-card-content-title>Dog</gio-card-content-title>
            <gio-card-content-subtitle>This is not a dog icon</gio-card-content-subtitle>
          </gio-form-selection-inline-card-content>
        </gio-form-selection-inline-card>

        <gio-form-selection-inline-card value="img">
          <gio-form-selection-inline-card-content img="https://via.placeholder.com/300">
            <gio-card-content-title>With image</gio-card-content-title>
            <gio-card-content-subtitle>This card uses an &lt;img&gt; tag</gio-card-content-subtitle>
          </gio-form-selection-inline-card-content>
        </gio-form-selection-inline-card>

        <gio-form-selection-inline-card [disabled]="true" value="no-title">
          <gio-form-selection-inline-card-content icon="gio:off-rounded">
            <gio-card-content-subtitle>Only subtitle</gio-card-content-subtitle>
          </gio-form-selection-inline-card-content>
        </gio-form-selection-inline-card>

      </gio-form-selection-inline>
      `,
      props: {
        selectControl,
      },
    };
  },
};
