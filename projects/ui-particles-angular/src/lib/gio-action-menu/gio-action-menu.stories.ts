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
import { provideRouter } from '@angular/router';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { GioActionMenuItemComponent } from './gio-action-menu-item.component';
import { GioActionMenuComponent } from './gio-action-menu.component';

export default {
  title: 'Components / Button / Action Menu',
  component: GioActionMenuComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [GioActionMenuComponent, GioActionMenuItemComponent],
    }),
  ],
  render: args => ({
    props: {
      ...args,
      onOptionClicked: action('optionClicked'),
    },
    template: `
      <div style="padding: 50px; display: flex; justify-content: center;">
        <gio-action-menu [icon]="icon">
          <gio-action-menu-item icon="edit" label="Edit" (click)="onOptionClicked('edit')"></gio-action-menu-item>
          <gio-action-menu-item icon="gio:copy" label="Duplicate" (click)="onOptionClicked('duplicate')"></gio-action-menu-item>
          <gio-action-menu-item icon="gio:trash" label="Delete" (click)="onOptionClicked('delete')"></gio-action-menu-item>
        </gio-action-menu>
      </div>
    `,
  }),
} as Meta;

export const Default: StoryObj = {
  args: {
    icon: 'more_vert',
  },
};

export const CustomIcon: StoryObj = {
  args: {
    icon: 'gio:copy',
  },
};
