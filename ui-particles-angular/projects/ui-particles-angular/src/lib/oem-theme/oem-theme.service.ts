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

export const OEM_THEME_ARG_TYPES = {
  menuBackground: {
    control: 'color',
  },
  menuActive: {
    control: 'color',
  },
  logo: {
    control: 'text',
  },
};

export const OEM_DEFAULT_LOGO =
  'data:image/png;base64,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';

export interface OemTheme {
  menuBackground: string;
  menuActive: string;
}

const computeStylesForStory = (args: Args): string => {
  return computeStyles({ menuBackground: args.menuBackground, menuActive: args.menuActive })
    .map(style => `${style.key}: ${style.value};`)
    .join(' ');
};

/**
 * Mimics how styles are injected in Console.
 * It is necessary in order to apply styles to gio-menu-selector drop-down overlay.
 * @param args
 * @param document
 */
const computeAndInjectStylesForStory = (args: Args, document: Document): void => {
  if (!document) {
    return;
  }

  resetStoryStyleInjection(args);

  const styles = computeStyles({
    menuBackground: args.menuBackground,
    menuActive: args.menuActive,
  });
  styles.forEach(style => {
    document.documentElement.style.setProperty(style.key, style.value);
  });
};

const resetStoryStyleInjection = (args: Args): void => {
  if (!args?.menuBackground) {
    document.documentElement.style.removeProperty('--gio-oem-palette--background');
    document.documentElement.style.removeProperty('--gio-oem-palette--background-contrast');
    document.documentElement.style.removeProperty('--gio-oem-palette--sub-menu');
  }

  if (!args?.menuActive) {
    document.documentElement.style.removeProperty('--gio-oem-palette--active');
    document.documentElement.style.removeProperty('--gio-oem-palette--active-contrast');
  }
};

const computeStyles = (theme: OemTheme): { key: string; value: string }[] => {
  const backgroundStyle = computeStyleAndContrastByPrefix('background', theme.menuBackground);
  const activeStyle = computeStyleAndContrastByPrefix('active', theme.menuActive);
  let subMenu: { key: string; value: string }[] = [];
  // If the menu background is defined, then define the sub-menu color
  if (theme.menuBackground) {
    subMenu = [{ key: `--gio-oem-palette--sub-menu`, value: `color-mix(in srgb, ${theme.menuBackground} 80%, black)` }];
  }
  return [...backgroundStyle, ...activeStyle, ...subMenu];
};

const computeStyleAndContrastByPrefix = (prefix: string, color: string): { key: string; value: string }[] => {
  if (!color) {
    return [];
  }
  const paletteColor = { key: `--gio-oem-palette--${prefix}`, value: color };
  const paletteColorContrast = { key: `--gio-oem-palette--${prefix}-contrast`, value: '#fff' };
  return [paletteColor, paletteColorContrast];
};
export { computeStyles, computeStylesForStory, computeAndInjectStylesForStory, resetStoryStyleInjection };