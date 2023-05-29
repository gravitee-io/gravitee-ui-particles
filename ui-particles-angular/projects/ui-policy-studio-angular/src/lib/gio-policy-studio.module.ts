/*
 * Copyright (C) 2022 The Gravitee team (http://gravitee.io)
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
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GioIconsModule } from '@gravitee/ui-particles-angular';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { GioPolicyStudioFlowFormDialogComponent } from './components/flow-form-dialog/gio-ps-flow-form-dialog.component';
import { GioPolicyStudioDetailsComponent } from './components/flow-details/gio-ps-flow-details.component';
import { GioPolicyStudioFlowsMenuComponent } from './components/flows-menu/gio-ps-flows-menu.component';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';

@NgModule({
  declarations: [
    GioPolicyStudioComponent,
    GioPolicyStudioFlowsMenuComponent,
    GioPolicyStudioDetailsComponent,
    GioPolicyStudioFlowFormDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,

    GioIconsModule,
  ],
  exports: [GioPolicyStudioComponent],
})
export class GioPolicyStudioModule {}
