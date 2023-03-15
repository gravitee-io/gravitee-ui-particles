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
import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'gio-password-eye-wrapper',
  template: `
    <ng-container #fieldComponent></ng-container>

    <ng-template #matSuffix>
      <span style="cursor: pointer" (click)="addonEyeClick($event)">
        <mat-icon [svgIcon]="hide ? 'gio:eye-empty' : 'gio:eye-off'"></mat-icon>
      </span>
    </ng-template>
  `,
})
export class GioPasswordEyeWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('matSuffix', { static: true })
  public matSuffix!: TemplateRef<unknown>;
  public hide = true;

  public ngAfterViewInit() {
    if (this.matSuffix) {
      this.props.suffix = this.matSuffix;
    }
  }

  public addonEyeClick($event: Event) {
    $event.stopPropagation();
    this.hide = !this.hide;

    this.props.type = this.hide ? 'password' : 'text';
  }
}

export function passwordEyeExtension(field: FormlyFieldConfig) {
  if (!field.props || (field.wrappers && field.wrappers.indexOf('gio-password-eye') !== -1)) {
    return;
  }

  if (field.props.type === 'password') {
    field.wrappers = [...(field.wrappers || []), 'gio-password-eye'];
  }
}
