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
const gioMaterialColor: Record<string, string> = gioMaterialColorString
  .split(':export ')[1]
  .replace(/\{|\}/g, '')
  .split(';')
  .map(color => color.split(':'))
  .filter(color => !!color[1])
  .reduce((acc, [name, value]) => ({ ...acc, [`${name}`.trim()]: `${value}`.trim() }), {});

@Component({
  selector: 'gio-color',
  templateUrl: './showcase-color.component.html',
  styleUrls: ['./showcase-color.component.scss'],
})
export class ShowcaseColorComponent {
  public colorPalettes = Object.entries(gioMaterialColor).reduce((prev, [key, value]) => {
    const [paletteName, fullColorName] = key.split('__');
    const colorName = fullColorName.split('-contrast')[0];

    if (!prev[paletteName]) {
      prev[paletteName] = {};
    }

    if (fullColorName.endsWith('-contrast')) {
      prev[paletteName][colorName] = { ...prev[paletteName][colorName], contrast: value };
    } else {
      prev[paletteName][colorName] = { ...prev[paletteName][colorName], color: value };
    }

    return prev;
  }, {} as Record<string, Record<string, { color?: string; contrast?: string }>>);

  public matColorInScss = `
@use 'sass:map';
@use '@angular/material' as mat;
@use '@gravitee/ui-particles-angular' as gio;

$accent: map.get(gio.$mat-theme, accent);

.my-class {
  color: mat.get-color-from-palette($accent); // or mat.get-color-from-palette($accent, lighter);
  
}`;
}
