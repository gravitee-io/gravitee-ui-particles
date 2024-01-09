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
import { Directive, Input, ViewChild } from '@angular/core';
import { MatLegacyTooltip as MatTooltip } from '@angular/material/legacy-tooltip';
import { Clipboard } from '@angular/cdk/clipboard';

@Directive()
export abstract class GioClipboardComponent {
  public label = 'Copy to clipboard';
  public tooltipHideDelay = 0;
  public clicked = false;

  @ViewChild('tooltip') public tooltip!: MatTooltip;

  @Input()
  public contentToCopy = '';
  @Input()
  public alwaysVisible = false;

  @Input()
  public tabIndex = undefined;

  constructor(private clipboard: Clipboard) {}

  public onCopied(success: boolean, tooltip: MatTooltip) {
    tooltip.message = success ? 'Copied!' : 'Failed to copy!';
    tooltip.hideDelay = 2000;
    tooltip.show();
    this.clicked = true;

    setTimeout(() => {
      tooltip.hide();
    }, 2000);

    setTimeout(() => {
      this.clicked = false;
      tooltip.message = this.label;
      tooltip.hideDelay = this.tooltipHideDelay;
    }, 2500);
  }

  public onKeyupSpace() {
    this.clipboard.copy(this.contentToCopy);
    if (this.tooltip) {
      this.onCopied(true, this.tooltip);
    }
  }
}
