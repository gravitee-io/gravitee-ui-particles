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

export interface OemTheme {
  menuBackground: string;
  menuActive: string;
}

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
export { computeStyles };
