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
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gio-color',
  templateUrl: './showcase-color.component.html',
  styleUrls: ['./showcase-color.component.scss', './gio-palettes.stories.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowcaseColorComponent {
  public colorPalettes: { name: string; colors: { name: string; color?: string; contrast?: string }[] }[] = [];

  constructor() {
    this.colorPalettes = [].slice
      .call(document.styleSheets)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((styleSheet: any) => [].slice.call(styleSheet.cssRules))
      .flat()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((cssRule: any) => cssRule.selectorText === ':root')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((cssRule: any) => cssRule.cssText.split('{')[1].split('}')[0].trim().split(';'))
      .flat()
      .filter(text => text !== '')
      .map(text => text.split(':'))
      .map(parts => parts[0].trim() + ':  ' + parts[1].trim())
      .filter(text => text.startsWith('--gp'))
      .reduce(
        (acc, variable) => {
          const [key, value] = variable.split(':');

          acc.push({
            key: `${key.replace('--gp--', '')}`.trim(),
            value: `${value}`.trim(),
          });

          return acc;
        },
        [] as { key: string; value: string }[],
      )

      .reduce(
        (prev, { key, value }) => {
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
        },
        [] as { name: string; colors: { name: string; color?: string; contrast?: string }[] }[],
      );
  }
}
