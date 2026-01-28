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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { action } from 'storybook/actions';
import { ActivatedRoute, provideRouter, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { cleanLocalStorageReduceState } from '@gravitee/ui-particles-angular';

import { GioSubmenuModule } from '../gio-submenu';
import { computeAndInjectStylesForStory, OEM_DEFAULT_LOGO, OEM_THEME_ARG_TYPES } from '../oem-theme.stories.service';

import { GioMenuModule } from './gio-menu.module';
import { GioMenuItemComponent } from './gio-menu-item/gio-menu-item.component';
import { MenuSearchItem } from './gio-menu-search/gio-menu-search.component';
import { GioMenuSearchService } from './gio-menu-search/gio-menu-search.service';

const menuSearchItems = [
  { name: 'Dashboard', routerLink: '/', category: 'Home' },
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
  { name: 'Messages', routerLink: '/messages', category: 'Messages' },
  { name: 'My alerts', routerLink: '/alerts', category: 'Alerts' },
  { name: 'Activity', routerLink: '/alerts/activity', category: 'Alerts' },
  { name: 'Settings', routerLink: '/settings', category: 'Environment' },
  { name: 'Overview', routerLink: '/api-score', category: 'API Score' },
  { name: 'Rulesets & Functions', routerLink: '/api-score/rulesets', category: 'API Score' },
  { name: 'Overview', routerLink: '/analytics', category: 'Analytics' },
  { name: 'Dashboards', routerLink: '/analytics/dashboards', category: 'Analytics' },
  { name: 'Logs', routerLink: '/analytics/logs-explorer', category: 'Analytics' },
  { name: 'Legacy Dashboard', routerLink: '/analytics/dashboard', category: 'Analytics' },
  { name: 'Legacy Logs', routerLink: '/analytics/logs', category: 'Analytics' },
];

@Component({
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  selector: 'gio-navigation-simulation',
  template: `
    <div style="padding: 24px">
      <h1 data-testid="navigation-title">{{ title$ | async }}</h1>
    </div>
  `,
})
class GioNavigationSimulationComponent {
  public title$ = this.activatedRoute.data.pipe(map(data => data.title));
  constructor(private readonly activatedRoute: ActivatedRoute) {}
}

export default {
  title: 'OEM Theme / Menu',
  component: GioMenuItemComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, GioMenuModule, GioSubmenuModule, RouterModule],
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
    applicationConfig({
      providers: [
        provideRouter([
          ...menuSearchItems
            .filter(item => item.routerLink !== '.' && !item.routerLink.includes(':'))
            .map(item => ({
              path: item.routerLink.replace(/^\//, ''),
              component: GioNavigationSimulationComponent,
              data: { title: `${item.category} : ${item.name}` },
            })),
          { path: '**', component: GioNavigationSimulationComponent, data: { title: 'Dashboard' } },
        ]),
      ],
    }),
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
              <gio-menu-item tabindex="1" icon="gio:home" routerLink="/" routerLinkActive #rlaDashboard="routerLinkActive" [routerLinkActiveOptions]="{ exact: true }" [active]="rlaDashboard.isActive">Dashboard</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:upload-cloud" routerLink="/apis" routerLinkActive #rlaApis="routerLinkActive" [active]="rlaApis.isActive">Apis</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:multi-window" routerLink="/applications" routerLinkActive #rlaApplications="routerLinkActive" [active]="rlaApplications.isActive">Applications</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:cloud-server" routerLink="/gateways" routerLinkActive #rlaGateways="routerLinkActive" [active]="rlaGateways.isActive">Gateways</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:verified" routerLink="/audit" routerLinkActive #rlaAudit="routerLinkActive" [active]="rlaAudit.isActive" iconRight="gio:lock">Audit</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:message-text" routerLink="/messages" routerLinkActive #rlaMessages="routerLinkActive" [active]="rlaMessages.isActive">Messages</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:settings" routerLink="/settings" routerLinkActive #rlaSettings="routerLinkActive" [active]="rlaSettings.isActive">Settings</gio-menu-item>
            </gio-menu-list>
            <gio-menu-footer>
              <gio-menu-item tabindex="1" icon="gio:building" routerLink="/organization/settings" routerLinkActive #rlaOrg="routerLinkActive" [active]="rlaOrg.isActive">Organization settings</gio-menu-item>
            </gio-menu-footer>`;

const gioMenuContentWithItemsPanel = `
            <gio-menu-header>    
              <div class="gio-menu-selector">
                <gio-menu-selector tabindex="1" [selectedItemValue]="selectedItemValue" selectorTitle="Environment" [selectorItems]="selectorItems" (selectChange)="selectedItemValue=$event"></gio-menu-selector>
              </div>
              <gio-menu-search *ngIf="hasSearch" (valueChanges)="valueChanges($event)"></gio-menu-search>
            </gio-menu-header>
            <gio-menu-list>    
              <gio-menu-item tabindex="1" icon="gio:home" routerLink="/" routerLinkActive #rlaDashboard="routerLinkActive" [routerLinkActiveOptions]="{ exact: true }" [active]="rlaDashboard.isActive">Dashboard</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:upload-cloud" routerLink="/apis" routerLinkActive #rlaApis="routerLinkActive" [active]="rlaApis.isActive">Apis</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:multi-window" routerLink="/applications" routerLinkActive #rlaApplications="routerLinkActive" [active]="rlaApplications.isActive">Applications</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:cloud-server" routerLink="/gateways" routerLinkActive #rlaGateways="routerLinkActive" [active]="rlaGateways.isActive">Gateways</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:verified" routerLink="/audit" routerLinkActive #rlaAudit="routerLinkActive" [active]="rlaAudit.isActive" iconRight="gio:lock">Audit</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:message-text" routerLink="/messages" routerLinkActive #rlaMessages="routerLinkActive" [active]="rlaMessages.isActive">Messages</gio-menu-item>

              <gio-menu-items [title]="'API Score'" icon="gio:shield-check" routerBasePath="/api-score"> 
               <gio-menu-item routerLink="/api-score" routerLinkActive [routerLinkActiveOptions]="{ exact: true }">Overview</gio-menu-item>
               <gio-menu-item routerLink="/api-score/rulesets" routerLinkActive>Rulesets & Functions</gio-menu-item>
              </gio-menu-items>
              
              <gio-menu-items [title]="'Analytics'" icon="gio:bar-chart-2" routerBasePath="/analytics"> 
               <gio-menu-item routerLink="/analytics" routerLinkActive [routerLinkActiveOptions]="{ exact: true }">Overview</gio-menu-item>
               <gio-menu-item routerLink="/analytics/dashboards" routerLinkActive>Dashboards</gio-menu-item>
               <gio-menu-item routerLink="/analytics/logs-explorer" routerLinkActive>Logs</gio-menu-item>
               <gio-menu-item routerLink="/analytics/dashboard" routerLinkActive>Legacy - Dashboard</gio-menu-item>
               <gio-menu-item routerLink="/analytics/logs" routerLinkActive>Legacy - Logs</gio-menu-item>
              </gio-menu-items>
             
              <gio-menu-items [title]="'Alerts'" icon="gio:alarm" routerBasePath="/alerts"> 
               <gio-menu-item routerLink="/alerts" routerLinkActive [routerLinkActiveOptions]="{ exact: true }">My alerts</gio-menu-item>
               <gio-menu-item routerLink="/alerts/activity" routerLinkActive>Activity</gio-menu-item>
              </gio-menu-items>
              
              <gio-menu-item tabindex="1" icon="gio:settings" routerLink="/settings" routerLinkActive #rlaSettings="routerLinkActive" [active]="rlaSettings.isActive">Settings</gio-menu-item>       
            </gio-menu-list>
            <gio-menu-footer>
              <gio-menu-item tabindex="1" icon="gio:building" routerLink="/organization/settings" routerLinkActive #rlaOrg="routerLinkActive" [active]="rlaOrg.isActive">Organization settings</gio-menu-item>
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

export const DefaultWithItemsPanel: StoryObj = {
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
            ${gioMenuContentWithItemsPanel}
          </gio-menu>
          <div>
            <h1>Selected env: {{ selectedItemValue }}</h1>
            <router-outlet></router-outlet>
          </div>
        </div>
        `,
      props: {
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

export const ReducedWithItemsPanel: StoryObj = {
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
            ${gioMenuContentWithItemsPanel}
          </gio-menu>
          <div>
            <h1>Selected env: {{ selectedItemValue }}</h1>
            <h3 style="margin-left: 14px">Hover over the Analytics, API Score, or Alerts icons to see the overlay panel 👀</h3>
            <router-outlet></router-outlet>
          </div>
        </div>
        `,
      props: {
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
              <gio-menu-item tabindex="1" icon="gio:home" routerLink="/" routerLinkActive #rlaDashboard="routerLinkActive" [routerLinkActiveOptions]="{ exact: true }" [active]="rlaDashboard.isActive">Dashboard</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:upload-cloud" routerLink="/apis" routerLinkActive #rlaApis="routerLinkActive" [active]="rlaApis.isActive">Apis</gio-menu-item>
              <gio-menu-item tabindex="1" icon="gio:settings" routerLink="/settings" routerLinkActive #rlaSettings="routerLinkActive" [active]="rlaSettings.isActive">Settings</gio-menu-item>
            </gio-menu-list>
            <gio-menu-footer>
              <gio-menu-item tabindex="1" icon="gio:building" routerLink="/organization/settings" routerLinkActive #rlaOrg="routerLinkActive" [active]="rlaOrg.isActive">Settings</gio-menu-item>
            </gio-menu-footer>
          </gio-menu>
          <h1>Selected env: {{ selectedItemValue }}</h1>
        </div>
        `,
      props: {
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
