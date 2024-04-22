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
import { Meta, moduleMetadata, componentWrapperDecorator, StoryObj } from '@storybook/angular';

import { GioAvatarComponent } from './gio-avatar.component';
import { GioAvatarModule } from './gio-avatar.module';

export default {
  title: 'Components / Avatar',
  component: GioAvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [GioAvatarModule],
    }),
  ],
  argTypes: {
    id: {
      type: { name: 'string', required: false },
    },
    src: {
      type: { name: 'string', required: false },
    },
    name: {
      type: { name: 'string', required: false },
    },
    size: {
      type: { name: 'number', required: false },
    },
    roundedBorder: {
      type: { name: 'boolean', required: false },
    },
  },
  render: ({ id, src, name, size, roundedBorder }) => ({
    template:
      "<gio-avatar style='width:150px; height: 150px' [id]='id' [src]='src' [name]='name' [size]='size' [roundedBorder]='roundedBorder'></gio-avatar>",
    props: { id, src, name, size, roundedBorder },
  }),
} as Meta;

export const IconDefault: StoryObj = {};

export const ImageDefault: StoryObj<GioAvatarComponent> = {};
ImageDefault.args = {
  src: 'https://i.pravatar.cc/500?u=a042581f4e29020504d',
};

export const ImageWithBadUrl: StoryObj<GioAvatarComponent> = {};
ImageWithBadUrl.args = {
  src: 'https://nope.nope',
};

export const IconWithParentDiv: StoryObj<GioAvatarComponent> = {};
IconWithParentDiv.args = {};
IconWithParentDiv.decorators = [componentWrapperDecorator(story => `<div style="width:300px; height:300px">${story}</div>`)];

export const ImageWithParentDiv: StoryObj<GioAvatarComponent> = {};
ImageWithParentDiv.args = {
  src: 'https://i.pravatar.cc/500?u=a042581f4e29020504d',
};
ImageWithParentDiv.decorators = [componentWrapperDecorator(story => `<div style="width:300px; height:300px">${story}</div>`)];

export const IconWithSize24Px: StoryObj<GioAvatarComponent> = {};
IconWithSize24Px.args = {
  size: 24,
};

export const ImageWithSize24Px: StoryObj<GioAvatarComponent> = {};
ImageWithSize24Px.args = {
  src: 'https://i.pravatar.cc/100?u=a042581f4e29020504d',
  size: 24,
};

export const IconWithRoundedBorder: StoryObj<GioAvatarComponent> = {};
IconWithRoundedBorder.args = {
  roundedBorder: true,
};

export const ImageWithRoundedBorder: StoryObj<GioAvatarComponent> = {};
ImageWithRoundedBorder.args = {
  src: 'https://i.pravatar.cc/100?u=a042581f4e29020504d',
  roundedBorder: true,
};
