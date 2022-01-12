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

import { MatIconModule } from '@angular/material/icon';

export default {
  title: 'Components / Badge',
  decorators: [
    moduleMetadata({
      imports: [MatIconModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const All: Story = {
  render: () => ({
    template: `
      <span class="gio-badge">Default</span>
      
      <span class="gio-badge gio-badge-accent">Accent</span>

      <span class="gio-badge gio-badge-success">Success</span>
      
      <span class="gio-badge gio-badge-warning">Warning</span>
      
      <span class="gio-badge gio-badge-error">Error</span>

      <span class="gio-badge gio-badge-error"><mat-icon>lock</mat-icon></span>

      <span class="gio-badge gio-badge-error"><mat-icon class="gio-left">lock</mat-icon> Lock</span>

      <span class="gio-badge gio-badge-error">Lock<mat-icon class="gio-right">lock</mat-icon></span>
    `,
  }),
};
