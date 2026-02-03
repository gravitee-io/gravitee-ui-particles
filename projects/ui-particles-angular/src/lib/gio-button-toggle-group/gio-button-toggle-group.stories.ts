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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { GioIconsModule } from '@gravitee/ui-particles-angular';

export default {
  title: 'Components / Button / Button Toggle Group',
  decorators: [
    moduleMetadata({
      imports: [MatButtonToggleModule, GioIconsModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const All: StoryObj = {
  render: () => ({
    template: `
    <h4>Text Only</h4>
    <p style="background-color: #fff; padding:16px;">
      <mat-button-toggle-group class="gio-button-toggle-group" aria-label="Font Style">
        <mat-button-toggle value="bold">Bold</mat-button-toggle>
        <mat-button-toggle value="italic">Italic</mat-button-toggle>
        <mat-button-toggle value="underline">Underline</mat-button-toggle>
      </mat-button-toggle-group>
    </p>
    
    <h4>Icons Only</h4>
    <p style="background-color: #fff; padding:16px;">
      <mat-button-toggle-group class="gio-button-toggle-group-icons" aria-label="Font Style" hideSingleSelectionIndicator="true">
        <mat-button-toggle value="LIST"><mat-icon svgIcon="gio:list"></mat-icon></mat-button-toggle>
        <mat-button-toggle value="TILE"><mat-icon svgIcon="gio:4x4-cell"></mat-icon></mat-button-toggle>
      </mat-button-toggle-group>
    </p>
    `,
  }),
};
