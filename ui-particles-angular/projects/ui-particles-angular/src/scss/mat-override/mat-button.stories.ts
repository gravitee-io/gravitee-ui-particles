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

import { GioIconsModule } from '../../lib/gio-icons/gio-icons.module';

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule, GioIconsModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatButton: Story = {
  render: () => ({
    template: `
        <h3>Design System buttons</h3>
        <div>
            <div>
                <h4>Button primary</h4>
                <div class="button-container">
<!--                    TODO :see how we can define new css classes for sizing-->
                    <button mat-flat-button color="primary" class="button-large">Large button</button>
                    <button mat-flat-button color="primary" class="medium">Medium button (Default)</button>
                    <button mat-flat-button color="primary" class="small">Small button</button>
                    </div>
                <div class="button-container">
                    <button mat-flat-button color="primary" class="large"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-flat-button color="primary" class="medium"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-flat-button color="primary" class="small"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    </div>
                <div class="button-container">
                    <button mat-flat-button color="primary" class="large"><mat-icon svgIcon="gio:star-outline"></mat-icon>Large button</button>
                    <button mat-flat-button color="primary" class="medium"><mat-icon svgIcon="gio:star-outline"></mat-icon>Medium button</button>
                    <button mat-flat-button color="primary" class="small"><mat-icon svgIcon="gio:star-outline"></mat-icon>Small button</button>
                </div>
                <div class="button-container">
                    <button mat-flat-button color="primary" class="large">Large button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-flat-button color="primary" class="medium">Medium button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-flat-button color="primary" class="small">Small button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                </div>
            </div>
            <div>
                <h4>Button secondary</h4>
                <div class="button-container">
<!--                    TODO :see how we can define new css classes for sizing-->
                    <button mat-stroked-button class="large">Large button</button>
                    <button mat-stroked-button class="medium">Medium button (Default)</button>
                    <button mat-stroked-button class="small">Small button</button>
                    </div>
                <div class="button-container">
                    <button mat-stroked-button class="large"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-stroked-button class="medium"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-stroked-button class="small"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    </div>
                <div class="button-container">
                    <button mat-stroked-button class="large"><mat-icon svgIcon="gio:star-outline"></mat-icon>Large button</button>
                    <button mat-stroked-button class="medium"><mat-icon svgIcon="gio:star-outline"></mat-icon>Medium button</button>
                    <button mat-stroked-button class="small"><mat-icon svgIcon="gio:star-outline"></mat-icon>Small button</button>
                </div>
                <div class="button-container">
                    <button mat-stroked-button class="large">Large button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-stroked-button class="medium">Medium button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-stroked-button class="small">Small button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                </div>
            </div>
            <div>
                <h4>Button tertiary</h4>
                <div class="button-container">
<!--                    TODO :see how we can define new css classes for sizing-->
                    <button mat-button class="large">Large button</button>
                    <button mat-button class="medium">Medium button (Default)</button>
                    <button mat-button class="small">Small button</button>
                    </div>
                <div class="button-container">
                    <button mat-button class="large"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-button class="medium"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-button class="small"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    </div>
                <div class="button-container">
                    <button mat-button class="large"><mat-icon svgIcon="gio:star-outline"></mat-icon>Large button</button>
                    <button mat-button class="medium"><mat-icon svgIcon="gio:star-outline"></mat-icon>Medium button</button>
                    <button mat-button class="small"><mat-icon svgIcon="gio:star-outline"></mat-icon>Small button</button>
                </div>
                <div class="button-container">
                    <button mat-button class="large">Large button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-button class="medium">Medium button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-button class="small">Small button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                </div>
            </div>
            <div>
                <h4>Button accent</h4>
                <div class="button-container">
<!--                    TODO :see how we can define new css classes for sizing-->
                    <button mat-flat-button color="accent" class="large">Large button</button>
                    <button mat-flat-button color="accent" class="medium">Medium button (Default)</button>
                    <button mat-flat-button color="accent" class="small">Small button</button>
                    </div>
                <div class="button-container">
                    <button mat-flat-button color="accent" class="large"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-flat-button color="accent" class="medium"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-flat-button color="accent" class="small"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    </div>
                <div class="button-container">
                    <button mat-flat-button color="accent" class="large"><mat-icon svgIcon="gio:star-outline"></mat-icon>Large button</button>
                    <button mat-flat-button color="accent" class="medium"><mat-icon svgIcon="gio:star-outline"></mat-icon>Medium button</button>
                    <button mat-flat-button color="accent" class="small"><mat-icon svgIcon="gio:star-outline"></mat-icon>Small button</button>
                </div>
                <div class="button-container">
                    <button mat-flat-button color="accent" class="large">Large button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-flat-button color="accent" class="medium">Medium button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-flat-button color="accent" class="small">Small button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                </div>
            </div>
            <div>
                <h4>Button danger</h4>
                <div class="button-container">
<!--                    TODO :see how we can define new css classes for sizing-->
                    <button mat-flat-button color="warn" class="large">Large button</button>
                    <button mat-flat-button color="warn" class="medium">Medium button (Default)</button>
                    <button mat-flat-button color="warn" class="small">Small button</button>
                    </div>
                <div class="button-container">
                    <button mat-flat-button color="warn" class="large"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-flat-button color="warn" class="medium"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    <button mat-flat-button color="warn" class="small"><mat-icon svgIcon="gio:plus"></mat-icon></button>
                    </div>
                <div class="button-container">
                    <button mat-flat-button color="warn" class="large"><mat-icon svgIcon="gio:star-outline"></mat-icon>Large button</button>
                    <button mat-flat-button color="warn" class="medium"><mat-icon svgIcon="gio:star-outline"></mat-icon>Medium button</button>
                    <button mat-flat-button color="warn" class="small"><mat-icon svgIcon="gio:star-outline"></mat-icon>Small button</button>
                </div>
                <div class="button-container">
                    <button mat-flat-button color="warn" class="large">Large button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-flat-button color="warn" class="medium">Medium button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                    <button mat-flat-button color="warn" class="small">Small button<mat-icon svgIcon="gio:star-outline"></mat-icon></button>
                </div>
            </div>
        </div>


        <div>
          <h3>Material Buttons</h3>
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
              
              <div>
                  <h4>Icon with text</h4>
                  <div class="button-container">
                      <button mat-button aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-button color="primary" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-button color="accent" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-button color="warn" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-button disabled aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                  </div>
              </div>
              
              <div>
                  <h4>Raised icon with text</h4>
                  <div class="button-container">
                      <button mat-raised-button aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-raised-button color="primary" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-raised-button color="accent" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-raised-button color="warn" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-raised-button disabled aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                  </div>
              </div>
              
              <div>
                  <h4>Flat icon with text</h4>
                  <div class="button-container">
                      <button mat-flat-button aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-flat-button color="primary" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-flat-button color="accent" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-flat-button color="warn" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-flat-button disabled aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                  </div>
              </div>
              
              <div>
                  <h4>Stroked icon with text</h4>
                  <div class="button-container">
                      <button mat-stroked-button aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-stroked-button color="primary" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-stroked-button color="accent" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-stroked-button color="warn" aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                      <button mat-stroked-button disabled aria-label="Example icon button with a edit-pencil icon">
                          <mat-icon svgIcon="gio:edit-pencil"></mat-icon>Edit
                      </button>
                  </div>
              </div>
              
              <div>
                  <h4>Stroked icon without text</h4>
                  <div class="button-container">
                      <button mat-stroked-button mat-icon-button aria-label="Example icon button with a settings icon">
                          <mat-icon svgIcon="gio:settings"></mat-icon>
                      </button>
                      <button mat-stroked-button mat-icon-button color="primary" aria-label="Example icon button with a settings icon">
                          <mat-icon svgIcon="gio:settings"></mat-icon>
                      </button>
                      <button mat-stroked-button mat-icon-button color="accent" aria-label="Example icon button with a settings icon">
                          <mat-icon svgIcon="gio:settings"></mat-icon>
                      </button>
                      <button mat-stroked-button mat-icon-button color="warn" aria-label="Example icon button with a settings icon">
                          <mat-icon svgIcon="gio:settings"></mat-icon>
                      </button>
                      <button mat-stroked-button mat-icon-button disabled aria-label="Example icon button with a settings icon">
                          <mat-icon svgIcon="gio:settings"></mat-icon>
                      </button>
                  </div>
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
