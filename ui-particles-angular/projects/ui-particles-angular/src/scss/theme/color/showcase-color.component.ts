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
import { Component } from '@angular/core';

import gioMaterialColorString from './gio-palettes.stories.scss';

/**
 * Hack to get the color string from the gio-palettes.stories.scss file
 */
const gioMaterialColor: { key: string; value: string }[] = gioMaterialColorString
  .split(':export ')[1]
  .replace(/\{|\}/g, '')
  .split(';')
  .map(color => color.split(':'))
  .filter(color => !!color[1])
  .reduce((acc, [key, value]) => {
    acc.push({
      key: `${key}`.trim(),
      value: `${value}`.trim(),
    });

    return acc;
  }, [] as { key: string; value: string }[]);

@Component({
  selector: 'gio-color',
  templateUrl: './showcase-color.component.html',
  styleUrls: ['./showcase-color.component.scss'],
})
export class ShowcaseColorComponent {
  public colorPalettes = gioMaterialColor.reduce((prev, { key, value }) => {
    const [paletteName, fullColorName] = key.split('__');
    const colorName = fullColorName.split('-contrast')[0];

    let palette = prev.find(p => p.name === paletteName);
    if (!palette) {
      palette = { name: paletteName, colors: [] };
      prev.push(palette);
    }

    let color = palette.colors.find(p => p.name === colorName);
    if (!color) {
      color = { name: colorName };
      palette.colors.push(color);
    }

    if (fullColorName.endsWith('-contrast')) {
      color.contrast = value;
    } else {
      color.color = value;
    }

    return prev;
  }, [] as { name: string; colors: { name: string; color?: string; contrast?: string }[] }[]);
}
