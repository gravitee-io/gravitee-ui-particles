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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, MatLegacyTabsModule],
    }),
  ],
} as Meta;

export const MatTabs: Story = {
  render: () => ({
    template: `
    <p>
      Unset mat tab label min-width
    </p>
    

    <mat-tab-group mat-align-tabs="start">
      <mat-tab label="First">Content 1</mat-tab>
      <mat-tab label="Second">Content 2</mat-tab>
      <mat-tab label="Third">Content 3</mat-tab>
    </mat-tab-group>
    
    <mat-tab-group mat-align-tabs="center">
      <mat-tab label="First">Content 1</mat-tab>
      <mat-tab label="Second">Content 2</mat-tab>
      <mat-tab label="Third">Content 3</mat-tab>
    </mat-tab-group>
    
    <mat-tab-group mat-align-tabs="end">
      <mat-tab label="First">Content 1</mat-tab>
      <mat-tab label="Second">Content 2</mat-tab>
      <mat-tab label="Third">Content 3</mat-tab>
    </mat-tab-group>  
    `,
  }),
};
