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
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'gio-el-helper-wrapper',
  template: `
    <ng-container #fieldComponent></ng-container>
    <ng-template #matSuffix>
      <gio-el-editor-helper-toggle #ref [gioElEditorHelper]="ref" [control]="field.formControl" matIconSuffix></gio-el-editor-helper-toggle>
    </ng-template>
  `,
  standalone: false,
})
export class GioElHelperWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('matSuffix', { static: true })
  public matSuffix!: TemplateRef<unknown>;

  public elConfig = this.props.elConfig;

  public ngAfterViewInit(): void {
    if (this.matSuffix) {
      this.props.suffix = this.matSuffix;
    }
  }
}
