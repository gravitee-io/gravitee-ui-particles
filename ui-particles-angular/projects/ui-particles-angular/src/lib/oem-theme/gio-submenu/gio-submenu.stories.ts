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
import { GioSubmenuGroupComponent } from '@gravitee/ui-particles-angular';
import { MatButtonModule } from '@angular/material/button';

import { OEM_THEME_ARG_TYPES, computeStylesForStory, OEM_DEFAULT_LOGO, resetStoryStyleInjection } from '../oem-theme.service';
import { cleanLocalStorageReduceState } from '../gio-menu';

import { GioSubmenuModule } from './gio-submenu.module';

export default {
  title: 'OEM Theme / Submenu',
  component: GioSubmenuGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [GioSubmenuModule, MatButtonModule],
    }),
    story => {
      cleanLocalStorageReduceState();
      return story();
    },
  ],
  render: () => ({}),
} as Meta;

let route = 'plans';

export const Default: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    resetStoryStyleInjection(args);

    return {
      template: `
<div [style]="style">
        <gio-submenu >
            <div gioSubmenuTitle>Submenu title</div>   
            <gio-submenu-item (click)="onClick('message')" [active]="isActive('message')">Message</gio-submenu-item>
            <gio-submenu-group title="Portal">
              <gio-submenu-item (click)="onClick('general')" [active]="isActive('general')">General</gio-submenu-item>
              <gio-submenu-item (click)="onClick('plans')" [active]="isActive('plans')">Plans</gio-submenu-item>
              <gio-submenu-item (click)="onClick('doc')" [active]="isActive('doc')">Documentation</gio-submenu-item>
              <gio-submenu-item (click)="onClick('user')" [active]="isActive('user')">User & Group Access</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Proxy">
              <gio-submenu-item (click)="onClick('general-2')" [active]="isActive('general-2')">General</gio-submenu-item>
              <gio-submenu-item (click)="onClick('backend')" [active]="isActive('backend')">Backend services</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Design">
              <gio-submenu-item (click)="onClick('policies')" [active]="isActive('policies')">Policies</gio-submenu-item>
              <gio-submenu-item (click)="onClick('resources')" [active]="isActive('resources')">Resources</gio-submenu-item>
              <gio-submenu-item (click)="onClick('properties')" [active]="isActive('properties')">Properties</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Analytics">
              <gio-submenu-item (click)="onClick('overview')" [active]="isActive('overview')">Overview</gio-submenu-item>
              <gio-submenu-item (click)="onClick('logs')" [active]="isActive('logs')">Logs</gio-submenu-item>
              <gio-submenu-item (click)="onClick('path')" [active]="isActive('path')">Path mappings</gio-submenu-item>
              <gio-submenu-item (click)="onClick('alerts')" [active]="isActive('alerts')">Alerts</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-item (click)="onClick('audit')" [active]="isActive('audit')">Audit</gio-submenu-item>
        </gio-submenu>
        </div>
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        style: computeStylesForStory(args),
      },
    };
  },
};

export const Light: StoryObj = {
  argTypes: OEM_THEME_ARG_TYPES,
  args: {
    logo: OEM_DEFAULT_LOGO,
  },
  render: args => {
    resetStoryStyleInjection(args);

    return {
      template: `
<div [style]="style">
        <gio-submenu theme="light" >
            <button gioSubmenuTitle mat-button>Submenu title</button>   
            <gio-submenu-item (click)="onClick('message')" [active]="isActive('message')">Message</gio-submenu-item>
            <gio-submenu-group title="Portal" theme="light">
              <gio-submenu-item (click)="onClick('general')" [active]="isActive('general')">General</gio-submenu-item>
              <gio-submenu-item (click)="onClick('plans')" [active]="isActive('plans')">Plans</gio-submenu-item>
              <gio-submenu-item (click)="onClick('doc')" [active]="isActive('doc')">Documentation</gio-submenu-item>
              <gio-submenu-item (click)="onClick('user')" [active]="isActive('user')">User & Group Access</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Proxy" theme="light">
              <gio-submenu-item (click)="onClick('general-2')" [active]="isActive('general-2')">General</gio-submenu-item>
              <gio-submenu-item (click)="onClick('backend')" [active]="isActive('backend')">Backend services</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Design" theme="light">
              <gio-submenu-item (click)="onClick('policies')" [active]="isActive('policies')">Policies</gio-submenu-item>
              <gio-submenu-item (click)="onClick('resources')" [active]="isActive('resources')">Resources</gio-submenu-item>
              <gio-submenu-item (click)="onClick('properties')" [active]="isActive('properties')">Properties</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-group title="Analytics" theme="light">
              <gio-submenu-item (click)="onClick('overview')" [active]="isActive('overview')">Overview</gio-submenu-item>
              <gio-submenu-item (click)="onClick('logs')" [active]="isActive('logs')">Logs</gio-submenu-item>
              <gio-submenu-item (click)="onClick('path')" [active]="isActive('path')">Path mappings</gio-submenu-item>
              <gio-submenu-item (click)="onClick('alerts')" [active]="isActive('alerts')">Alerts</gio-submenu-item>
            </gio-submenu-group>
            <gio-submenu-item (click)="onClick('audit')" [active]="isActive('audit')">Audit</gio-submenu-item>
        </gio-submenu>
        </div>
        `,
      props: {
        onClick: (target: string) => (route = target),
        isActive: (target: string) => (route != target ? null : true),
        style: computeStylesForStory(args),
      },
    };
  },
};
