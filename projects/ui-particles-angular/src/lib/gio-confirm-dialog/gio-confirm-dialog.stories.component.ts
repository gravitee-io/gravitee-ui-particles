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
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject, Input, Type } from '@angular/core';
import { tap } from 'rxjs/operators';
import { action } from '@storybook/addon-actions';

import { GioConfirmDialogComponent, GioConfirmDialogData } from './gio-confirm-dialog.component';

@Component({
  selector: 'gio-confirm-dialog-story',
  template: `<button id="open-confirm-dialog" (click)="openConfirmDialog()">Open confirm dialog</button>`,
})
export class ConfirmDialogStoryComponent {
  @Input() public title?: string;
  @Input() public content?:
    | string
    | {
        componentOutlet: Type<unknown>;
        componentInputs?: Record<string, unknown>;
      };
  @Input() public confirmButton?: string;
  @Input() public cancelButton?: string;

  constructor(private readonly matDialog: MatDialog) {}

  public openConfirmDialog() {
    this.matDialog
      .open<GioConfirmDialogComponent, GioConfirmDialogData, boolean>(GioConfirmDialogComponent, {
        data: {
          title: this.title,
          content: this.content,
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
  selector: 'gio-confirm-content-dialog-story',
  template: ` <div>{{ title }}</div> `,
})
export class ConfirmContentDialogStoryComponent {
  public title: string;

  constructor(@Inject('contentComponentInputs') contentComponentInputs: { title: string }) {
    this.title = contentComponentInputs.title;
  }
}
