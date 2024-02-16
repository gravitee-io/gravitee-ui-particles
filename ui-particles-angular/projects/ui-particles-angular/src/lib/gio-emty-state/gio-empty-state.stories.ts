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
import { GioEmptyStateComponent, GioEmptyStateModule } from '@gravitee/ui-particles-angular';
import { MatCardModule } from '@angular/material/card';

export default {
  title: 'Components / Empty state',
  component: GioEmptyStateComponent,
  decorators: [
    moduleMetadata({
      imports: [GioEmptyStateModule, MatCardModule],
    }),
  ],
} as Meta;

export const Default: StoryObj = {
  render: () => ({
    template: `
      <gio-empty-state
        [icon]="icon"
        [title]="title"
        [subtitle]="subtitle"
      ></gio-empty-state>
    `,
    props: {
      icon: 'search',
      title: 'No API found',
      subtitle: 'No API found. Please try again or create one.',
    },
  }),
};

export const Card: StoryObj = {
  render: () => ({
    template: `
      <mat-card>
        <mat-card-header>
            <div class="card__header">
                <mat-card-title>Analytics overview</mat-card-title>
                <mat-card-subtitle>Gain actionable insights into API performance with real-time metrics</mat-card-subtitle>
            </div>
        </mat-card-header>
        <mat-card-content>
            <gio-empty-state
              [icon]="icon"
              [title]="title"
              [subtitle]="subtitle"
            ></gio-empty-state>
        </mat-card-content>
      </mat-card>
      
    `,
    props: {
      icon: 'folder-plus',
      title: 'Enable Analytics',
      subtitle: 'Your metrics live here. Start monitoring your API by enabling the Analytics in the top area.',
    },
    styles: [
      `
      .card__header {
        margin: 12px 0;
      }
    `,
    ],
  }),
};

export const SmallCard: StoryObj = {
  render: () => ({
    template: `
      <mat-card class="small-card">
        <mat-card-header>
            <div class="small-card__header">
                <mat-card-title>Analytics overview</mat-card-title>
                <mat-card-subtitle>Gain actionable insights into API performance with real-time metrics</mat-card-subtitle>
            </div>
        </mat-card-header>
        <mat-card-content>
            <gio-empty-state
              [icon]="icon"
              [title]="title"
              [subtitle]="subtitle"
            ></gio-empty-state>
        </mat-card-content>
      </mat-card>
    `,
    props: {
      icon: 'folder-plus',
      title: 'Enable Analytics',
      subtitle: 'Your metrics live here. Start monitoring your API by enabling the Analytics in the top area.',
    },
    styles: [
      `
      .small-card {
        width: 600px;
      }

      .small-card__header {
        margin: 12px 0;
      }
    `,
    ],
  }),
};
