/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
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
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { GioMonacoEditorModule } from '@gravitee/ui-particles-angular';
import { AsyncPipe } from '@angular/common';

import { GioMcpToolsEditorComponent } from './gio-mcp-tools-editor.component';

export default {
  title: 'Components / MCP Tools Editor',
  component: GioMcpToolsEditorComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, AsyncPipe],
    }),
    applicationConfig({
      providers: [importProvidersFrom(GioMonacoEditorModule.forRoot({ theme: 'vs-dark', baseUrl: '.' }))],
    }),
  ],
  tags: ['autodocs'],
} as Meta<GioMcpToolsEditorComponent>;

export const Default: StoryObj<GioMcpToolsEditorComponent> = {
  render: _ => {
    const form = new FormGroup({
      mcpTools: new FormControl(''),
    });

    const formValue$ = form.valueChanges;

    return {
      template: `
      <form [formGroup]="form">
        <gio-mcp-tools-editor formControlName="mcpTools" />
        <div style="margin-top: 20px;">
          <strong>Form Value:</strong>
          @if (formValue$ | async; as formValue) {
            <pre>{{ formValue | json }}</pre>
          }
        </div>
      </form>
    `,
      props: {
        form,
        formValue$,
      },
    };
  },
};
