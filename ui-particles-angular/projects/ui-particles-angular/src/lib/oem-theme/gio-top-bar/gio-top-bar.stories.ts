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
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { GioIconsModule } from '../../gio-icons/gio-icons.module';
import { OEM_THEME_ARG_TYPES, computeStylesForStory, OEM_DEFAULT_LOGO } from '../oem-theme.service';

import { GioTopBarComponent } from './gio-top-bar.component';
import { GioTopBarModule } from './gio-top-bar.module';
import { GioTopBarLinkModule } from './gio-top-bar-link/gio-top-bar-link.module';
import { GioTopBarMenuModule } from './gio-top-bar-menu/gio-top-bar-menu.module';

export default {
  title: 'OEM Theme / TopBar',
  component: GioTopBarComponent,
  decorators: [
    moduleMetadata({
      imports: [MatIconModule, MatButtonModule, GioIconsModule, GioTopBarModule, GioTopBarLinkModule, GioTopBarMenuModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const Default: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    return {
      template: `
        <div id="main" [style]="style">
          <gio-top-bar>
            <button mat-icon-button>
              <mat-icon svgIcon="gio:gravitee" (click)="click('am')"></mat-icon>
            </button>
            <gio-top-bar-content type="am" productName="Access Management"></gio-top-bar-content>
            <gio-top-bar-menu>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:question-mark-circle"></mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:bell"></mat-icon>
              </button>
              <div class="image"></div>
            </gio-top-bar-menu>
          </gio-top-bar>
          <gio-top-bar>
            <button mat-icon-button>
              <mat-icon svgIcon="gio:gravitee" (click)="click('apim')"></mat-icon>
            </button>
            <gio-top-bar-content type="apim" productName="API Management"></gio-top-bar-content>
            <gio-top-bar-link url="#" name="Developers portal"></gio-top-bar-link>
            <gio-top-bar-menu>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:question-mark-circle"></mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:bell"></mat-icon>
              </button>
              <div class="image"></div>
            </gio-top-bar-menu>
          </gio-top-bar>
          <gio-top-bar>
            <button mat-icon-button>
              <mat-icon svgIcon="gio:gravitee" (click)="click('cockpit')"></mat-icon>
            </button>
            <gio-top-bar-content type="cockpit" productName="Cockpit"></gio-top-bar-content>
            <gio-top-bar-menu>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:question-mark-circle"></mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:bell"></mat-icon>
              </button>
              <div class="image"></div>
            </gio-top-bar-menu>
          </gio-top-bar>
          <gio-top-bar>
            <button mat-icon-button>
              <img src="${args.logo}" alt="custom logo" style="height: 36px; width: 36px">
            </button>
            <gio-top-bar-content type="apim" productName="API Management"></gio-top-bar-content>
            <gio-top-bar-link url="#" name="Developers portal"></gio-top-bar-link>
            <gio-top-bar-menu>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:question-mark-circle"></mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon svgIcon="gio:bell"></mat-icon>
              </button>
              <div class="image"></div>
            </gio-top-bar-menu>
          </gio-top-bar>
        </div>
        `,
      props: {
        click: (product: string) => alert('click on ' + product),
        style: computeStylesForStory(args),
      },
      styles: [
        ` 
        #main {
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
        }
        
        .image {
          display: block;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          background: url('https://i.blogs.es/a7956b/michael-scott/1366_2000.jpeg');
          background-size: cover;
          background-position: center;
          margin-left: 8px;
        }

        `,
      ],
    };
  },
};
