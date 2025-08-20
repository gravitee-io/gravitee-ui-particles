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

import { GioClipboardModule } from '../../gio-clipboard/gio-clipboard.module';
import { GioPopoverComponent, PopoverTriggerDirective } from '../../gio-popover';

import { GioElPromptComponent } from './gio-el-prompt.component';

export default {
  title: 'Components / EL / Prompt',
  component: GioElPromptComponent,
  decorators: [
    moduleMetadata({
      imports: [GioPopoverComponent, PopoverTriggerDirective, GioElPromptComponent, GioClipboardModule],
      declarations: [],
    }),
  ],
  render: () => ({}),
} as Meta;

export const Prompt: StoryObj = {
  render: () => ({
    template: `
<gio-el-prompt/>
      `,
  }),
};

export const PromptInPopover: StoryObj = {
  render: () => ({
    template: `
    <button gioPopoverTrigger [gioPopoverTriggerFor]="aiPopover">
      Help me
    </button>

<gio-popover #aiPopover [closeOnBackdropClick]="true">
  <gio-el-prompt/>
</gio-popover>
      `,
  }),
};
