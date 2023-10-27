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
import { Meta } from '@storybook/angular';
import { Story } from '@storybook/angular/types-7-0';

export default {
  title: 'Components / Table Light',
  render: args => ({
    template: `
      <table class="gio-table-light" [class.disabled]="disabled">
          <thead>
              <tr>
                  <th>key</th>
                  <th>value</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>Accept-Language</td>
                  <td>fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3</td>
              </tr>
              <tr>
                  <td>Accept-Encoding</td>
                  <td>gzip, deflate, br</td>
              </tr>
              <tr>
                  <td>Cache-Control</td>
                  <td>no-cache</td>
              </tr>
              <tr>
                  <td>Content-Type</td>
                  <td>application/json</td>
              </tr>
          </tbody>
      </table>
    `,
    props: {
      disabled: args.disabled,
    },
  }),
} as Meta;

export const HttpHeaders: Story = {
  args: {
    disabled: false,
  },
};

export const HttpHeadersDisabled: Story = {
  args: {
    disabled: true,
  },
};
