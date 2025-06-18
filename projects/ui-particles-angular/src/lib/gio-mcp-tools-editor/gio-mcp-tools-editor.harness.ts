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
import { ComponentHarness } from '@angular/cdk/testing';
import { GioMonacoEditorHarness } from '@gravitee/ui-particles-angular';

export class GioMcpToolsEditorHarness extends ComponentHarness {
  public static hostSelector = 'gio-mcp-tools-editor';

  protected locateMonacoEditor = this.locatorFor(GioMonacoEditorHarness);

  public async setValue(value: string): Promise<void> {
    const editor = await this.locateMonacoEditor();
    await editor.setValue(value);
  }

  public async getValue(): Promise<string> {
    const editor = await this.locateMonacoEditor();
    return editor.getValue();
  }
}
