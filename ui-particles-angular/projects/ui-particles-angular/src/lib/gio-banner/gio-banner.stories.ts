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
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GioBannerModule } from './gio-banner.module';
import { GioBannerComponent } from './gio-banner.component';

export default {
  title: 'Components / Banner',
  component: GioBannerComponent,
  decorators: [
    moduleMetadata({
      imports: [GioBannerModule, MatCardModule, MatButtonModule, MatIconModule],
    }),
  ],
  render: () => ({}),
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/XvLO9G5fPRIrfyhLjPg6a2/Gravitee_Lib_elemZ?node-id=728%3A994',
    },
  },
} as Meta;

export const All: StoryObj = {
  render: () => ({
    template: `
    <gio-banner-info>This is an info banner!</gio-banner-info>
    <br>
    <gio-banner-success>This is a success banner!</gio-banner-success>
    <br>
    <gio-banner-warning>This is a warning banner!</gio-banner-warning>
    <br>
    <gio-banner-error>Error <br> Second line <br> Wow another one</gio-banner-error>
    <gio-banner type="error">This an error type banner with the default icon</gio-banner>
    <gio-banner type="error" icon="gio:universe">This an error banner with a custom icon</gio-banner>
    `,
  }),
};

export const AllInMatCard: StoryObj = {
  render: () => ({
    template: `
    <mat-card>
      <mat-card-content>
        <gio-banner-info>This is an info banner!</gio-banner-info>
        <br>
        <gio-banner-success>This is a success banner!</gio-banner-success>
        <br>
        <gio-banner-warning>This is a warning banner!</gio-banner-warning>
        <br>
        <gio-banner-error>Error <br> Second line <br> Wow another one</gio-banner-error>
      </mat-card-content>
    </mat-card>`,
  }),
};

export const AllWithTypeInput: StoryObj = {
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

export const Default: StoryObj = {
  render: () => ({
    template: `
    <h5>Outside Mat Card</h5>
    <gio-banner>This is a Default banner!</gio-banner>
    <h5>Inside Mat Card</h5>
    <mat-card>
      <mat-card-content>
        <gio-banner-error>Error <br> Second line <br> Wow another one</gio-banner-error>
      </mat-card-content>
    </mat-card>
    <h5>With content</h5>
    <gio-banner>
      Title content
      <span gioBannerBody>This is the body of the banner.</span>
    </gio-banner>
    <h5>With action</h5>
    <gio-banner>
      <div>Title content</div>
      <div gioBannerAction>
          <button  mat-raised-button color="basic">Action</button>
      </div>
      <span gioBannerBody>This is the body of the banner. <a href="">Learn more</a></span>
    </gio-banner>

    <h5>Collapsible banner</h5>
    <gio-banner [collapsible]="true">
      <div>Collapsible banner</div>
      <div gioBannerAction>
          <button  mat-raised-button color="basic">Action</button>
      </div>
      <span gioBannerBody>This is the body of the banner. <a href="">Learn more</a> <br><br><br><br><br>End</span>
    </gio-banner>
    `,
  }),
};
