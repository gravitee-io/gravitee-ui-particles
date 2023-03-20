/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';

import { GioLoaderComponent } from './gio-loader.component';
import { GioLoaderModule } from './gio-loader.module';

export default {
  title: 'Components / Loader',
  component: GioLoaderComponent,
  decorators: [
    moduleMetadata({
      imports: [GioLoaderModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const Loader: Story = {
  render: () => ({
    template: "<gio-loader style='width:56px; height: 56px'></gio-loader>",
  }),
};

export const LoaderWithBackground: Story = {
  render: () => ({
    template: '<gio-loader style="width:32px; height: 32px; background: pink; border-radius: 50%;  padding: 4px;"></gio-loader>',
  }),
};
