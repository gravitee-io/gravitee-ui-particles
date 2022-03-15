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
import { MatCardModule } from '@angular/material/card';
import { withDesign } from 'storybook-addon-designs';

import { GioBannerModule } from './gio-banner.module';
import { GioBannerComponent } from './gio-banner.component';

export default {
  title: 'Components / Banner',
  component: GioBannerComponent,
  decorators: [
    moduleMetadata({
      imports: [GioBannerModule, MatCardModule],
    }),
    withDesign,
  ],
  render: () => ({}),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/XvLO9G5fPRIrfyhLjPg6a2/Gravitee_Lib_elemZ?node-id=728%3A994',
    },
  },
} as Meta;

export const All: Story = {
  render: () => ({
    template: `
    <gio-banner-info>This is an info banner!</gio-banner-info>
    <br>
    <gio-banner-success>This is a success banner!</gio-banner-success>
    <br>
    <gio-banner-warning>This is a warning banner!</gio-banner-warning>
    <br>
    <gio-banner-error>Error <br> Second line <br> Wow another one</gio-banner-error>
    `,
  }),
};

export const AllInMatCard: Story = {
  render: () => ({
    template: `
    <mat-card>
      <gio-banner-info>This is an info banner!</gio-banner-info>
      <br>
      <gio-banner-success>This is a success banner!</gio-banner-success>
      <br>
      <gio-banner-warning>This is a warning banner!</gio-banner-warning>
      <br>
      <gio-banner-error>Error <br> Second line <br> Wow another one</gio-banner-error>
    </mat-card>`,
  }),
};

export const AllWithTypeInput: Story = {
  render: () => ({
    template: `
    <gio-banner type="info">This is an info banner!</gio-banner>
    <br>
    <gio-banner type="success">This is a success banner!</gio-banner>
    <br>
    <gio-banner type="warning">This is a warning banner!</gio-banner>
    <br>
    <gio-banner type="error">Error <br> Second line <br> Wow another one</gio-banner>
    `,
  }),
};

export const Default: Story = {
  render: () => ({
    template: `<gio-banner>This is a Default banner!</gio-banner>
    <mat-card>
      <gio-banner-error>Error <br> Second line <br> Wow another one</gio-banner-error>
    </mat-card>
    `,
  }),
};
