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
import { withDesign } from 'storybook-addon-designs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GioMenuModule } from './gio-menu.module';
import { GioMenuItemComponent } from './gio-menu-item/gio-menu-item.component';

export default {
  title: 'Components / Menu',
  component: GioMenuItemComponent,
  decorators: [
    moduleMetadata({
      imports: [GioMenuModule, NoopAnimationsModule],
    }),
    withDesign,
  ],
  render: () => ({}),
} as Meta;

let route = 'apis';
const gioMenuContent = `
            <gio-menu-header>    
              <gio-menu-selector [selectedItemValue]="selectedItemValue" selectorTitle="Environment" [selectorItems]="selectorItems" (selectChange)="selectedItemValue=$event"></gio-menu-selector>
            </gio-menu-header>
            <gio-menu-list>    
              <gio-menu-item icon="gio:home" (click)="onClick('dashboard')" [active]="isActive('dashboard')">Dashboard</gio-menu-item>
              <gio-menu-item icon="gio:upload-cloud" (click)="onClick('apis')" [active]="isActive('apis')">Apis</gio-menu-item>
              <gio-menu-item icon="gio:multi-window" (click)="onClick('apps')" [active]="isActive('apps')">Applications</gio-menu-item>
              <gio-menu-item icon="gio:cloud-server" (click)="onClick('gateways')" [active]="isActive('gateways')">Gateways</gio-menu-item>
              <gio-menu-item icon="gio:verified" (click)="onClick('audit')" [active]="isActive('audit')">Audit</gio-menu-item>
              <gio-menu-item icon="gio:message-text" (click)="onClick('messages')" [active]="isActive('messages')">Messages</gio-menu-item>
              <gio-menu-item icon="gio:settings" (click)="onClick('settings')" [active]="isActive('settings')">Settings</gio-menu-item>
            </gio-menu-list>
            <gio-menu-footer>
              <gio-menu-item icon="gio:building" (click)="onClick('org')" [active]="isActive('org')">Organization settings</gio-menu-item>
            </gio-menu-footer>`;

export const Default: Story = {
  render: () => ({
    template: `
        <div id="sidenav">
          <gio-menu>
            ${gioMenuContent}
          </gio-menu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
    props: {
      onClick: (target: string) => (route = target),
      isActive: (target: string) => (route != target ? null : true),
      selectedItemValue: 'dev',
      selectorItems: [
        { value: 'prod', displayValue: '🚀 Prod' },
        { value: 'dev', displayValue: '🧪 Development' },
      ],
    },
    styles: [
      ` 
        #sidenav {
            height: 100vh;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
    ],
  }),
};

export const Reduced: Story = {
  render: () => ({
    template: `
        <div id="sidenav">
          <gio-menu reduced="true">
            ${gioMenuContent}
          </gio-menu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
    props: {
      onClick: (target: string) => (route = target),
      isActive: (target: string) => (route != target ? null : true),
      selectedItemValue: 'prod',
      selectorItems: [
        { value: 'prod', displayValue: '🚀 Prod' },
        { value: 'dev', displayValue: '🧪 Development' },
      ],
    },
    styles: [
      ` 
        #sidenav {
            height: 100vh;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
    ],
  }),
};

export const WithOneItemInSelector: Story = {
  render: () => ({
    template: `
        <div id="sidenav">
          <gio-menu>
            ${gioMenuContent}
          </gio-menu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
    props: {
      onClick: (target: string) => (route = target),
      isActive: (target: string) => (route != target ? null : true),
      selectedItemValue: 'onlyOne',
      selectorItems: [{ value: 'onlyOne', displayValue: '🧪 Only Env' }],
    },
    styles: [
      ` 
        #sidenav {
            height: 100vh;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
    ],
  }),
};
