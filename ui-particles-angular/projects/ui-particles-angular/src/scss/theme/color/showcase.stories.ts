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
import { MatCardModule } from '@angular/material/card';

import { ShowcaseColorComponent } from './showcase-color.component';

export default {
  title: 'Theme / Color',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, MatCardModule],
      declarations: [ShowcaseColorComponent],
    }),
  ],
  render: () => ({}),
} as Meta;

export const Palettes: Story = {
  render: () => ({
    component: ShowcaseColorComponent,
  }),
};
