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
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, Subject } from 'rxjs';
import { isEmpty, isNil } from 'lodash';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';

import {
  GioElConditionBuilderDialogComponent,
  GioElConditionBuilderDialogData,
  GioElConditionBuilderDialogResult,
} from '../gio-el-condition-builder-dialog/gio-el-condition-builder-dialog.component';
import { GioElService } from '../gio-el.service';
import { GioElIaAssistantComponent } from '../gio-el-ia-assistant/gio-el-ia-assistant.component';
import { GioIconsModule } from '../../gio-icons/gio-icons.module';
import { GIO_DIALOG_WIDTH } from '../../gio-dialog/gio-dialog.constant';
import { PopoverTriggerDirective } from '../../gio-popover/gio-popover/gio-popover-trigger.directive';
import { GioPopoverComponent } from '../../gio-popover/gio-popover/gio-popover.component';

@Component({
  selector: 'gio-el-editor-helper-toggle',
  imports: [
    MatButtonModule,
    GioIconsModule,
    MatDialogModule,
    MatMenuModule,
    PopoverTriggerDirective,
    GioPopoverComponent,
    GioElIaAssistantComponent,
  ],
  templateUrl: './gio-el-editor-helper-toggle.component.html',
  styleUrl: './gio-el-editor-helper-toggle.component.scss',
})
export class GioElEditorHelperToggleComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly matDialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly gioElService = inject(GioElService, { optional: true });

  public readonly elementRef = inject(ElementRef);

  protected disabled = false;

  @Input()
  public enableConditionBuilder = false;

  @Input()
  public enableELAIAssistant = true;

  public scopes = input<string[]>();

  public elValue$ = new Subject<string>();

  public elContextResourceRef = rxResource<string, string[]>({
    request: () => this.scopes() ?? [],
    loader: ({ request }) =>
      this.gioElService?.elProperties$(request).pipe(
        map(elProperties =>
          // TODO: Absolutely not finished here. We need ton find the contract we want to use to describle a el Context.
          // This contract should be allow APIM to configure EL context for autocompletion, IA assistant, Condition builder, ext...
          // And for AI assistant, we need to convert it to something understandable by the AI.
          JSON.stringify(elProperties, null, 2),
        ),
      ) ?? EMPTY,
  });
  private conditionBuilderDialogRef?: MatDialogRef<GioElConditionBuilderDialogComponent, GioElConditionBuilderDialogResult>;

  public setDisabledState(disabled: boolean) {
    this.conditionBuilderDialogRef?.close();
    this.disabled = disabled;
  }

  public openConditionBuilder() {
    this.conditionBuilderDialogRef = this.matDialog.open<
      GioElConditionBuilderDialogComponent,
      GioElConditionBuilderDialogData,
      GioElConditionBuilderDialogResult
    >(GioElConditionBuilderDialogComponent, {
      role: 'dialog',
      id: 'gio-el-editor-dialog',
      width: GIO_DIALOG_WIDTH.LARGE,
      minWidth: 800,
      data: {
        elProperties$: this.gioElService?.elProperties$(['ALL']).pipe(filter(cm => !isNil(cm))),
      },
    });
    return this.conditionBuilderDialogRef
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

  public openELAIAssistant() {}

  public onTyEl(el: string) {
    this.elValue$.next(el);
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  public onTryElInSandbox() {
    // TODO : This is a fake URL for the EL sandbox.
    // THe gol if we go this way is to have a dedicated EL sandbox embeded in APIM UI. and maybe use localStorage to store the EL properties with a uuid or something like that.
    const url =
      'https://apim-tools-el-sandbox.team-apim.gravitee.dev/?elExpression=%7B%23node.version%7D&elEvalAs=STRING&context=eJzFWNtu2zgQfc9XCH4sSkd3SnkzkjYJ0GaDRAUWaPpAiqNYXVnUSlTgNMi%2Fd6jYrmzJVty4uzZgZA7JM0POhcM8HRnGqIR%2Fa6jU6MT4iqJhPDW%2FOJCkkAmER6kYvV%2BC6rEAjVWqTPP7X%2FgDy%2BpmIGSJaSWcEc91Q%2BL6piAcAcKZBgKUE3vUrHp%2Bv0WfKllesVilMr%2F8j1XXZbqHwuNEzo9zNoNjVc8HmAumpn%2BQ%2BjJP5D70e1JXXe5PKQZNh%2Fnrt92EscwVzNX1b5zGoKklm%2FXY%2BbnOVPqZFRu00brO4WO43uDPGIdMD%2Bq9GJuj%2B2nv7HhpAkLaU01WLJ2Fdu62dgpMQNljzIVSxcXmYI%2FKSRxDoSvC6N3xu9VMHPibnJfsIVUA5OalbJBLsaoci0mO7TquRSmhroNp6CSMBAgQSjVgogx0tFrwrZ8%2B%2BlUDDqriSwUlmdxD3mzvWlZqxvKbOlcp5gMdu87YbG%2F4lMVTIKcYtKVsnJ1LEmvsla6YgZpK0RPR5x%2BirfG%2Fm7JC7RgRr0%2BeAb6pbOfxW9keMLbQZ4cj1I6pFJsVXcq8nnEou5SWbwe%2Bb%2Fmm%2FuxmL2EmFUyEKKHqSZitRpsn7a81sIdMxiz700qaypof0JXfK5mfbiPdXtIk%2Fw6xGgriKutyvmrlfJa91aijRUnAZBZwqL7HtLkNnuUSsAOhm4%2BYaIBYrgYAZU4Pnjvu2B%2F75PZqcn178Vc0lEmQsx3xMeCwKSsFTovY%2FcF6gR8y317HNlwFuShkmu9qU88gYXjbGhdRdG0UpZw%2F7nGS3cUnAyfSXWHcl7LuqVN7KH2hONncPRaOQubVrmDFGqnqHtdsK5L2UGl8cxfRus1PsxQTFi9y%2FE1RQ9m50JPE5sIXJAHOiWvprh0B4gsNcJRtv%2F9Cj3QTEk1utGWW7bhb2pXd%2FYTvmEFiU4%2BYCTjEDTCDAwQI9TRgoUytwZZlrSPai3KgiRiq7P9fGT9kMV68DHaEOFO4X14r6AnK05fVk%2BWUrvb14GRFkaUx0%2FHQeIsGEAbCJ57wgbhmEhANEOFrwELZDtqRVes2Mm2soi4Evpt4hJpegIXfCwlDgCSeBjjK8dpSVqRjAUUmH0EQpvdrUQx403FpYDtea%2BbiREjzdFy9gloTiow11ttAIUzQhNCiPnEFtwhHAE3QgI%2Byydvr4iYd17Jx723I8p7l6Y%2FVCZ59%2BDj58ilqT4H8IS1lPls02z0z9Fks3zcf5XxjqPF57HmhzTgJLI5bM2OXhAgQxjVAUQ7pxjLyDzzqpU4SUzvw8Cx8Xy9l%2BEhAgHiWBijK5mYbvwrGF%2B0HaQx8M%2BQOxzNNeODiwWI10ADxAg3EKAdD%2F5Vojuj1GvVJHrrTsMYmvox2s%2BINVkCp0r78fNMTGB1qNWbrIavtbhyxVyP2Nm9WNa%2FiMi0WsXoQtwaOHfrcpMS0bEpcjk9QhgAxqQa0vLyxtp5XqwZd7efhSVEY5yUMNXya5vWkt9Hk6mxyczbAik9aJphiv%2BHjDbeItLmPWakjZunwHrbe26M91IoWXZfWgyeRUi%2BLpmDoP1vBw1lT%2BZ7udBjdjU7uXtjuRs%2FdQHo%2Bev4JQXEoSA%3D%3D';

    //navigate to the EL sandbox with the elProperties as query params
    window.open(`${url}`, '_blank');
  }
}
