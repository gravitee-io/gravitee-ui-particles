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
import {
  GioBannerModule,
  GioFormJsonSchemaModule,
  GioFormSlideToggleModule,
  GioFormTagsInputModule,
  GioIconsModule,
  GioLoaderModule,
} from '@gravitee/ui-particles-angular';
import { GioAsciidoctorModule } from '@gravitee/ui-particles-angular/gio-asciidoctor';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

import { GioPolicyStudioFlowMessageFormDialogComponent } from './components/flow-form-dialog/flow-message-form-dialog/gio-ps-flow-message-form-dialog.component';
import { GioPolicyStudioDetailsComponent } from './components/flow-details/gio-ps-flow-details.component';
import { GioPolicyStudioFlowsMenuComponent } from './components/flows-menu/gio-ps-flows-menu.component';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';
import { GioPolicyStudioFlowProxyFormDialogComponent } from './components/flow-form-dialog/flow-proxy-form-dialog/gio-ps-flow-proxy-form-dialog.component';
import { GioPolicyStudioDetailsInfoBarComponent } from './components/flow-details-info-bar/gio-ps-flow-details-info-bar.component';
import { GioPolicyStudioDetailsPhaseStepComponent } from './components/flow-details-phase-step/gio-ps-flow-details-phase-step.component';
import { GioPolicyStudioDetailsPhaseComponent } from './components/flow-details-phase/gio-ps-flow-details-phase.component';
import { GioPolicyStudioFlowExecutionFormDialogComponent } from './components/flow-execution-form-dialog/gio-ps-flow-execution-form-dialog.component';
import { GioFilterConnectorsByModePipe } from './components/filter-pipe/gio-flter-connectors-by-mode.pipe';
import { GioPolicyStudioPoliciesCatalogDialogComponent } from './components/policies-catalog-dialog/gio-ps-policies-catalog-dialog.component';
import { GioPolicyStudioStepEditDialogComponent } from './components/step-edit-dialog/gio-ps-step-edit-dialog.component';
import { GioPolicyStudioStepFormComponent } from './components/step-form/gio-ps-step-form.component';

@NgModule({
  declarations: [
    GioPolicyStudioComponent,
    GioPolicyStudioFlowsMenuComponent,
    GioPolicyStudioDetailsComponent,
    GioPolicyStudioFlowExecutionFormDialogComponent,
    GioPolicyStudioFlowMessageFormDialogComponent,
    GioPolicyStudioFlowProxyFormDialogComponent,
    GioPolicyStudioDetailsInfoBarComponent,
    GioPolicyStudioDetailsPhaseComponent,
    GioPolicyStudioDetailsPhaseStepComponent,
    GioFilterConnectorsByModePipe,
    GioPolicyStudioPoliciesCatalogDialogComponent,
    GioPolicyStudioStepEditDialogComponent,
    GioPolicyStudioStepFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatTabsModule,
    MatMenuModule,
    MatChipsModule,

    GioIconsModule,
    GioFormSlideToggleModule,
    GioFormTagsInputModule,
    GioBannerModule,
    GioFormJsonSchemaModule,
    GioAsciidoctorModule,
    GioLoaderModule,
  ],
  exports: [GioPolicyStudioComponent],
})
export class GioPolicyStudioModule {}
