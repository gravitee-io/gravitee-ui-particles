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
import { Component } from '@angular/core';

import { GioClipboardComponent } from './gio-clipboard.base.component';

@Component({
  selector: 'gio-clipboard-copy-icon',
  styleUrls: ['./gio-clipboard-copy-icon.component.scss'],
  template: `
    <button
      #tooltip="matTooltip"
      type="button"
      class="btn"
      [attr.aria-label]="label"
      [class.clicked]="clicked"
      [cdkCopyToClipboard]="contentToCopy"
      (cdkCopyToClipboardCopied)="onCopied($event, tooltip)"
      matRipple
      [matRippleCentered]="true"
      [matRippleUnbounded]="true"
      [matTooltip]="label"
      [matTooltipPosition]="'after'"
      (keyup.Space)="onKeyupSpace()"
    >
      <mat-icon>{{ clicked ? 'check' : 'content_copy' }}</mat-icon>
    </button>
  `,
})
export class GioClipboardCopyIconComponent extends GioClipboardComponent {}
