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
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';

import { FeatureInfo } from '../gio-license.service';

import { GioLicenseDialogComponent, GioLicenseDialogData } from './gio-license-dialog.component';
import { GioLicenseDialogModule } from './gio-license-dialog.module';

@Component({
  selector: 'gio-license-dialog-story',
  template: `<button id="open-dialog" (click)="openDialog()">More information</button>`,
  standalone: false,
})
class GioLicenseDialogStoryComponent {
  @Input() public featureInfo: FeatureInfo = {};
  constructor(private readonly matDialog: MatDialog) {}

  public openDialog() {
    this.matDialog
      .open<GioLicenseDialogComponent, GioLicenseDialogData, boolean>(GioLicenseDialogComponent, {
        data: {
          featureInfo: this.featureInfo,
          trialURL: 'https://gravitee.io/self-hosted-trial',
        },
        role: 'alertdialog',
        id: 'dialog',
      })
      .afterClosed()
      .pipe(
        tap(confirmed => {
          action('confirmed?')(confirmed);
        }),
      )
      .subscribe();
  }
}

export default {
  title: 'Components / License dialog',
  component: GioLicenseDialogComponent,
  decorators: [
    moduleMetadata({
      declarations: [GioLicenseDialogStoryComponent],
      imports: [GioLicenseDialogModule, MatButtonModule, MatDialogModule],
    }),
  ],
  argTypes: {
    featureInfo: {
      type: { name: 'object', value: {} },
    },
  },
  render: args => ({
    template: `<gio-license-dialog-story [name]="name" [featureInfo]="featureInfo"></gio-license-dialog-story>`,
    props: { ...args },
  }),
  parameters: {
    chromatic: { delay: 2000 },
  },
} as Meta;

export const Default: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

Default.args = {
  featureInfo: {
    image: 'images/audit-trail.svg',
    description:
      'Explore Gravitee enterprise functionality, such as support for event brokers, asynchronous APIs, and Webhook subscriptions.',
  },
};

export const Custom: StoryObj = {
  play: context => {
    const button = context.canvasElement.querySelector('#open-dialog') as HTMLButtonElement;
    button.click();
  },
};

Custom.args = {
  featureInfo: {
    title: 'Request an icon',
    image: 'images/audit-trail.svg',
    description:
      'Explore Gravitee enterprise functionality, such as support for event brokers, asynchronous APIs, and Webhook subscriptions.',
    trialButtonLabel: 'Contact Gravitee to upgrade',
    hideDays: true,
  },
};
