/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { moduleMetadata, Meta, Args, StoryObj } from '@storybook/angular';
import { computeStylesForStory, GioMenuModule } from '@gravitee/ui-particles-angular';

import { GioLicenseExpirationNotificationComponent } from './gio-license-expiration-notification.component';
import { GioLicenseExpirationNotificationModule } from './gio-license-expiration-notification.module';

export default {
  title: 'Components / License expiration notification',
  component: GioLicenseExpirationNotificationComponent,
  decorators: [
    moduleMetadata({
      imports: [GioLicenseExpirationNotificationModule, GioMenuModule],
    }),
  ],
  render: () => ({}),
} as Meta;

const getCallToActionMessage = (args: Args) => args.callToActionMessage;
const getExpirationDate = (args: Args) => new Date(args.expirationDate);

const getShowCallToAction = (args: Args) => args.showCallToAction;
const getLink = (args: Args) => args.callToActionLink;

export const Default: StoryObj = {
  argTypes: {
    expirationDate: {
      control: 'date',
    },
    showCallToAction: {
      control: 'boolean',
    },
    callToActionMessage: {
      type: 'string',
    },
    callToActionLink: {
      type: 'string',
    },
  },
  args: {
    showCallToAction: true,
    expirationDate: new Date(),
  },
  render: args => {
    return {
      template: `<gio-license-expiration-notification [expirationDate]="expirationDate" [showCallToAction]="showCallToAction" [callToActionMessage]="callToActionMessage" [link]="link"></gio-license-expiration-notification>
        `,
      props: {
        expirationDate: getExpirationDate(args),
        showCallToAction: getShowCallToAction(args),
        callToActionMessage: getCallToActionMessage(args),
        link: getLink(args),
      },
    };
  },
};

let route = 'apis';
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
            <gio-menu-license-expiration-notification>
                        <gio-license-expiration-notification [expirationDate]="expirationDate"></gio-license-expiration-notification>
            </gio-menu-license-expiration-notification>
            <gio-menu-footer>
              <gio-menu-item tabindex="1" icon="gio:building" (click)="onClick('org')" [active]="isActive('org')">Organization settings</gio-menu-item>
            </gio-menu-footer>`;

export const InMenu: StoryObj = {
  render: args => {
    return {
      template: `
        <div id="sidenav"  [style]="style">
          <gio-menu [reduced]="false">
            ${gioMenuContent}
          </gio-menu>
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
        style: computeStylesForStory(args),
        expirationDate: new Date(),
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

export const Error: StoryObj = {
  render: _ => {
    return {
      template: `<gio-license-expiration-notification [expirationDate]="expirationDate" [inError]="inError"></gio-license-expiration-notification>
        `,
      props: {
        expirationDate: new Date(),
        inError: true,
      },
    };
  },
};
