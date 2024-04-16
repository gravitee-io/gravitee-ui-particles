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
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { cleanLocalStorageReduceState } from '@gravitee/ui-particles-angular';

import { GioSubmenuModule } from '../gio-submenu';
import { computeAndInjectStylesForStory, OEM_DEFAULT_LOGO, OEM_THEME_ARG_TYPES } from '../oem-theme.service';

import { GioMenuModule } from './gio-menu.module';
import { GioMenuItemComponent } from './gio-menu-item/gio-menu-item.component';
import { MenuSearchItem } from './gio-menu-search/gio-menu-search.component';
import { GioMenuSearchService } from './gio-menu-search/gio-menu-search.service';

const menuSearchItems = [
  { name: 'Dashboard', routerLink: '.', category: 'Home' },
  { name: 'Apis', routerLink: '/apis', category: 'Apis' },
  { name: 'Configuration', routerLink: '/apis/:apiId', category: 'Apis' },
  { name: 'General', routerLink: '/apis/:apiId/', category: 'Apis' },
  { name: 'User Permissions', routerLink: '/apis/:apiId/members', category: 'Apis' },
  { name: 'Resources', routerLink: '/apis/:apiId/resources', category: 'Apis' },
  { name: 'Runtime Logs', routerLink: '/apis/:apiId/v4/runtime-logs', category: 'Apis' },
  { name: 'Settings', routerLink: '/apis/:apiId/v4/runtime-logs-settings', category: 'Apis' },
  { name: 'Audit Logs', routerLink: '/apis/:apiId/v4/audit', category: 'Apis' },
  { name: 'Organizations', routerLink: '/organizations', category: 'Organizations' },
  { name: 'Settings', routerLink: '/organization/settings', category: 'Organizations' },
  { name: 'Applications', routerLink: '/applications', category: 'Applications' },
  { name: 'Gateways', routerLink: '/gateways', category: 'Gateways' },
  { name: 'Audit', routerLink: '/audit', category: 'Audit' },
  { name: 'Alerts', routerLink: '/alerts/list', category: 'Alerts' },
  { name: 'Settings', routerLink: '/settings', category: 'Environment' },
];

export default {
  title: 'OEM Theme / Menu',
  component: GioMenuItemComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, GioMenuModule, GioSubmenuModule],
      providers: [
        {
          provide: GioMenuSearchService,
          useValue: { menuSearchItems },
        },
      ],
    }),
    story => {
      cleanLocalStorageReduceState();
      return story();
    },
  ],
  render: () => ({}),
} as Meta;

let route = 'apis';
let subRoute = '';
const gioMenuContent = `
            <gio-menu-header>    
              <div class="gio-menu-selector">
                <gio-menu-selector tabindex="1" [selectedItemValue]="selectedItemValue" selectorTitle="Environment" [selectorItems]="selectorItems" (selectChange)="selectedItemValue=$event"></gio-menu-selector>
              </div>
              <gio-menu-search *ngIf="hasSearch" (valueChanges)="valueChanges($event)"></gio-menu-search>
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

const styles = [
  ` 
  #sidenav {
      height: 956px;
      display: flex;
  }
  
  #sidenav h1 {
      margin-left: 12px
  };
  `,
];

export const Default: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
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
      styles,
    };
  },
};

export const Reduced: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
      template: `
        <div id="sidenav">
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
      },
      styles,
    };
  },
};

export const WithOneItemInSelector: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
      template: `
        <div id="sidenav">
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
      },
      styles,
    };
  },
};

export const SmallMenu: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
      template: `
        <div id="sidenav">
          <gio-menu [reduced]="false">
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

export const WithSubMenu: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
      template: `
        <div id="sidenav">
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
      },
      styles,
    };
  },
};

export const ReducedWithSubMenu: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
      template: `
        <div id="sidenav">
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
      },
      styles,
    };
  },
};

export const WithSubMenuAndSearch: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    computeAndInjectStylesForStory(args, document);
    return {
      template: `
        <div id="sidenav">
          <gio-menu [reduced]="false">
            ${gioMenuContent}
          </gio-menu>
          <gio-submenu>
             ${gioSubmenuContent}
          </gio-submenu>
          <div>
            <h1>Selected env: {{ selectedItemValue }}</h1>
            <h3 style="margin-left: 14px">See search result in the story actions 👀</h3>
          </div>
        </div>
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        onSubClick: (target: string) => (subRoute = target),
        isSubActive: (target: string) => (subRoute != target ? null : true),
        valueChanges: (event: MenuSearchItem) => {
          console.info('selectedItem', event);
          action('selectedItem')(event);
        },
        selectedItemValue: 'onlyOne',
        selectorItems: [{ value: 'onlyOne', displayValue: '🧪 Only Env' }],
        hasSearch: true,
      },
      styles: [
        ...styles,
        `
          .gio-menu-selector {
            margin-bottom: 22px
          }
        `,
      ],
    };
  },
};
