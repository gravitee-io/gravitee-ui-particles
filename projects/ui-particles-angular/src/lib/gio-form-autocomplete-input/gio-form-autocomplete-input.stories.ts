/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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
import { action } from 'storybook/actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { range } from 'lodash';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { GioFormAutocompleteInputComponent } from './gio-form-autocomplete-input.component';
import { GioFormAutocompleteInputModule } from './gio-form-autocomplete-input.module';

export default {
  title: 'Components / Form Autocomplete Input',
  component: GioFormAutocompleteInputComponent,
  decorators: [
    moduleMetadata({
      imports: [GioFormAutocompleteInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
    }),
  ],
  render: () => ({}),
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The selected value',
      table: { type: { summary: 'string' }, defaultValue: '' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    required: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    disabled: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
} as Meta;

export const EmptyModel: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => ({
    template: `
    <mat-form-field appearance="fill" style="width:100%">
      <mat-label>Select Option</mat-label>
      <gio-form-autocomplete-input 
        [disabled]="disabled" 
        [required]="required" 
        [placeholder]="placeholder" 
        [ngModel]="value" 
        (ngModelChange)="onValueChange($event)"
      >
      </gio-form-autocomplete-input>
    </mat-form-field>
    `,
    props: {
      value,
      placeholder,
      required,
      disabled,
      onValueChange: (e: string) => action('Value changed')(e),
    },
  }),
  args: {
    value: '',
    placeholder: 'Type to search...',
  },
};

export const WithInitialValue: StoryObj = {
  render: EmptyModel.render,
  args: {
    value: 'Option A',
    required: false,
    placeholder: 'Type to search...',
  },
};

export const Required: StoryObj = {
  render: EmptyModel.render,
  args: {
    value: '',
    required: true,
    placeholder: 'Type to search...',
  },
};

export const Disabled: StoryObj = {
  render: EmptyModel.render,
  args: {
    value: 'Option A',
    required: false,
    disabled: true,
    placeholder: 'Type to search...',
  },
};

export const FormControlEmpty: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Select Option</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
        >
        </gio-form-autocomplete-input>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
      },
    };
  },
  args: {
    value: '',
    placeholder: 'Type to search...',
  },
};

export const FormControlDisabled: StoryObj = {
  render: FormControlEmpty.render,
  args: {
    value: 'Option A',
    disabled: true,
  },
};

export const WithSimpleAutocomplete: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Select Fruit</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
          [autocompleteInputOptions]="['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']"
        >
        </gio-form-autocomplete-input>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
      },
    };
  },
  args: {
    value: '',
    disabled: false,
    placeholder: 'Type to search fruits...',
  },
};

export const WithLabelValueAutocomplete: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    const options = [
      { label: 'Apple (Sweet)', value: 'apple' },
      { label: 'Banana (Tropical)', value: 'banana' },
      { label: 'Cherry (Tart)', value: 'cherry' },
      { label: 'Date (Sweet)', value: 'date' },
    ];

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Select Fruit</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
          [autocompleteInputOptions]="options"
        >
        </gio-form-autocomplete-input>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
        options,
      },
    };
  },
  args: {
    value: '',
    disabled: false,
    placeholder: 'Type to search fruits...',
  },
};

export const WithGroupedAutocomplete: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    const groupedOptions = [
      {
        groupLabel: 'Fruits',
        groupOptions: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
        ],
      },
      {
        groupLabel: 'Vegetables',
        groupOptions: [
          { label: 'Carrot', value: 'carrot' },
          { label: 'Broccoli', value: 'broccoli' },
          { label: 'Spinach', value: 'spinach' },
        ],
      },
    ];

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Select Food</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
          [autocompleteInputOptions]="groupedOptions"
        >
        </gio-form-autocomplete-input>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
        groupedOptions,
      },
    };
  },
  args: {
    value: '',
    disabled: false,
    placeholder: 'Type to search...',
  },
};

export const WithAsyncAutocomplete: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    const applications = range(50).map(i => ({
      value: `app-${i}`,
      label: `Application ${i}`,
    }));

    const autocompleteOptions = (search: string) => {
      return of(applications.filter(app => app.label.toLowerCase().includes(search.toLowerCase()))).pipe(delay(500));
    };

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Select Application</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
          [autocompleteInputOptions]="autocompleteOptions"
        >
        </gio-form-autocomplete-input>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
        autocompleteOptions,
      },
    };
  },
  args: {
    value: '',
    disabled: false,
    placeholder: 'Search applications...',
  },
  argTypes: {
    autocompleteOptions: {
      control: { type: 'object' },
    },
  },
};

export const WithDisplayFunction: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    const users = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    const options = users.map(user => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    }));

    const displayWith = (id: string) => {
      const user = users.find(u => u.id === id);
      return user ? user.name : id;
    };

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Select User</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
          [autocompleteInputOptions]="options"
          [displayWith]="displayWith"
        >
        </gio-form-autocomplete-input>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
        options,
        displayWith,
      },
    };
  },
  args: {
    value: '',
    disabled: false,
    placeholder: 'Search users...',
  },
  argTypes: {
    displayWith: {
      control: { type: 'object' },
    },
  },
};

export const LLMPaths: StoryObj = {
  render: ({ value, placeholder, required, disabled }) => {
    const valueControl = new UntypedFormControl({ value, disabled });

    valueControl.valueChanges.subscribe(val => {
      action('Value changed')(val);
    });

    const paths = ['/chat/completions', '/embeddings', '/models'];

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>LLM Path</mat-label>
        <gio-form-autocomplete-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="valueControl"
          [autocompleteInputOptions]="paths"
        >
        </gio-form-autocomplete-input>
        <mat-hint>Select or enter an LLM API path</mat-hint>
      </mat-form-field>
      `,
      props: {
        value,
        placeholder,
        required,
        disabled,
        valueControl,
        paths,
      },
    };
  },
  args: {
    value: '',
    disabled: false,
    placeholder: 'Enter or select a path',
  },
};
