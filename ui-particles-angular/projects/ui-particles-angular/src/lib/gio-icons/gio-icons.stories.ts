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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-7-0';
import { MatButtonModule } from '@angular/material/button';

import { GioBannerModule } from '../gio-banner/gio-banner.module';

import { GioIconsModule } from './gio-icons.module';
import { SbGetIconsListPipe } from './sb-get-icons-list.pipe';

export default {
  title: 'Components / Icons',
  decorators: [
    moduleMetadata({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        GioIconsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        GioBannerModule,
      ],
      declarations: [SbGetIconsListPipe],
    }),
  ],
} as Meta;

/**
 * TODO: Improve UX selection with hover and selected icons ext...
 */
export const All: Story = {
  render: () => ({
    template: `
    <mat-form-field class="example-form-field" appearance="fill" style="width:100%;">
      <mat-label>Search Gio icons</mat-label>
      <input matInput type="text" [(ngModel)]="search">
      <button *ngIf="search" matSuffix mat-icon-button aria-label="Clear" (click)="search=''">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <gio-banner-info *ngIf="selectedIconId" class="sb-demo">
      <span>gio:{{ selectedIconId }}</span>
      <span gioBannerBody><code>{{ '&lt;mat-icon svgIcon="gio:' + selectedIconId + '"&gt;&lt;/mat-icon&gt;' }}</code></span>
      
    </gio-banner-info>
     
    <span *ngFor="let iconId of [] | sbGetIconsList:search " class="sb-icons">
      <mat-icon  [svgIcon]="'gio:' + iconId" (click)="selectedIconId = iconId"></mat-icon>
    </span>
    `,
    props: {
      search: '',
      selectedIconId: undefined,
    },
    styles: [
      `
      .sb-icons {
        margin: 8px;
        cursor:pointer;  
      }

      .sb-icons:hover {
        font-size: 2em
      }

      .sb-demo {
        margin:8px
      }
    `,
    ],
  }),
};
