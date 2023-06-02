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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { FlowVM } from '../../gio-policy-studio.model';
import {
  GioPolicyStudioFlowMessageFormDialogComponent,
  GioPolicyStudioFlowMessageFormDialogData,
  GioPolicyStudioFlowMessageFormDialogResult,
} from '../flow-message-form-dialog/gio-ps-flow-message-form-dialog.component';

@Component({
  selector: 'gio-ps-flow-details',
  templateUrl: './gio-ps-flow-details.component.html',
  styleUrls: ['./gio-ps-flow-details.component.scss'],
})
export class GioPolicyStudioDetailsComponent {
  @Input()
  public flow?: FlowVM = undefined;

  @Input()
  public entrypoints: string[] = [];

  @Output()
  public flowChange = new EventEmitter<FlowVM>();

  @Output()
  public deleteFlow = new EventEmitter<FlowVM>();

  constructor(private readonly matDialog: MatDialog) {}

  public onEditFlow(): void {
    this.matDialog
      .open<
        GioPolicyStudioFlowMessageFormDialogComponent,
        GioPolicyStudioFlowMessageFormDialogData,
        GioPolicyStudioFlowMessageFormDialogResult
      >(GioPolicyStudioFlowMessageFormDialogComponent, {
        data: {
          flow: this.flow,
          entrypoints: this.entrypoints,
        },
        role: 'alertdialog',
        id: 'gioPsFlowFormDialog',
      })
      .afterClosed()
      .pipe(
        tap(createdOrEdited => {
          if (!createdOrEdited) {
            return;
          }

          this.flowChange.emit(createdOrEdited);
        }),
      )
      .subscribe();
  }

  public onDeleteFlow(): void {
    this.deleteFlow.emit(this.flow);
  }
}
