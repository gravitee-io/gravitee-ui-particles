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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Meta, moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';

export default {
  title: 'Components / Button Toggle Group',
  decorators: [
    moduleMetadata({
      imports: [MatButtonToggleModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const Default: Story = {
  render: () => ({
    template: `
    <p style="background-color: #fff; padding:16px;">
      <mat-button-toggle-group class="gio-button-toggle-group" aria-label="Font Style">
        <mat-button-toggle value="bold">Bold</mat-button-toggle>
        <mat-button-toggle value="italic">Italic</mat-button-toggle>
        <mat-button-toggle value="underline">Underline</mat-button-toggle>
      </mat-button-toggle-group>
    </p>
    `,
  }),
};
