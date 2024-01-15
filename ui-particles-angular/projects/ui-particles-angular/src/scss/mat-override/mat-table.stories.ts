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
import { UntypedFormControl, FormsModule } from '@angular/forms';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule } from '@angular/material/legacy-select';

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
      imports: [FormsModule, MatLegacyTableModule, MatLegacyFormFieldModule, MatLegacyInputModule, MatLegacySelectModule],
    }),
  ],
  render: () => ({}),
  parameters: {
    chromatic: { delay: 500 },
  },
} as Meta;

export const MatTableRowsHover: StoryObj = {
  render: () => ({
    template: `
      <p>
      Change background color of table rows on hover
      </p>
      
       <table
          mat-table
          [dataSource]="dataSource"
          matSort
          style="width: 100%"
        >
          <!-- Position Column -->
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> No. </th>
            <td mat-cell *matCellDef="let element"> {{element.position}} </td>
          </ng-container>
        
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>
        
          <!-- Weight Column -->
          <ng-container matColumnDef="weight">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Weight </th>
            <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
          </ng-container>
        
          <!-- Symbol Column -->
          <ng-container matColumnDef="symbol">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Symbol </th>
            <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">No Data</td>
          </tr>
        </table>
    `,
    props: {
      displayedColumns: ['position', 'name', 'weight', 'symbol'],
      dataSource: ELEMENT_DATA,
    },
  }),
};

export const MatTableWithMatFormField: StoryObj = {
  render: () => ({
    template: `<p>Keep or remove padding-bottom for mat-form-field in table td</p>

    <table mat-table [dataSource]="dataSource" matSort style="width: 100%">
      <!-- Position Column -->
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
        <td mat-cell *matCellDef="let element">{{element.position}}</td>
      </ng-container>
    
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let element">
          <mat-form-field [appearance]="element.position === 4 ? 'standard': 'outline'">
            <mat-label *ngIf="element.position === 1">Name</mat-label>
            <input
              matInput
              [ngModel]="element.name"
              [minlength]="element.position === 3 ? 42 : 1"
              [errorStateMatcher]="errorStateMatcher"
            />
            <mat-hint *ngIf="element.position === 2"
              >Keep padding for hint</mat-hint
            >
            <mat-error *ngIf="element.position === 3"
              >Keep padding for error</mat-error
            >
          </mat-form-field>
        </td>
      </ng-container>
    
      <!-- Weight Column -->
      <ng-container matColumnDef="weight">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Weight</th>
        <td mat-cell *matCellDef="let element">{{element.weight}}</td>
      </ng-container>
    
      <!-- Symbol Column -->
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Symbol</th>
        <td mat-cell *matCellDef="let element">
          <mat-form-field [appearance]="element.position === 4 ? 'standard': 'outline'">
            <mat-label *ngIf="element.position === 1">Name</mat-label>
            <mat-select
              [ngModel]="element.position === 3 ? null : element.symbol"
              [required]="element.position === 3 ? 42 : 1"
              [errorStateMatcher]="errorStateMatcher"
            >
              <mat-option value="H">H</mat-option>
              <mat-option value="He">He</mat-option>
              <mat-option value="Li">Li</mat-option>
              <mat-option value="Be">Be</mat-option>
              <mat-option value="B">B</mat-option>
              <mat-option value="C">C</mat-option>
              <mat-option value="N">N</mat-option>
            </mat-select>
            <mat-hint *ngIf="element.position === 2"
              >Keep padding for hint</mat-hint
            >
            <mat-error *ngIf="element.position === 3"
              >Keep padding for error</mat-error
            >
          </mat-form-field>
        </td>
      </ng-container>
    
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" [attr.colspan]="displayedColumns.length">No Data</td>
      </tr>
    </table>
    `,
    props: {
      displayedColumns: ['position', 'name', 'weight', 'symbol'],
      dataSource: ELEMENT_DATA,
      errorStateMatcher: {
        // Invalid form immediately if invalid
        isErrorState(control: UntypedFormControl | null): boolean {
          return !!(control && control.invalid);
        },
      },
    },
  }),
};
