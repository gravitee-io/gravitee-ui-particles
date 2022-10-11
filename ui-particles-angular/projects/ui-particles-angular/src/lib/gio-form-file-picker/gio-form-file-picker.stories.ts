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
// tslint:disable: no-duplicate-string
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { GioFormFilePickerComponent } from './gio-form-file-picker.component';
import { GioFormFilePickerModule } from './gio-form-file-picker.module';

export default {
  title: 'Components / From File Picker Input',
  component: GioFormFilePickerComponent,

  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, GioFormFilePickerModule],
    }),
  ],
} as Meta;

export const Default: Story = () => ({
  props: {
    ngModelChange: action('ngModelChange'),
  },
});
Default.storyName = 'default';

export const DefaultDisabled: Story = () => ({
  component: GioFormFilePickerComponent,
  props: {
    disabled: true,
  },
});
DefaultDisabled.storyName = 'default disabled';

export const WithCustomContent: Story = () => ({
  template: `
      <p>With custom add button</p>
      <gio-form-file-picker (ngModelChange)="onChange($event)">
        <gio-form-file-picker-add-button><span>Glissez votre fichier</span><p>250x250 px minimum</p></gio-form-file-picker-add-button>
      </gio-form-file-picker>

      <br>

      <p>Disabled with a custom empty text</p>
      <gio-form-file-picker (ngModelChange)="onChange($event)" [disabled]="true">
        <gio-form-file-picker-add-button><span>Glissez votre fichier</span><p>250x250 px minimum</p></gio-form-file-picker-add-button>
        <gio-form-file-picker-empty><span class="mat-small">No image defined</span></gio-form-file-picker-empty>
      </gio-form-file-picker>
  `,
  props: {
    onChange: action('ngModelChange'),
  },
});
WithCustomContent.storyName = 'with custom button and empty text';

export const WithMultipleFiles: Story = () => ({
  props: {
    multiple: true,
    ngModelChange: action('ngModelChange'),
  },
});
WithMultipleFiles.storyName = 'with multiple files';

export const WithAccept: Story = () => ({
  props: {
    multiple: true,
    accept: 'image/*',
    ngModelChange: action('ngModelChange'),
  },
});
WithAccept.storyName = 'accept only images';

export const WithFormGroup: Story = () => {
  const formGroup = new FormBuilder().group({
    files: [],
  });
  formGroup.valueChanges.subscribe(value => {
    action('formValue')(value);
  });

  return {
    template: `
    <form [formGroup]="myForm">
      <gio-form-file-picker
        formControlName="files"
        [multiple]="multiple"
      ></gio-form-file-picker>
    </form>
  `,
    props: {
      myForm: formGroup,
      multiple: false,
    },
  };
};
WithFormGroup.storyName = 'with FormGroup';

export const WithInitValues: Story = () => ({
  template: `
      <gio-form-file-picker
        [formControl]="formControl"
        [ngModel]="ngModel"
        [multiple]="multiple"
        (ngModelChange)="ngModelChange($event)"
      ></gio-form-file-picker>
  `,
  props: {
    formControl: new FormControl(),
    ngModel: [
      ...[
        'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gundam.jpg/250px-Gundam.jpg',
        'https://upload.wikimedia.org/wikipedia/en/c/c2/ZetaBluRay2.jpg',
      ],
      ...['assets/GRAVITEE_LOGOV2_RECT.png'],
    ],
    multiple: true,
    ngModelChange: action('ngModelChange'),
  },
});
WithInitValues.storyName = 'with FormGroup and init values';

export const DisabledWithInitValues: Story = () => ({
  template: `
      <gio-form-file-picker
        [formControl]="formControl"
        [ngModel]="ngModel"
        [multiple]="multiple"
        [disabled]="disabled"
        (ngModelChange)="ngModelChange($event)"
      ></gio-form-file-picker>
  `,
  props: {
    disabled: true,
    formControl: new FormControl(),
    ngModel: [
      ...[
        'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gundam.jpg/250px-Gundam.jpg',
        'https://upload.wikimedia.org/wikipedia/en/c/c2/ZetaBluRay2.jpg',
      ],
      ...['assets/GRAVITEE_LOGOV2_RECT.png'],
    ],
    multiple: true,
    ngModelChange: action('ngModelChange'),
  },
});
DisabledWithInitValues.storyName = 'disabled with init values';

export const WithFormValidator: Story = () => {
  const formGroup = new FormBuilder().group({
    files: [undefined, Validators.required],
  });
  formGroup.valueChanges.subscribe(value => {
    action('formValue')(value);
  });
  formGroup.statusChanges.subscribe(value => {
    action('statusChanges')(value);
  });

  return {
    template: `
    <form [formGroup]="myForm">
      <gio-form-file-picker
        formControlName="files"
        [ngModel]="ngModel"
        [multiple]="multiple"
      ></gio-form-file-picker>
    </form>
  `,
    props: {
      ngModel: ['https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gundam.jpg/250px-Gundam.jpg'],
      myForm: formGroup,
      multiple: false,
    },
  };
};
WithFormValidator.storyName = 'with form validator';

export const WithFormDisabled: Story = () => {
  const formGroup = new FormBuilder().group({
    files: [],
  });
  formGroup.controls.files.disable();

  return {
    template: `
    <form [formGroup]="myForm">
      <gio-form-file-picker
        formControlName="files"
        [ngModel]="ngModel"
        [multiple]="multiple"
      ></gio-form-file-picker>
    </form>
  `,
    props: {
      ngModel: ['https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gundam.jpg/250px-Gundam.jpg'],
      myForm: formGroup,
      multiple: false,
    },
  };
};
WithFormDisabled.storyName = 'with form disabled';

export const WithFormReset: Story = () => {
  const formGroup = new FormBuilder().group({
    files: [],
  });

  return {
    template: `
    <form [formGroup]="myForm">
      <gio-form-file-picker
        formControlName="files"
        [ngModel]="ngModel"
        [multiple]="multiple"
      ></gio-form-file-picker>
    </form><button (click)="onReset()">Reset FormGroup</button>
  `,
    props: {
      ngModel: ['https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Gundam.jpg/250px-Gundam.jpg'],
      myForm: formGroup,
      multiple: false,
      onReset: () => {
        formGroup.reset();
      },
    },
  };
};
WithFormReset.storyName = 'with form reset';