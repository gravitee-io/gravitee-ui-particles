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
import { Component, Inject, Injector, Type } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isObject, isString } from 'lodash';

export type GioConfirmDialogData = {
  title?: string;
  content?:
    | string
    | {
        componentOutlet: Type<unknown>;
        componentInputs?: Record<string, unknown>;
      };
  confirmButton?: string;
  cancelButton?: string;
};

@Component({
  selector: 'gio-confirm-dialog',
  templateUrl: './gio-confirm-dialog.component.html',
  styleUrls: ['./gio-confirm-dialog.component.scss'],
})
export class GioConfirmDialogComponent {
  public title: string;
  public content?: string;
  public contentComponentOutlet?: Type<unknown>;
  public contentComponentInputs?: Record<string, unknown>;
  public contentComponentInjector: Injector;
  public confirmButton: string;
  public cancelButton: string;

  constructor(
    public dialogRef: MatDialogRef<GioConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) confirmDialogData: GioConfirmDialogData,
    private readonly parentInjector: Injector,
  ) {
    this.title = confirmDialogData?.title ?? 'Are you sure?';
    this.contentComponentInjector = parentInjector;

    if (isString(confirmDialogData?.content)) {
      this.content = confirmDialogData?.content;
    } else if (isObject(confirmDialogData?.content)) {
      this.contentComponentOutlet = confirmDialogData?.content.componentOutlet;
      // TODO: When Angular 16 ready use ngComponentOutletInputs
      this.contentComponentInjector = Injector.create({
        providers: [{ provide: 'contentComponentInputs', useValue: confirmDialogData?.content.componentInputs }],
        parent: parentInjector,
      });
    }

    this.confirmButton = confirmDialogData?.confirmButton ?? 'Confirm';
    this.cancelButton = confirmDialogData?.cancelButton ?? 'Cancel';
  }
}
