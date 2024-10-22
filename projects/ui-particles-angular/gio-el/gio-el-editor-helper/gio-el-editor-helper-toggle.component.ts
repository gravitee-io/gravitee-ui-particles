/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GIO_DIALOG_WIDTH, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { isEmpty, isNil } from 'lodash';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import {
  GioElConditionBuilderDialogComponent,
  GioElConditionBuilderDialogData,
  GioElConditionBuilderDialogResult,
} from '../gio-el-condition-builder-dialog/gio-el-condition-builder-dialog.component';
import { GioElService } from '../gio-el.service';

@Component({
  selector: 'gio-el-editor-helper-toggle',
  imports: [MatButtonModule, GioIconsModule, GioElConditionBuilderDialogComponent, MatDialogModule],
  templateUrl: './gio-el-editor-helper-toggle.component.html',
  styleUrl: './gio-el-editor-helper-toggle.component.scss',
})
export class GioElEditorHelperToggleComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly matDialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly gioElService = inject(GioElService, { optional: true });

  protected disabled = false;

  public elValue$ = new Subject<string>();

  public open() {
    return this.matDialog
      .open<GioElConditionBuilderDialogComponent, GioElConditionBuilderDialogData, GioElConditionBuilderDialogResult>(
        GioElConditionBuilderDialogComponent,
        {
          role: 'dialog',
          id: 'gio-el-editor-dialog',
          width: GIO_DIALOG_WIDTH.LARGE,
          minWidth: 800,
          data: {
            conditionsModel$: this.gioElService?.conditionsModel$.pipe(filter(cm => !isNil(cm))),
          },
        },
      )
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (!isNil(result) && !isEmpty(result)) {
          this.elValue$.next(result);
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  public setDisabledState(disabled: boolean) {
    this.matDialog.closeAll();
    this.disabled = disabled;
  }
}
