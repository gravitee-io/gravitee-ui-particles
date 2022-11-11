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

import { GioSubmenuGroupComponent } from './gio-submenu-group/gio-submenu-group.component';
import { GioSubmenuModule } from './gio-submenu.module';

export default {
  title: 'Components / Submenu',
  component: GioSubmenuGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [GioSubmenuModule],
    }),
    withDesign,
  ],
  render: () => ({}),
} as Meta;

let route = 'plans';
export const Default: Story = {
  render: () => ({
    template: `
        <gio-submenu>
            <gio-submenu-group>Portal</gio-submenu-group>
            <gio-submenu-item (click)="onClick('general')" [active]="isActive('general')">General</gio-submenu-item>
            <gio-submenu-item (click)="onClick('plans')" [active]="isActive('plans')">Plans</gio-submenu-item>
            <gio-submenu-item (click)="onClick('doc')" [active]="isActive('doc')">Documentation</gio-submenu-item>
            <gio-submenu-item (click)="onClick('user')" [active]="isActive('user')">User & Group Access</gio-submenu-item>
            <gio-submenu-group>Proxy</gio-submenu-group>
            <gio-submenu-item (click)="onClick('general-2')" [active]="isActive('general-2')">General</gio-submenu-item>
            <gio-submenu-item (click)="onClick('backend')" [active]="isActive('backend')">Backend services</gio-submenu-item>
            <gio-submenu-group>Design</gio-submenu-group>
            <gio-submenu-item (click)="onClick('policies')" [active]="isActive('policies')">Policies</gio-submenu-item>
            <gio-submenu-item (click)="onClick('resources')" [active]="isActive('resources')">Resources</gio-submenu-item>
            <gio-submenu-item (click)="onClick('properties')" [active]="isActive('properties')">Properties</gio-submenu-item>
            <gio-submenu-group>Analytics</gio-submenu-group>
            <gio-submenu-item (click)="onClick('overview')" [active]="isActive('overview')">Overview</gio-submenu-item>
            <gio-submenu-item (click)="onClick('logs')" [active]="isActive('logs')">Logs</gio-submenu-item>
            <gio-submenu-item (click)="onClick('path')" [active]="isActive('path')">Path mappings</gio-submenu-item>
            <gio-submenu-item (click)="onClick('alerts')" [active]="isActive('alerts')">Alerts</gio-submenu-item>
            <gio-submenu-group>Audit</gio-submenu-group>
        </gio-submenu>
        `,
    props: {
      onClick: (target: string) => (route = target),
      isActive: (target: string) => (route != target ? null : true),
    },
  }),
};
