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
import { Story } from '@storybook/angular/types-7-0';
import { withDesign } from 'storybook-addon-designs';

import { GioIconsModule } from '../gio-icons/gio-icons.module';

import { GioBreadcrumbComponent } from './gio-breadcrumb.component';
import { GioBreadcrumbModule } from './gio-breadcrumb.module';

export default {
  title: 'Components / Breadcrumb',
  component: GioBreadcrumbComponent,
  decorators: [
    moduleMetadata({
      imports: [GioBreadcrumbModule, GioIconsModule],
    }),
    withDesign,
  ],
  render: () => ({}),
} as Meta;

export const Default: Story = {
  render: () => ({
    template: `<gio-breadcrumb>
                  <span *gioBreadcrumbItem>APIs</span>
                  <span *gioBreadcrumbItem>My api</span>
                  <span *gioBreadcrumbItem>Portal</span>
               </gio-breadcrumb>`,
  }),
};

export const Links: Story = {
  render: () => ({
    template: `<gio-breadcrumb>
                  <a href="/apis" *gioBreadcrumbItem>APIs</a>
                  <a href="/apis/my-api" *gioBreadcrumbItem>My api</a>
                  <a *gioBreadcrumbItem>Portal</a>
               </gio-breadcrumb>`,
  }),
};