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
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import type Monaco from 'monaco-editor';

import { GioMonacoEditorService } from './gio-monaco-editor.service';

@Injectable()
export class GioLanguageJsonService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private monaco?: typeof Monaco;

  constructor(private readonly codeEditorService: GioMonacoEditorService) {
    codeEditorService.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe(event => {
      this.setup(event.monaco);
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public setup(monaco: typeof Monaco): void {
    if (!monaco) {
      throw new Error('Monaco is not loaded');
    }
    this.monaco = monaco;
    const defaults = monaco.languages.json.jsonDefaults;

    defaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
    });
  }

  public addSchemas(id: string, definitions: Array<{ uri: string; schema: unknown }> = []) {
    if (!this.monaco) {
      throw new Error('Monaco is not loaded');
    }

    const defaults = this.monaco.languages.json.jsonDefaults;
    const options = defaults.diagnosticsOptions;

    let schemas: Monaco.languages.json.DiagnosticsOptions['schemas'] = definitions.map(({ uri, schema }) => ({
      uri,
      schema,
      fileMatch: [id || '*.json'],
    }));

    if (options && options.schemas && options.schemas.length > 0) {
      schemas = [...options.schemas, ...schemas];
    }

    defaults.setDiagnosticsOptions({
      ...options,
      schemas: schemas,
    });
  }
}
