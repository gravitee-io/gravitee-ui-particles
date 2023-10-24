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
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { uniqueId } from 'lodash';
import Monaco, { editor } from 'monaco-editor';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GioMonacoEditorConfig, GIO_MONACO_EDITOR_CONFIG } from './models/GioMonacoEditorConfig';
import { GioLanguageJsonService } from './services/gio-language-json.service';
import { GioMonacoEditorService } from './services/gio-monaco-editor.service';

export type MonacoEditorLanguageConfig =
  | {
      language: 'json' | 'markdown';
      schemas: { uri: string; schema: unknown }[];
    }
  | {
      language: 'markdown';
    };

@Component({
  selector: 'gio-monaco-editor',
  template: ` <div *ngIf="loaded$ | async">Loading...</div>`,
  styleUrls: ['./gio-monaco-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioMonacoEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input()
  public languageConfig?: MonacoEditorLanguageConfig;

  @Input()
  public options: editor.IStandaloneEditorConstructionOptions = {};

  @Output()
  public editorInit = new EventEmitter<editor.IStandaloneCodeEditor>();

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
  protected readOnly = false;
  public standaloneCodeEditor?: editor.IStandaloneCodeEditor;
  private textModel?: editor.ITextModel;

  protected _onChange: (_value: string | null) => void = () => ({});

  protected _onTouched: () => void = () => ({});
  private unsubscribe$ = new Subject<void>();

  constructor(
    public readonly hostElement: ElementRef,
    @Inject(GIO_MONACO_EDITOR_CONFIG) private readonly config: GioMonacoEditorConfig,
    private readonly monacoEditorService: GioMonacoEditorService,
    private readonly languageJsonService: GioLanguageJsonService,
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
      this.value = _value;
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
  }

  private setupEditor(monaco: typeof Monaco) {
    if (!this.hostElement) {
      throw new Error('No editor ref found.');
    }

    const domElement = this.hostElement.nativeElement;

    const settings = {
      value: this.value,
      language: this.languageConfig?.language ?? 'text',
      uri: `code-${uniqueId()}`,
    };
    this.ngZone.runOutsideAngular(() => {
      this.textModel = monaco.editor.createModel(settings.value, settings.language, monaco.Uri.parse(settings.uri));
    });

    const options = Object.assign({}, this.defaultOptions, this.options, {
      readOnly: this.readOnly,
      theme: this.config.theme ?? 'vs',
      model: this.textModel,
    });

    this.standaloneCodeEditor = monaco.editor.create(domElement, {
      ...options,
    });

    this.textModel?.onDidChangeContent(() => {
      const newValue = this.textModel?.getValue();
      this.ngZone.run(() => {
        this.value = newValue ?? '';
        this._onChange(newValue ?? '');
        this._onTouched();
      });
    });

    this.standaloneCodeEditor?.onDidBlurEditorWidget(() => {
      this.ngZone.run(() => {
        this._onTouched();
      });
    });

    this.setupLanguage(settings.uri, this.languageConfig);
    this.editorInit.emit(this.standaloneCodeEditor);
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
      default:
        break;
    }
  }
}
