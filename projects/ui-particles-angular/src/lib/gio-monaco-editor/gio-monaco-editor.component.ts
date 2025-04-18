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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isEqual, isString, uniqueId } from 'lodash';
import Monaco, { editor } from 'monaco-editor';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GioMonacoEditorConfig, GIO_MONACO_EDITOR_CONFIG } from './models/GioMonacoEditorConfig';
import { GioLanguageJsonService } from './services/gio-language-json.service';
import { GioMonacoEditorService } from './services/gio-monaco-editor.service';
import { GioLanguageElService } from './services/gio-language-el.service';
import { JSONSchema } from './models/JSONSchemaAutoComplete';

export type MonacoEditorLanguageConfig =
  | {
      language: 'json';
      schemas?: { uri: string; schema: unknown }[];
    }
  | {
      language: 'markdown';
    }
  | {
      language: 'html';
    }
  | {
      language: 'yaml';
    }
  | {
      language: 'spel';
      schema?: JSONSchema;
    }
  | {
      language: 'css';
    };

@Component({
  selector: 'gio-monaco-editor',
  template: ` <div *ngIf="loaded$ | async">Loading...</div>`,
  styleUrls: ['./gio-monaco-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioMonacoEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input()
  public languageConfig?: MonacoEditorLanguageConfig;

  @Input()
  public options: editor.IStandaloneEditorConstructionOptions = {};

  @Input()
  public disableMiniMap = false;

  @Input()
  public disableAutoFormat = false;

  @Input()
  @HostBinding('class.single-line')
  public singleLineMode = false;

  public loaded$ = new ReplaySubject<boolean>(1);

  private defaultOptions: editor.IStandaloneEditorConstructionOptions = {
    contextmenu: false,
    minimap: {
      enabled: true,
    },
    automaticLayout: true,
    scrollBeyondLastLine: false,
  };

  public value = '';
  public readOnly = false;
  public standaloneCodeEditor?: editor.IStandaloneCodeEditor;
  private textModel?: editor.ITextModel;
  private toDisposes: Monaco.IDisposable[] = [];

  protected _onChange: (_value: string | null) => void = () => ({});

  protected _onTouched: () => void = () => ({});
  private unsubscribe$ = new Subject<void>();

  constructor(
    public readonly hostElement: ElementRef,
    @Inject(GIO_MONACO_EDITOR_CONFIG) private readonly config: GioMonacoEditorConfig,
    private readonly monacoEditorService: GioMonacoEditorService,
    private readonly languageJsonService: GioLanguageJsonService,
    private readonly languageSpelService: GioLanguageElService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    @Optional() @Self() public readonly ngControl: NgControl,
  ) {
    if (this.ngControl) {
      // Set the value accessor directly (instead of providing
      // NG_VALUE_ACCESSOR) to avoid running into a circular import
      this.ngControl.valueAccessor = this;
    }
    this.monacoEditorService.loadEditor();
  }

  public ngAfterViewInit() {
    // Wait until monaco editor is available
    this.monacoEditorService.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe(({ monaco }) => {
      this.setupEditor(monaco);

      this.loaded$.next(false);
      this.changeDetectorRef.detectChanges();
    });
  }

  public ngOnDestroy() {
    this.toDisposes.forEach(d => d.dispose());

    if (this.standaloneCodeEditor) {
      this.standaloneCodeEditor.dispose();
      this.standaloneCodeEditor = undefined;
    }

    if (this.textModel) {
      this.textModel.dispose();
      this.textModel = undefined;
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // From ControlValueAccessor interface
  public writeValue(_value: string): void {
    if (_value) {
      this.value = isString(_value) ? _value : JSON.stringify(_value);
    }
    if (this.textModel) {
      this.textModel.setValue(this.value);
    }
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (_value: string | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    this.readOnly = isDisabled;

    if (this.standaloneCodeEditor) {
      this.standaloneCodeEditor.updateOptions({
        readOnly: isDisabled,
      });
    }
  }

  private setupEditor(monaco: typeof Monaco) {
    if (!this.hostElement) {
      throw new Error('No editor ref found.');
    }

    const domElement = this.hostElement.nativeElement;

    const settings = {
      value: this.value,
      language: this.languageConfig?.language ?? (isJsonString(this.value) ? 'json' : 'plaintext'),
      uri: `code-${uniqueId()}`,
    };

    this.ngZone.runOutsideAngular(() => {
      this.textModel = monaco.editor.createModel(settings.value, settings.language, monaco.Uri.parse(settings.uri));
    });

    const options = Object.assign({}, this.defaultOptions, this.options, {
      readOnly: this.readOnly,
      theme: this.config.theme ?? 'vs',
      model: this.textModel,
      minimap: {
        enabled: !this.disableMiniMap,
      },
    });

    this.standaloneCodeEditor = monaco.editor.create(domElement, {
      ...options,
    });

    if (!this.disableAutoFormat) {
      setTimeout(() => {
        this.standaloneCodeEditor?.getAction('editor.action.formatDocument')?.run();
      }, 80);
    }

    if (this.singleLineMode) {
      this.standaloneCodeEditor?.addAction({
        id: 'custom.action',
        label: 'custom action',
        keybindings: [monaco.KeyCode.Enter],
        precondition: '!suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible',
        run: () => {
          // Ignore Enter key in single line mode when writing
          return;
        },
      });
    }

    const onDidChangeContent = this.textModel?.onDidChangeContent(() => {
      const textModelValue = this.textModel?.getValue() ?? '';
      if (this.singleLineMode) {
        // If value has \n, \r or \r\n, remove them
        // Useful to clear line breaks when pasting text
        const hasLineBreak = new RegExp(/(\r\n|\n|\r)/gm);
        if (hasLineBreak.test(textModelValue)) {
          const currentPosition = this.standaloneCodeEditor?.getPosition();
          setTimeout(() => {
            this.standaloneCodeEditor?.pushUndoStop();
            this.textModel?.setValue(textModelValue.replace(/(\r\n|\n|\r)/gm, ''));
            if (currentPosition) {
              this.standaloneCodeEditor?.setPosition(currentPosition);
            }
            this.standaloneCodeEditor?.popUndoStop();
          }, 0);
          return;
        }
      }

      this.ngZone.run(() => {
        if (!this.readOnly && !isEqual(this.value, textModelValue)) {
          setTimeout(() => {
            this.value = textModelValue;
            this._onChange(textModelValue);
            this._onTouched();
          }, 0);
        }
      });
    });

    if (this.singleLineMode) {
      // Source : https://farzadyz.com/blog/single-line-monaco-editor
      this.standaloneCodeEditor?.updateOptions({
        // quickSuggestions: false,
        fixedOverflowWidgets: true,
        acceptSuggestionOnEnter: 'on',
        hover: {
          delay: 100,
        },
        roundedSelection: false,
        contextmenu: false,
        cursorStyle: 'line-thin',
        links: false,
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'never',
          seedSearchStringFromSelection: 'never',
        },
        fontSize: 14,
        fontWeight: 'normal',
        overviewRulerLanes: 0,
        scrollBeyondLastColumn: 0,
        wordWrap: 'on',
        minimap: {
          enabled: false,
        },
        lineNumbers: 'off',
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        renderLineHighlight: 'none',
        scrollbar: {
          horizontal: 'hidden',
          vertical: 'hidden',
          alwaysConsumeMouseWheel: false,
        },
      });
    }

    const onDidBlurEditorWidget = this.standaloneCodeEditor?.onDidBlurEditorWidget(() => {
      this.ngZone.run(() => {
        if (!this.readOnly) this._onTouched();
      });
    });

    this.toDisposes = [onDidChangeContent, onDidBlurEditorWidget].filter(d => !!d) as Monaco.IDisposable[];

    this.setupLanguage(settings.uri, this.languageConfig);
  }

  private setupLanguage(uri: string, languageConfig?: MonacoEditorLanguageConfig) {
    if (!languageConfig) {
      return;
    }

    switch (languageConfig.language) {
      case 'json':
        if (languageConfig.schemas) {
          this.languageJsonService.addSchemas(uri, languageConfig.schemas);
        }
        break;
      case 'spel':
        if (languageConfig.schema) {
          this.languageSpelService.setSchema(languageConfig.schema);
        }
        break;
      default:
        break;
    }
  }
}

const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
