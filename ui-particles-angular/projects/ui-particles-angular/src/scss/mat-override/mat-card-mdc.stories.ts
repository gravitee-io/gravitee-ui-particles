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
import { MatCardModule } from '@angular/material/card';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [MatCardModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatCardMDC: Story = {
  render: () => ({
    template: `
      <p>
        Default elevation
      </p>
      
      <mat-card>
      <mat-card-content>
        Default elevation is 3
        <br>

        <mat-card>
      <mat-card-content>
          MatCard inside MatCard keep elevation to lvl 1 by default
        </mat-card-content>
        </mat-card>
        <br>
        <mat-card class="mat-mdc-elevation-specific mat-elevation-z2">
      <mat-card-content>
          MatCard inside MatCard with custom elevation to lvl 2
        </mat-card-content>
        </mat-card>
        </mat-card-content>
      </mat-card>
    `,
  }),
};
