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

import { GioSubmenuModule } from '../gio-submenu';
import { COLOR_ARG_TYPES, computeStyle } from '../oem-theme-shared';

import { GioMenuModule } from './gio-menu.module';
import { GioMenuItemComponent } from './gio-menu-item/gio-menu-item.component';

export default {
  title: 'OEM Theme / Menu',
  component: GioMenuItemComponent,
  decorators: [
    moduleMetadata({
      imports: [GioMenuModule, GioSubmenuModule, NoopAnimationsModule],
    }),
    withDesign,
  ],
  render: () => ({}),
} as Meta;

let route = 'apis';
let subRoute = '';
const gioMenuContent = `
            <gio-menu-header>    
              <gio-menu-selector tabindex="1" [selectedItemValue]="selectedItemValue" selectorTitle="Environment" [selectorItems]="selectorItems" (selectChange)="selectedItemValue=$event"></gio-menu-selector>
            </gio-menu-header>
            <gio-menu-list>    
              <gio-menu-item tabindex="1" icon="gio:home" (click)="onClick('dashboard')" [active]="isActive('dashboard')">Dashboard</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:upload-cloud" (click)="onClick('apis')" [active]="isActive('apis')">Apis</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:multi-window" (click)="onClick('apps')" [active]="isActive('apps')">Applications</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:cloud-server" (click)="onClick('gateways')" [active]="isActive('gateways')">Gateways</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:verified" (click)="onClick('audit')" [active]="isActive('audit')" iconRight="gio:lock">Audit</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:message-text" (click)="onClick('messages')" [active]="isActive('messages')">Messages</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:settings" (click)="onClick('settings')" [active]="isActive('settings')">Settings</gio-menu-item>
            </gio-menu-list>
            <gio-menu-footer>
              <gio-menu-item tabindex="1" icon="gio:building" (click)="onClick('org')" [active]="isActive('org')">Organization settings</gio-menu-item>
            </gio-menu-footer>`;

export const Default: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
        <div id="sidenav" [style]="style">
          <gio-menu [reduced]="false">
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
        style: computeStyle(args),
      },
      styles: [
        ` 
        #sidenav {
            height: 956px;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
      ],
    };
  },
};

export const Reduced: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
        <div id="sidenav"  [style]="style">
          <gio-menu [reduced]="true">
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
        style: computeStyle(args),
      },
      styles: [
        ` 
        #sidenav {
            height: 956px;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
      ],
    };
  },
};

export const WithOneItemInSelector: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
        <div id="sidenav"  [style]="style">
          <gio-menu [reduced]="false">
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
        style: computeStyle(args),
      },
      styles: [
        ` 
        #sidenav {
            height: 956px;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
      ],
    };
  },
};

export const SmallMenu: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
        <div id="sidenav"  [style]="style">
          <gio-menu>
            <gio-menu-header>    
              <gio-menu-selector tabindex="1" [selectedItemValue]="selectedItemValue" selectorTitle="Environment" [selectorItems]="selectorItems" (selectChange)="selectedItemValue=$event"></gio-menu-selector>
            </gio-menu-header>
            <gio-menu-list>    
              <gio-menu-item tabindex="1" icon="gio:home" (click)="onClick('dashboard')" [active]="isActive('dashboard')">Dashboard</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:upload-cloud" (click)="onClick('apis')" [active]="isActive('apis')">Apis</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:settings" (click)="onClick('settings')" [active]="isActive('settings')">Settings</gio-menu-item>
            </gio-menu-list>
            <gio-menu-footer>
              <gio-menu-item tabindex="1" icon="gio:building" (click)="onClick('org')" [active]="isActive('org')">Settings</gio-menu-item>
            </gio-menu-footer>
          </gio-menu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        selectedItemValue: 'onlyOne',
        selectorItems: [{ value: 'onlyOne', displayValue: '🧪 Only Env' }],
        style: computeStyle(args),
      },
      styles: [
        ` 
        #sidenav {
            height: 500px;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
      ],
    };
  },
};

const gioSubmenuContent = `
      <div gioSubmenuTitle>Submenu title</div>  
        <gio-submenu-item tabindex="1" (click)="onClick('message')" [active]="isActive('message')">Message</gio-submenu-item>
        <gio-submenu-group title="Portal">
          <gio-submenu-item tabindex="1" (click)="onClick('general')" [active]="isActive('general')">General</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('plans')" [active]="isActive('plans')">Plans</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('doc')" [active]="isActive('doc')">Documentation</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('user')" [active]="isActive('user')">User & Group Access</gio-submenu-item>
        </gio-submenu-group>
        <gio-submenu-group title="Proxy">
          <gio-submenu-item tabindex="1" (click)="onClick('general-2')" [active]="isActive('general-2')">General</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('backend')" [active]="isActive('backend')">Backend services</gio-submenu-item>
        </gio-submenu-group>
        <gio-submenu-group title="Design">
          <gio-submenu-item tabindex="1" (click)="onClick('policies')" [active]="isActive('policies')">Policies</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('resources')" [active]="isActive('resources')">Resources</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('properties')" [active]="isActive('properties')">Properties</gio-submenu-item>
        </gio-submenu-group>
        <gio-submenu-group title="Analytics">
          <gio-submenu-item tabindex="1" (click)="onClick('overview')" [active]="isActive('overview')">Overview</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('logs')" [active]="isActive('logs')">Logs</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('path')" [active]="isActive('path')">Path mappings</gio-submenu-item>
          <gio-submenu-item tabindex="1" (click)="onClick('alerts')" [active]="isActive('alerts')">Alerts</gio-submenu-item>
        </gio-submenu-group>
      <gio-submenu-item tabindex="1" (click)="onClick('audit')" [active]="isActive('audit')" iconRight="gio:lock">Audit</gio-submenu-item>`;

export const WithSubMenu: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
        <div id="sidenav"  [style]="style">
          <gio-menu [reduced]="false">
            ${gioMenuContent}
          </gio-menu>
          <gio-submenu>
             ${gioSubmenuContent}
          </gio-submenu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        onSubClick: (target: string) => (subRoute = target),
        isSubActive: (target: string) => (subRoute != target ? null : true),
        selectedItemValue: 'onlyOne',
        selectorItems: [{ value: 'onlyOne', displayValue: '🧪 Only Env' }],
        style: computeStyle(args),
      },
      styles: [
        ` 
        #sidenav {
            height: 956px;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
      ],
    };
  },
};

export const ReducedWithSubMenu: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
        <div id="sidenav" [style]="style">
          <gio-menu [reduced]="true">
            ${gioMenuContent}
          </gio-menu>
          <gio-submenu>
             ${gioSubmenuContent}
          </gio-submenu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        onSubClick: (target: string) => (subRoute = target),
        isSubActive: (target: string) => (subRoute != target ? null : true),
        selectedItemValue: 'onlyOne',
        selectorItems: [{ value: 'onlyOne', displayValue: '🧪 Only Env' }],
        style: computeStyle(args),
      },
      styles: [
        ` 
        #sidenav {
            height: 956px;
            display: flex;
        }
        
        #sidenav h1 {
            margin-left: 12px
        };
        `,
      ],
    };
  },
};
