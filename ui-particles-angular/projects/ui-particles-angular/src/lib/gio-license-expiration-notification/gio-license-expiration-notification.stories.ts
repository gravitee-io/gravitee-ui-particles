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
import { moduleMetadata, Meta, Args } from '@storybook/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Story } from '@storybook/angular/types-7-0';
import { HttpClientModule } from '@angular/common/http';
import { withDesign } from 'storybook-addon-designs';

import { GioLicenseExpirationNotificationComponent } from './gio-license-expiration-notification.component';
import { GioLicenseExpirationNotificationModule } from './gio-license-expiration-notification.module';

export default {
  title: 'Components / License expiration notification',
  component: GioLicenseExpirationNotificationComponent,
  decorators: [
    moduleMetadata({
      imports: [GioLicenseExpirationNotificationModule, GioMenuModule, NoopAnimationsModule, HttpClientModule],
    }),
    withDesign,
  ],
  render: () => ({}),
} as Meta;

const getCallToActionMessage = (args: Args) => args.callToActionMessage;
const getExpirationDate = (args: Args) => new Date(args.expirationDate);

const getShowCallToAction = (args: Args) => args.showCallToAction;
const getLink = (args: Args) => args.callToActionLink;

export const Default: Story = {
  argTypes: {
    expirationDate: {
      control: 'date',
      defaultValue: new Date(),
    },
    showCallToAction: {
      control: 'boolean',
      defaultValue: true,
    },
    callToActionMessage: {
      type: 'string',
    },
    callToActionLink: {
      type: 'string',
    },
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

export const Error: Story = {
  render: _ => {
    return {
      template: `<gio-expiration-notification [expirationDate]="expirationDate" [inError]="inError"></gio-expiration-notification>
        `,
      props: {
        expirationDate: new Date(),
        inError: true,
      },
    };
  },
};
