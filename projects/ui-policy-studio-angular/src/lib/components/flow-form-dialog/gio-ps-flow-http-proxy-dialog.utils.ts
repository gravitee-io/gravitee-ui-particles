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
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { GIO_DIALOG_WIDTH } from '@gravitee/ui-particles-angular';

import {
  GioPolicyStudioFlowProxyFormDialogComponent,
  GioPolicyStudioFlowProxyFormDialogData,
} from './flow-proxy-form-dialog/gio-ps-flow-proxy-form-dialog.component';
import {
  GioPolicyStudioFlowLlmFormDialogComponent,
  GioPolicyStudioFlowLlmFormDialogData,
} from './flow-llm-form-dialog/gio-ps-flow-llm-form-dialog.component';
import {
  GioPolicyStudioFlowA2aFormDialogComponent,
  GioPolicyStudioFlowA2aFormDialogData,
} from './flow-a2a-form-dialog/gio-ps-flow-a2a-form-dialog.component';
import { GioPolicyStudioFlowFormDialogResult } from './gio-ps-flow-form-dialog-result.model';

type HttpProxyDialogComponent =
  | typeof GioPolicyStudioFlowProxyFormDialogComponent
  | typeof GioPolicyStudioFlowLlmFormDialogComponent
  | typeof GioPolicyStudioFlowA2aFormDialogComponent;

type DataOf<C extends HttpProxyDialogComponent> = C extends typeof GioPolicyStudioFlowProxyFormDialogComponent
  ? GioPolicyStudioFlowProxyFormDialogData
  : C extends typeof GioPolicyStudioFlowLlmFormDialogComponent
    ? GioPolicyStudioFlowLlmFormDialogData
    : C extends typeof GioPolicyStudioFlowA2aFormDialogComponent
      ? GioPolicyStudioFlowA2aFormDialogData
      : never;

export function openHttpProxyDialog<C extends HttpProxyDialogComponent>(matDialog: MatDialog, component: C, data: DataOf<C>, id: string) {
  return matDialog
    .open<InstanceType<C>, DataOf<C>, GioPolicyStudioFlowFormDialogResult>(component as ComponentType<InstanceType<C>>, {
      data,
      role: 'alertdialog',
      id,
      width: GIO_DIALOG_WIDTH.MEDIUM,
    })
    .afterClosed();
}
