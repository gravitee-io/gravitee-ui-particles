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
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { GioIconsModule } from '@gravitee/ui-particles-angular';

import { GioRadioButtonModule } from './gio-radio-button.module';

export default {
  title: 'Components / Radio button',
  decorators: [
    moduleMetadata({
      imports: [MatRadioModule, MatIconModule, GioIconsModule, GioRadioButtonModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const Default: StoryObj = {
  render: () => ({
    template: `
    <p style="background-color: #fff; padding:16px;">
            <mat-radio-group formControlName="visibility" class="gio-radio-group">
              <mat-radio-button value="PUBLIC" class="gio-radio-button">              
                <gio-radio-button-content icon="gio:language">
                    <gio-radio-button-title>Public</gio-radio-button-title>
                    <gio-radio-button-subtitle>Requires no subscription to view</gio-radio-button-subtitle>
                </gio-radio-button-content>
              </mat-radio-button>
              <mat-radio-button value="PRIVATE" class="gio-radio-button">
                <gio-radio-button-content icon="gio:lock">
                  <gio-radio-button-title>Private</gio-radio-button-title>
                  <gio-radio-button-subtitle>Requires approved subscription to view</gio-radio-button-subtitle>
                </gio-radio-button-content>
              </mat-radio-button>
            </mat-radio-group>
    </p>
    `,
  }),
};

export const Other: StoryObj = {
  render: () => ({
    template: `
    <p style="background-color: #fff; padding:16px;">

          <mat-radio-group class="gio-radio-group">
            <mat-radio-button value="FILL" class="gio-radio-button">
                <gio-radio-button-content icon="gio:edit-pencil">
                  <gio-radio-button-title>Fill in the content myself</gio-radio-button-title>
                </gio-radio-button-content>
            </mat-radio-button>
            <mat-radio-button value="IMPORT" class="gio-radio-button">
                <gio-radio-button-content icon="gio:down-circle">
                  <gio-radio-button-title>Import from file</gio-radio-button-title>
                </gio-radio-button-content>
            </mat-radio-button>
            <mat-radio-button value="EXTERNAL" class="gio-radio-button" disabled="true">
                <gio-radio-button-content icon="gio:language">
                  <gio-radio-button-title>Import from file</gio-radio-button-title>
                  <gio-radio-button-subtitle><div class="gio-badge-primary">Coming soon</div></gio-radio-button-subtitle>
                </gio-radio-button-content>
            </mat-radio-button>
          </mat-radio-group>
    </p>
    `,
  }),
};
