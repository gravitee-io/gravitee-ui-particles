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
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ConditionsModel } from '../models/ConditionsModel';

import { GioElEditorComponent } from './gio-el-editor.component';

export default {
  title: 'Components / EL / Editor',
  component: GioElEditorComponent,
  decorators: [
    applicationConfig({
      providers: [provideNativeDateAdapter()],
    }),
  ],
  render: ({ conditionsModel }) => ({
    template: `<gio-el-editor [conditionsModel]="conditionsModel" ></gio-el-editor>`,
    props: { conditionsModel },
  }),
} as Meta;

export const AllType: StoryObj = {};
AllType.args = {
  conditionsModel: [
    {
      field: 'application',
      label: 'Application',
      type: 'string',
      values: ['a', 'b', 'c'],
    },
    {
      field: 'isAuthenticated',
      label: 'Is Authenticated',
      type: 'boolean',
    },
    {
      field: 'duration',
      label: 'Duration',
      type: 'number',
      max: 10,
    },
    {
      field: 'timestamp',
      label: 'Timestamp',
      type: 'date',
    },
  ],
};

export const DeepFieldTree: StoryObj = {};
DeepFieldTree.args = {
  conditionsModel: [
    {
      field: 'root',
      label: 'Root',
      conditions: [
        {
          field: 'foo',
          label: 'Foo',
          conditions: [
            {
              field: 'value',
              label: 'Value',
              type: 'string',
            },
            {
              field: 'bar',
              label: 'Bar',
              conditions: [
                {
                  field: 'baz',
                  label: 'Baz',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
  ] satisfies ConditionsModel,
};

export const MapAndMultiMapField: StoryObj = {};
MapAndMultiMapField.args = {
  conditionsModel: [
    {
      field: 'foo',
      label: 'Foo',
      type: 'string',
    },
    {
      field: 'api',
      label: 'Api',
      conditions: [
        {
          field: 'id',
          label: 'Id',
          type: 'string',
        },
        {
          field: 'properties',
          label: 'Properties',
          type: 'string',
          map: {
            type: 'Map',
          },
        },
        {
          field: 'multimap',
          label: 'MultiMap',
          type: 'string',
          map: {
            type: 'MultiMap',
          },
        },
        {
          field: 'mltimapWithValues',
          label: 'MultiMap with values',
          type: 'string',
          map: {
            type: 'MultiMap',
            key1Values: ['foo', 'bar', 'baz'],
          },
        },
      ],
    },
  ] satisfies ConditionsModel,
};
