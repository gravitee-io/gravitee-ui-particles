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

import { GioIconsModule } from '../gio-icons/gio-icons.module';

export default {
  title: 'Components / Method Badge',
  decorators: [
    moduleMetadata({
      imports: [GioIconsModule],
    }),
  ],
} as Meta;

const classByNames = {
  Post: 'gio-method-badge-post',
  Get: 'gio-method-badge-get',
  Patch: 'gio-method-badge-patch',
  Put: 'gio-method-badge-put',
  Delete: 'gio-method-badge-delete',
  Options: 'gio-method-badge-options',
  Trace: 'gio-method-badge-trace',
  Head: 'gio-method-badge-head',
  Connect: 'gio-method-badge-connect',
  Other: 'gio-method-badge-other',
};

export const All: Story = {
  render: () => ({
    template: Object.entries(classByNames).reduce((previousValue, [name, cssClass]) => {
      return `${previousValue}
      <div style='margin: 10px'>
        <span class='${cssClass}'>${name}</span>
      </div>`;
    }, ''),
  }),
};
