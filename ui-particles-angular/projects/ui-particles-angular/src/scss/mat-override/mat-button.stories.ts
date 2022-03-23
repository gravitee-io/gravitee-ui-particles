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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatButton: Story = {
  render: () => ({
    template: `
          <h3>Buttons</h3>
          <div>
              <div>
                  <h4>Default</h4>
                  <div class="button-container">
                      <button mat-button>Basic</button>
                      <button mat-button color="primary">Primary</button>
                      <button mat-button color="accent">Accent</button>
                      <button mat-button color="warn">Warn</button>
                      <button mat-button disabled>Disabled</button>
                  </div>
              </div>
              
              <div>
                  <h4>Raised</h4>
                  <div class="button-container">
                      <button mat-raised-button>Basic</button>
                      <button mat-raised-button color="primary">Primary</button>
                      <button mat-raised-button color="accent">Accent</button>
                      <button mat-raised-button color="warn">Warn</button>
                      <button mat-raised-button disabled>Disabled</button>
                  </div>
              </div>
              
              <div>
                  <h4>Flat</h4>
                  <div class="button-container">
                      <button mat-flat-button>Basic</button>
                      <button mat-flat-button color="primary">Primary</button>
                      <button mat-flat-button color="accent">Accent</button>
                      <button mat-flat-button color="warn">Warn</button>
                      <button mat-flat-button disabled>Disabled</button>
                  </div>
              </div>
              
              <div>
                  <h4>Stroked</h4>
                  <div class="button-container">
                      <button mat-stroked-button>Basic</button>
                      <button mat-stroked-button color="primary">Primary</button>
                      <button mat-stroked-button color="accent">Accent</button>
                      <button mat-stroked-button color="warn">Warn</button>
                      <button mat-stroked-button disabled>Disabled</button>
                  </div>
              </div>
              
              <div>
                  <h4>Icon</h4>
                  <div class="button-container">
                      <button mat-icon-button aria-label="Example icon button with a vertical three dot icon">
                          <mat-icon>more_vert</mat-icon>
                      </button>
                      <button mat-icon-button color="primary" aria-label="Example icon button with a vertical three dot icon">
                          <mat-icon>more_vert</mat-icon>
                      </button>
                      <button mat-icon-button color="accent" aria-label="Example icon button with a vertical three dot icon">
                          <mat-icon>more_vert</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" aria-label="Example icon button with a vertical three dot icon">
                          <mat-icon>more_vert</mat-icon>
                      </button>
                      <button mat-icon-button disabled aria-label="Example icon button with a vertical three dot icon">
                          <mat-icon>more_vert</mat-icon>
                      </button>
                  </div>
              </div>
          </div>
        `,
    styles: [
      `
            .button-container {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                width: 500px;
                margin-bottom: 16px;
            }
       `,
    ],
  }),
};
