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
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ShowcaseMaterialComponent } from './showcase-material.component';

// import { GioFormSlideToggleModule } from '../components/form-slide-toogle/gio-form-slide-toggle.module';

export default {
  title: 'Material showcase',
  decorators: [
    moduleMetadata({
      imports: [
        MatButtonModule,
        MatGridListModule,
        MatIconModule,
        MatDividerModule,
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatChipsModule,
        MatProgressBarModule,
        MatStepperModule,
        MatRadioModule,
        MatTooltipModule,
        MatTableModule,
        MatPaginatorModule,
        MatSlideToggleModule,

        // GioFormSlideToggleModule,
      ],
      declarations: [ShowcaseMaterialComponent],
    }),
  ],
  component: ShowcaseMaterialComponent,
} as Meta;

export const Common: StoryObj = {};
