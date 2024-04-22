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
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { editor, languages, Position } from 'monaco-editor';

import CompletionItem = languages.CompletionItem;

import type Monaco from 'monaco-editor';

import { getKeywords, getSuggestions, IndexableSuggestion, JSONSchema, PropertySuggestion } from '../models/JSONSchemaAutoComplete';

import { GioMonacoEditorService } from './gio-monaco-editor.service';

export const SPEL_LANG_ID = 'spel';

function getPropertyPath(model: editor.ITextModel, position: Position): string[] {
  const line = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: 0,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  // get last valid el expression (most right hand side of the current line)
  const lastExpression = line.split('#').filter(Boolean).pop();
  if (!lastExpression) {
    return [];
  }

  // get expression left hand side
  const lastExpressionLHS = lastExpression.split(/\s+/).filter(Boolean).shift();
  if (!lastExpressionLHS) {
    return [];
  }

  return (
    lastExpressionLHS
      // remove special characters
      .replace(/\W/g, ' ')
      // normalize spaces
      .replace(/\s+/g, ' ')
      .trim()
      .split(/\s/)
  );
}

@Injectable({
  providedIn: 'root',
})
export class GioLanguageElService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  private context: { schema: JSONSchema; keywords: string[] } = {
    schema: {},
    keywords: [],
  };

  private schema: JSONSchema = {};
  private keywords: string[] = [];

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  constructor(codeEditorService: GioMonacoEditorService) {
    codeEditorService.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe(event => {
      this.setup(event.monaco);
    });
  }

  public setup(monaco: typeof Monaco): void {
    if (!monaco) {
      throw new Error('Monaco is not loaded');
    }

    monaco.languages.register({ id: SPEL_LANG_ID });

    monaco.languages.setLanguageConfiguration(SPEL_LANG_ID, {
      brackets: [
        ['{', '}'],
        ['(', ')'],
        ['[', ']'],
      ],
      autoClosingPairs: [
        {
          open: "'",
          close: "'",
        },
        {
          open: '"',
          close: '"',
        },
        {
          open: '(',
          close: ')',
        },
        {
          open: '{',
          close: '}',
        },
        {
          open: '[',
          close: ']',
        },
      ],
      surroundingPairs: [
        {
          open: "'",
          close: "'",
        },
        {
          open: '"',
          close: '"',
        },
        {
          open: '(',
          close: ')',
        },
        {
          open: '{',
          close: '}',
        },
      ],
    });

    const schema = this.schema;
    const keywords = this.keywords;

    monaco.languages.setMonarchTokensProvider(SPEL_LANG_ID, {
      keywords,
      operators: ['=', '>', '<', '!', '?', ':', '==', '<=', '>=', '!=', '&&', '||', '++', '--', '+', '-', '*', '/', '^', '%'],

      tokenizer: {
        root: [
          [
            /@?[a-zA-Z][\w$]*/,
            {
              cases: {
                '@keywords': 'keyword',
                '@operators': 'operator',
                '@default': 'variable',
              },
            },
          ],

          [/["'].*?["']/, 'string'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],

          [/#/, 'number'],

          // eslint-disable-next-line no-useless-escape
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],
        ],
      },
    });

    monaco.languages.registerCompletionItemProvider(SPEL_LANG_ID, {
      provideCompletionItems(
        model: editor.ITextModel,
        position: Position,
        context: languages.CompletionContext,
      ): languages.ProviderResult<languages.CompletionList> {
        const word = model.getWordUntilPosition(position);

        const mapPropertyKind = (propertySuggestion: PropertySuggestion): number => {
          switch (propertySuggestion.type) {
            case 'object':
              return monaco.languages.CompletionItemKind.Struct;
            case 'string':
              return monaco.languages.CompletionItemKind.Text;
            default:
              return monaco.languages.CompletionItemKind.Field;
          }
        };

        const mapPropertySuggestion = (propertySuggestion: PropertySuggestion): CompletionItem => {
          return {
            label: propertySuggestion.name,
            kind: mapPropertyKind(propertySuggestion),
            insertText: propertySuggestion.name,
            detail: propertySuggestion.type,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          };
        };

        const mapIndexableSuggestions = (suggestion: IndexableSuggestion): CompletionItem[] => {
          return (
            suggestion.enum?.map(name => {
              return {
                label: name,
                kind: monaco.languages.CompletionItemKind.Enum,
                insertText: `"${name}"`,
                detail: 'enum',
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn,
                },
              };
            }) || []
          );
        };

        if (context.triggerCharacter === '#') {
          return {
            suggestions: getSuggestions(schema, ['.']).properties.map(mapPropertySuggestion).sort(),
          };
        }

        if (context.triggerCharacter === '[') {
          const path = getPropertyPath(model, position);
          const suggestions = getSuggestions(schema, path);
          if (suggestions.additionalProperties && suggestions.additionalProperties.enum) {
            return {
              suggestions: mapIndexableSuggestions(suggestions.additionalProperties),
            };
          }
        }

        if (context.triggerCharacter === '.') {
          const path = getPropertyPath(model, position);
          const suggestions = getSuggestions(schema, path).properties.map(mapPropertySuggestion).sort();
          return {
            suggestions,
          };
        }

        return { suggestions: [] };
      },
      triggerCharacters: ['#', '.', '['],
    });
  }

  public setSchema(schema: JSONSchema): void {
    Object.assign(this.schema, schema);
    this.keywords.push(...getKeywords(schema));
  }
}
