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
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { toLower } from 'lodash';

export type GioConfirmAndValidateDialogData = {
  title?: string;
  warning?: string;
  content?: string;
  validationMessage?: string;
  validationValue?: string;
  confirmButton?: string;
  cancelButton?: string;
};

@Component({
  selector: 'gio-confirm-and-validate-dialog',
  templateUrl: './gio-confirm-and-validate-dialog.component.html',
  styleUrls: ['./gio-confirm-and-validate-dialog.component.scss'],
})
export class GioConfirmAndValidateDialogComponent {
  public title: string;
  public warning?: string;
  public content?: string;
  public validationMessage?: string;
  public validationValue: string;
  public confirmButton: string;
  public cancelButton: string;

  public confirmValue?: string;
  public isValid = false;

  constructor(
    public dialogRef: MatDialogRef<GioConfirmAndValidateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) confirmDialogData: GioConfirmAndValidateDialogData,
  ) {
    this.title = confirmDialogData?.title ?? 'Are you sure?';
    this.warning = confirmDialogData?.warning;
    this.content = confirmDialogData?.content;
    this.validationMessage = extendValidationMessage(
      confirmDialogData?.validationMessage ?? 'Please, type <code>confirm</code> to confirm.',
    );
    this.validationValue = confirmDialogData?.validationValue ?? 'confirm';
    this.confirmButton = confirmDialogData?.confirmButton ?? 'Confirm';
    this.cancelButton = confirmDialogData?.cancelButton ?? 'Cancel';
  }

  public onConfirmChange(confirmValue: string): void {
    this.isValid = toLower(confirmValue) === toLower(this.validationValue);
  }
}

const extendValidationMessage = (validationMessage: string) => {
  return validationMessage.replace('<code>', '<code class="gio-badge-warning">');
};
