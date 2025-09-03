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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject, provideAppInitializer } from '@angular/core';
import { of } from 'rxjs';

import { GioElService } from '../gio-el/gio-el.service';

import { GioFormHeadersComponent } from './gio-form-headers.component';
import { GioFormHeadersModule } from './gio-form-headers.module';

export default {
  title: 'Components / Form Headers',
  component: GioFormHeadersComponent,
  decorators: [
    moduleMetadata({
      imports: [GioFormHeadersModule, FormsModule, ReactiveFormsModule],
    }),
    applicationConfig({
      providers: [
        GioElService,
        provideAppInitializer(() => {
          inject(GioElService).promptCallback = () => of({ el: 'Hello world!' });
        }),
      ],
    }),
  ],
  argTypes: {},
  render: args => ({
    template: `<gio-form-headers [ngModel]="headers"><gio-form-headers-label>Request headers</gio-form-headers-label></gio-form-headers>`,
    props: args,
  }),
  args: {
    headers: [],
  },
} as Meta;

export const Default: StoryObj = {};

export const Filled: StoryObj = {
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
  },
};

export const ReactiveForm: StoryObj = {
  render: args => {
    const headersControl = new UntypedFormControl({
      value: args.headers,
      disabled: args.disabled,
    });

    headersControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `<gio-form-headers [formControl]="headersControl"></gio-form-headers> <br>Status :{{ headersControl.status }} | Touched :{{ headersControl.touched }}`,
      props: {
        headersControl,
      },
    };
  },
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
    disabled: false,
  },
};

export const ReactiveFormDisabled: StoryObj = {
  render: args => {
    const headersControl = new UntypedFormControl({
      value: args.headers,
      disabled: args.disabled,
    });

    headersControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `
      <gio-form-headers [formControl]="headersControl">
        <gio-form-headers-label>Request headers</gio-form-headers-label>
      </gio-form-headers>`,
      props: {
        headersControl,
      },
    };
  },
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
    disabled: true,
  },
};

export const SmallWidth: StoryObj = {
  render: args => ({
    template: `<div style="width: 200px;"><gio-form-headers [ngModel]="headers"></gio-form-headers></div>`,
    props: args,
  }),
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
  },
};

export const ReactiveFormEl: StoryObj = {
  render: args => {
    const headersControl = new UntypedFormControl({
      value: args.headers,
      disabled: args.disabled,
    });

    headersControl.valueChanges.subscribe(value => {
      action('Tags')(value);
    });

    return {
      template: `<gio-form-headers [config]="{elColumns: 'both'}" [formControl]="headersControl"></gio-form-headers> <br>Status :{{ headersControl.status }} | Touched :{{ headersControl.touched }}`,
      props: { headersControl },
    };
  },
  args: {
    headers: [
      {
        key: 'host',
        value: 'api.gravitee.io',
      },
      {
        key: 'accept',
        value: '*/*',
      },
      {
        key: 'connection',
        value: 'keep-alive',
      },
    ],
    disabled: false,
  },
};
