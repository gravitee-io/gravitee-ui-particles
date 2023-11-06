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
import { GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { GioSubmenuModule } from './gio-submenu';
import { GioMenuModule } from './gio-menu';
import { GioMenuItemComponent } from './gio-menu/gio-menu-item/gio-menu-item.component';
import { GioTopBarLinkModule, GioTopBarMenuModule, GioTopBarModule } from './gio-top-bar';
import { COLOR_ARG_TYPES, computeStyle } from './oem-theme-shared';

export default {
  title: 'OEM Theme / Menu + Top Bar',
  component: GioMenuItemComponent,
  decorators: [
    moduleMetadata({
      imports: [
        GioMenuModule,
        NoopAnimationsModule,
        GioSubmenuModule,
        MatIconModule,
        MatButtonModule,
        GioIconsModule,
        GioTopBarModule,
        GioTopBarLinkModule,
        GioTopBarMenuModule,
      ],
    }),
    withDesign,
  ],
  render: () => ({}),
} as Meta;

let route = 'apis';
let subRoute = '';
const gioTopBarContent = `
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
                <span class="gio-notification__badge gio-badge-accent">1</span>
              </button>
              <div class="image"></div>
            </gio-top-bar-menu>
          </gio-top-bar>
`;
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
const gioSubmenuContent = `
            <div gioSubmenuTitle>
            <div style="display: flex; flex-flow: row; gap: 12px; align-items: center;">
                        <mat-icon color="primary" svgIcon="gio:cloud-published" style="width: 15px;"></mat-icon><div class="api-name">My example API</div>
</div>
</div>   
            <gio-submenu-item (click)="onSubClick('message')" [active]="isSubActive('message')">Message</gio-submenu-item>
            <gio-submenu-group title="Portal">
              <gio-submenu-item (click)="onSubClick('general')" [active]="isSubActive('general')">General</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('plans')" [active]="isSubActive('plans')">Plans</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('doc')" [active]="isSubActive('doc')">Documentation</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('user')" [active]="isSubActive('user')">User & Group Access</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Proxy">
              <gio-submenu-item (click)="onSubClick('general-2')" [active]="isSubActive('general-2')">General</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('backend')" [active]="isSubActive('backend')">Backend services</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Design">
              <gio-submenu-item (click)="onSubClick('policies')" [active]="isSubActive('policies')">Policies</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('resources')" [active]="isSubActive('resources')">Resources</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('properties')" [active]="isSubActive('properties')">Properties</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Analytics">
              <gio-submenu-item (click)="onSubClick('overview')" [active]="isSubActive('overview')">Overview</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('logs')" [active]="isSubActive('logs')">Logs</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('path')" [active]="isSubActive('path')">Path mappings</gio-submenu-item>
              <gio-submenu-item (click)="onSubClick('alerts')" [active]="isSubActive('alerts')">Alerts</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-item (click)="onSubClick('audit')" [active]="isActive('audit')">Audit</gio-submenu-item>
`;

export const Default: Story = {
  argTypes: COLOR_ARG_TYPES,
  render: args => {
    return {
      template: `
<div [style]="style">
        ${gioTopBarContent}
    <div id="sidenav" >
        <gio-menu [reduced]="false">
          ${gioMenuContent}
        </gio-menu>
          <gio-submenu>
             ${gioSubmenuContent}
          </gio-submenu>
        <h1>Selected env: {{ selectedItemValue }}</h1>
    </div>
</div>
        
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        onSubClick: (target: string) => (subRoute = target),
        isSubActive: (target: string) => (subRoute != target ? null : true),
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
        
        .gio-submenu__loaded {
          padding-left: 0;
        }
        
        .gio-notification__badge {
          position: absolute;
          top: -4px;
          right: -10px;
          padding: 2px 6px;
        }
        
        .api-name {
          border-left: 1px solid var(--gio-oem-palette--background-contrast, #fff); 
          padding-left: 12px;
        }
        `,
      ],
    };
  },
};
