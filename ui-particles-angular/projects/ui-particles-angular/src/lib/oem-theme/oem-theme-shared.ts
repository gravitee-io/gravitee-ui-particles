/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { Args } from '@storybook/angular';

const COLOR_ARG_TYPES = {
  darkMode: {
    control: 'boolean',
  },
  menuBackground: {
    control: 'color',
  },
  menuActive: {
    control: 'color',
  },
};

const computeStyle = (args: Args) => {
  const darkMode = args.darkMode ?? true;
  const backgroundStyle = computeStyleAndContrastByPrefix('background', args.menuBackground, darkMode);
  const activeStyle = computeStyleAndContrastByPrefix('active', args.menuActive, darkMode);
  let subMenu = '';
  // If the menu background is defined, then define the sub-menu color
  if (args.menuBackground) {
    subMenu = `--gio-oem-palette--sub-menu:color-mix(in srgb, ${args.menuBackground} 80%, black); `;
  }
  return backgroundStyle + activeStyle + subMenu;
};

const computeStyleAndContrastByPrefix = (prefix: string, color: string, darkMode = true) => {
  if (!color) {
    return '';
  }
  const paletteColor = `--gio-oem-palette--${prefix}:${color}; `;
  const paletteColorContrast = `--gio-oem-palette--${prefix}-contrast:${darkMode ? '#fff' : '#100c27'}; `;
  return paletteColor + paletteColorContrast;
};

export { computeStyle, COLOR_ARG_TYPES };
