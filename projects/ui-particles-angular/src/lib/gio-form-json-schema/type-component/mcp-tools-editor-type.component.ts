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
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material';

import { McpToolsEditorConfig } from '../../gio-mcp-tools-editor/gio-mcp-tools-editor.component';

export type GioMcpToolsEditorConfig = McpToolsEditorConfig;

type MclToolsEditorProps = FormlyFieldProps & {
  mcpToolsEditorConfig?: GioMcpToolsEditorConfig;
};

@Component({
  selector: 'gio-fjs-mcp-tools-editor-type',
  template: ` <gio-mcp-tools-editor [formControl]="formControl" /> `,
  styles: [
    `
      gio-mcp-tools-editor {
        min-height: 38px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioFjsMcpToolsEditorTypeComponent extends FieldType<FieldTypeConfig<MclToolsEditorProps>> implements OnInit {
  public config?: McpToolsEditorConfig;

  public ngOnInit(): void {
    this.config = this.props.mcpToolsEditorConfig;
  }
}
