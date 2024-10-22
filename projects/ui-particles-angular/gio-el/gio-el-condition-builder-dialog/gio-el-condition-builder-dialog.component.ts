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
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConditionsModel } from '../models/ConditionsModel';
import { GioElConditionBuilderComponent } from '../gio-el-condition-builder/gio-el-condition-builder.component';

export interface GioElConditionBuilderDialogData {
  conditionsModel$?: Observable<ConditionsModel>;
}

export type GioElConditionBuilderDialogResult = string;

@Component({
  selector: 'gio-el-condition-builder-dialog',
  templateUrl: './gio-el-condition-builder-dialog.component.html',
  styleUrls: ['./gio-el-condition-builder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, GioElConditionBuilderComponent, AsyncPipe, ReactiveFormsModule],
})
export class GioElConditionBuilderDialogComponent {
  public conditionsModel$?: Observable<ConditionsModel>;
  public elValue = '';
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: GioElConditionBuilderDialogData,
    public dialogRef: MatDialogRef<GioElConditionBuilderDialogComponent, GioElConditionBuilderDialogResult>,
  ) {
    this.conditionsModel$ = data.conditionsModel$;
  }
}
