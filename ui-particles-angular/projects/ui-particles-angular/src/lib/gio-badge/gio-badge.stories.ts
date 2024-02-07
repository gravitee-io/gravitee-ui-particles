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

import { GioIconsModule } from '../gio-icons/gio-icons.module';

export default {
  title: 'Components / Badge',
  decorators: [
    moduleMetadata({
      imports: [GioIconsModule],
    }),
  ],
} as Meta;

const classByNames = {
  Primary: 'gio-badge-primary',
  Neutral: 'gio-badge-neutral',
  Accent: 'gio-badge-accent',
  Success: 'gio-badge-success',
  Warning: 'gio-badge-warning',
  Error: 'gio-badge-error',
};

const simpleCases: string = Object.entries(classByNames).reduce((previousValue, [name, cssClass]) => {
  return `${previousValue}
      <div style='margin: 10px'>
        <span class="${cssClass}">${name}</span>
      </div>`;
}, '');

export const All: StoryObj = {
  render: () => ({
    template: `
      <h4>Text Only</h4>
      ${simpleCases}
     
      <h4>With Icons</h4>
      <div style='margin: 10px'>      
        <span class="gio-badge-error"><mat-icon svgIcon="gio:lock"></mat-icon></span>
      </div>
      
      <div style='margin: 10px'>      
        <span class="gio-badge-error"><mat-icon class="gio-left" svgIcon="gio:lock"></mat-icon>Lock</span>
      </div>

      <div style='margin: 10px'>
        <span class="gio-badge-error">Lock<mat-icon class="gio-right" svgIcon="gio:lock"></mat-icon></span>
      </div>  
            
      <div style='margin: 10px'>
        <span class="gio-badge-error">Lock<mat-icon class="gio-right">lock</mat-icon></span>
      </div>  
            
      <div style='margin: 10px'>
        <span class="gio-badge-neutral">1</span> <span class="gio-badge-neutral">2</span>
      </div> 
    `,
  }),
};
