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
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { range } from 'lodash';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { GioFormTagsInputComponent, Tags } from './gio-form-tags-input.component';
import { GioFormTagsInputModule } from './gio-form-tags-input.module';

export default {
  title: 'Components / Form Tags Input',
  component: GioFormTagsInputComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, GioFormTagsInputModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
    }),
  ],
  render: () => ({}),
  argTypes: {
    tags: {
      control: { type: 'array' },
      description: '',
      table: { type: { summary: 'string[]' }, defaultValue: [] },
    },
    placeholder: {
      control: { type: 'string' },
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

export const WithoutFormField: Story = {
  render: ({ tags = ['A', 'B'], placeholder, required, disabled }) => ({
    template: `
      <gio-form-tags-input [disabled]="disabled" [required]="required" [placeholder]="placeholder" [ngModel]="tags" (ngModelChange)="onTagsChange($event)">
      </gio-form-tags-input>
    `,
    props: {
      tags,
      placeholder,
      required,
      disabled,
      onTagsChange: (e: Tags[]) => action('Tags')(e),
    },
  }),
  args: {},
};

export const EmptyModel: Story = {
  render: ({ tags, placeholder, required, disabled }) => ({
    template: `
    <mat-form-field appearance="fill" style="width:100%">
      <mat-label>Tags</mat-label>
      <gio-form-tags-input 
        [disabled]="disabled" 
        [required]="required" 
        [placeholder]="placeholder" 
        [ngModel]="tags" 
        (ngModelChange)="onTagsChange($event)"
      >
      </gio-form-tags-input>
    </mat-form-field>
    `,
    props: {
      tags,
      placeholder,
      required,
      disabled,
      onTagsChange: (e: Tags[]) => action('Tags')(e),
    },
  }),
  args: {},
};

export const WithInitialValue: Story = {
  render: EmptyModel.render,
  args: {
    tags: ['A', 'B'],
    required: false,
    placeholder: 'Add a tag',
  },
};

export const Required: Story = {
  render: EmptyModel.render,
  args: {
    tags: ['A', 'B'],
    required: true,
    placeholder: 'Add a tag',
  },
};

export const Disabled: Story = {
  render: EmptyModel.render,
  args: {
    tags: ['A', 'B'],
    required: false,
    disabled: true,
    placeholder: 'Add a tag',
  },
};

export const FormControlEmpty: Story = {
  render: ({ tags, placeholder, required, disabled, tagValidationHook }) => {
    const tagsControl = new FormControl({ value: tags, disabled });

    tagsControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Labels</mat-label>
        <gio-form-tags-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="tagsControl"
          [tagValidationHook]="tagValidationHook"
        >
        </gio-form-tags-input>
      </mat-form-field>
      `,
      props: {
        tags,
        placeholder,
        required,
        disabled,
        tagsControl,
        tagValidationHook,
      },
    };
  },
  args: {},
};

export const FormControlDisabled: Story = {
  render: FormControlEmpty.render,
  args: {
    tags: ['A'],
    disabled: true,
  },
};

export const WithTagValidationHook: Story = {
  render: FormControlEmpty.render,
  args: {
    tags: ['A'],
    disabled: false,
    placeholder: 'Add a tag',
    tagValidationHook: (tag: string, validationCb: (shouldAddTag: boolean) => void) => {
      validationCb(confirm(`Add "${tag}" tag ?`));
    },
  },
  argTypes: {
    tagValidationHook: {
      control: { type: 'function' },
    },
  },
};

export const WithAutocomplete: Story = {
  render: ({ tags, placeholder, required, disabled }) => {
    const tagsControl = new FormControl({ value: tags, disabled });

    tagsControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Labels</mat-label>
        <gio-form-tags-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="tagsControl"
          [autocompleteOptions]="['Abc', 'Aaa', 'Bbb', 'Cccc', 'Dddd']"
        >
        </gio-form-tags-input>
      </mat-form-field>
      `,
      props: {
        tags,
        placeholder,
        required,
        disabled,
        tagsControl,
      },
    };
  },
  args: {
    tags: ['A'],
    disabled: false,
    placeholder: 'Add a tag',
  },
};

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'];
export const WithAutocompleteOnly: Story = {
  render: ({ tags, placeholder, required, disabled, tagValidationHook, autocompleteOptions }) => {
    const tagsControl = new FormControl({ value: tags, disabled });

    tagsControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Http methods</mat-label>
        <gio-form-tags-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="tagsControl"
          [tagValidationHook]="tagValidationHook"
          [autocompleteOptions]="autocompleteOptions"
        >
        </gio-form-tags-input>
      </mat-form-field>
      `,
      props: {
        tags,
        placeholder,
        required,
        disabled,
        tagsControl,
        tagValidationHook,
        autocompleteOptions,
      },
    };
  },
  args: {
    tags: ['GET'],
    disabled: false,
    placeholder: 'Add http method',
    autocompleteOptions: httpMethods,
    tagValidationHook: (tag: string, validationCb: (shouldAddTag: boolean) => void) => {
      validationCb(httpMethods.includes(tag.toUpperCase()));
    },
  },
  argTypes: {
    tagValidationHook: {
      control: { type: 'function' },
    },
  },
};

const applications = range(10).map(i => ({
  value: `${i}-applicationId`,
  label: `${i} - Application`,
}));

export const WithAsyncAutocompleteOnly: Story = {
  render: ({ tags, placeholder, required, disabled, autocompleteOptions, displayValueWith, useAutocompleteOptionValueOnly }) => {
    const tagsControl = new FormControl({ value: tags, disabled });

    tagsControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Applications</mat-label>
        <gio-form-tags-input
          [required]="required" 
          [placeholder]="placeholder" 
          [formControl]="tagsControl"
          [autocompleteOptions]="autocompleteOptions"
          [displayValueWith]="displayValueWith"
          [useAutocompleteOptionValueOnly]="useAutocompleteOptionValueOnly"
        >
        </gio-form-tags-input>
      </mat-form-field>
      `,
      props: {
        tags,
        placeholder,
        required,
        disabled,
        tagsControl,
        autocompleteOptions,
        displayValueWith,
        useAutocompleteOptionValueOnly,
      },
    };
  },
  args: {
    tags: [applications[0].value],
    disabled: false,
    placeholder: 'Search application  ',
    autocompleteOptions: (tag: string) => {
      return of(applications.filter(a => a.label.startsWith(tag))).pipe(delay(1000));
    },
    displayValueWith: (tag: string) => {
      const application = applications.find(a => a.value === tag);
      return of(application ? application.label : tag);
    },
    useAutocompleteOptionValueOnly: true,
  },
  argTypes: {
    tagValidationHook: {
      control: { type: 'function' },
    },
  },
};

export const WithLimitedWidth: Story = {
  render: ({ tags, disabled }) => {
    const tagsControl = new FormControl({ value: tags, disabled });

    tagsControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `
      <mat-form-field appearance="fill" style="width:200px">
        <gio-form-tags-input
          [formControl]="tagsControl">
        </gio-form-tags-input>
      </mat-form-field>
      `,
      props: {
        tags,
        tagsControl,
      },
    };
  },
  args: {
    tags: ['lorem ipsum dolor sit amet'],
    disabled: false,
  },
};
