/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { Component, Input, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { action } from '@storybook/addon-actions';

import { GioConfirmAndValidateDialogComponent, GioConfirmAndValidateDialogData } from './gio-confirm-and-validate-dialog.component';

@Component({
  selector: 'gio-confirm-and-validate-dialog-story',
  template: `<button id="open-confirm-dialog" (click)="openConfirmDialog()">Open confirm dialog</button>`,
  standalone: false,
})
export class ConfirmAndValidateDialogStoryComponent {
  @Input() public title?: string;
  @Input() public warning?: string;
  @Input() public content?:
    | string
    | {
        componentOutlet: Type<unknown>;
        componentInputs?: Record<string, unknown>;
      };
  @Input() public validationMessage?: string;
  @Input() public validationValue?: string;
  @Input() public confirmButton?: string;
  @Input() public cancelButton?: string;

  constructor(private readonly matDialog: MatDialog) {}

  public openConfirmDialog() {
    this.matDialog
      .open<GioConfirmAndValidateDialogComponent, GioConfirmAndValidateDialogData, boolean>(GioConfirmAndValidateDialogComponent, {
        data: {
          title: this.title,
          warning: this.warning,
          content: this.content,
          validationMessage: this.validationMessage,
          validationValue: this.validationValue,
          confirmButton: this.confirmButton,
          cancelButton: this.cancelButton,
        },
        role: 'alertdialog',
        id: 'confirmDialog',
      })
      .afterClosed()
      .pipe(
        tap(confirmed => {
          action('confirmed?')(confirmed);
        }),
      )
      .subscribe();
  }
}

@Component({
  selector: 'gio-confirm-and-validate-content-dialog-story',
  template: ` <div>{{ title }}</div> `,
  standalone: false,
})
export class ConfirmAndValidateContentDialogStoryComponent {
  @Input()
  public title?: string;
}
