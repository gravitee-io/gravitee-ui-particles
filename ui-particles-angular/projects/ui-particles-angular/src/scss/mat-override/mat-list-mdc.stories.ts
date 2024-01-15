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
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

export default {
  title: 'Material Override',
  decorators: [
    moduleMetadata({
      imports: [MatListModule, MatIconModule, MatCardModule],
    }),
  ],
  render: () => ({}),
} as Meta;

export const MatListMDC: StoryObj = {
  render: () => ({
    template: `
      <div>Material overrides for Mat List component:</div>
      <ul>
        <li>When a Mat List is inside a Mat Card then set a negative to balance default padding of the Mat Card</li>
        <li>Change background color of each list item on hover</li>
      </ul>
      <mat-card>
          <mat-list>
            <mat-list-item *ngFor="let element of elements">
              <mat-icon matListItemIcon>science</mat-icon>
              <div matListItemTitle><strong>{{element.symbol}}</strong> - {{element.name}}</div>
              <div matListItemLine>{{element.weight}}</div>
            </mat-list-item>
          </mat-list>
      </mat-card>`,
    props: {
      elements: ELEMENT_DATA,
    },
  }),
};
