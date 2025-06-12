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
import { Component, DestroyRef, HostBinding, inject, Input, OnDestroy, Optional, Self, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FocusMonitor } from '@angular/cdk/a11y';

import { GioMonacoEditorModule } from '../../gio-monaco-editor/gio-monaco-editor.module';
import { MonacoEditorLanguageConfig } from '../../gio-monaco-editor/gio-monaco-editor.component';
import { GioMonacoEditorFormFieldDirective } from '../../gio-monaco-editor/gio-monaco-editor-form-field.directive';
import ElSchema from '../../gio-monaco-editor/data/el-schema.json';

@Component({
  selector: 'gio-el-editor-input',
  imports: [ReactiveFormsModule, GioMonacoEditorModule],
  templateUrl: './gio-el-editor-input.component.html',
  styleUrl: './gio-el-editor-input.component.scss',
  providers: [{ provide: MatFormFieldControl, useExisting: GioElEditorInputComponent }],
})
export class GioElEditorInputComponent implements MatFormFieldControl<string>, ControlValueAccessor, OnDestroy, OnInit {
  private readonly destroyRef = inject(DestroyRef);

  public formControl = new FormControl();

  public languageConfig?: MonacoEditorLanguageConfig = {
    language: 'spel',
    // TODO convert elContext to this JSON schema format for automatic completion
    schema: ElSchema,
  };

  // TODO : IMHO we could have 3 mode :
  //  singleLineMode : One line input, enters \n are ignored
  //  multiLineMode : Multi line input, but we hide monacoeditor line numbers and other features
  //  codeEditorMode : Full code editor with MonacoEditor features
  @Input()
  public singleLineMode = true;

  @ViewChild(GioMonacoEditorFormFieldDirective)
  public elInputFormField!: GioMonacoEditorFormFieldDirective;

  // From MatFormFieldControl
  public set value(address: string | null) {
    this.formControl.setValue(address);

    this.stateChanges.next();
  }

  // From MatFormFieldControl
  public stateChanges = new Subject<void>();

  // From MatFormFieldControl
  public static nextId = 0;
  @HostBinding()
  public id = `gio-el-editor-input-${GioElEditorInputComponent.nextId++}`;

  // From MatFormFieldControl
  @Input()
  public get placeholder() {
    return this._placeholder;
  }
  public set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string = '';

  // From MatFormFieldControl
  public focused = false;

  // From MatFormFieldControl
  public get empty() {
    return !this.formControl.value;
  }

  // From MatFormFieldControl
  @HostBinding('class.floating')
  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  // From MatFormFieldControl
  @Input()
  public get required() {
    return this._required;
  }
  public set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  // From MatFormFieldControl
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.formControl.disable() : this.formControl.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  public touched = false;

  // From MatFormFieldControl
  public get errorState(): boolean {
    return this.formControl.invalid && this.touched;
  }

  // From MatFormFieldControl
  public controlType = 'gio-el-editor-input';

  // From MatFormFieldControl
  @HostBinding('attr.aria-describedBy')
  public userAriaDescribedBy?: string | undefined;

  // From MatFormFieldControl
  public setDescribedByIds(ids: string[]): void {
    this.userAriaDescribedBy = ids.join(' ');
  }

  // From MatFormFieldControl
  // disableAutomaticLabeling?: boolean | undefined;

  protected _onChange: (_value: string | null) => void = () => ({});
  protected _onTouched: () => void = () => ({});

  constructor(
    @Optional() @Self() public readonly ngControl: NgControl,
    private elementRef: ElementRef<HTMLElement>,
    private focusMonitor: FocusMonitor,
  ) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.focusMonitor
      .monitor(this.elementRef.nativeElement, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(origin => {
        this.focused = !!origin;

        this.touched = true;
        this._onTouched();
        this.stateChanges.next();
      });
  }

  public ngOnInit() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this._onChange(value);
      this.stateChanges.next();
    });
  }

  // From ControlValueAccessor interface
  public writeValue(value: string): void {
    this.value = value;
    if (value) {
      this.formControl.patchValue(value, { emitEvent: false });
    }
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  // From ControlValueAccessor interface
  public onContainerClick(event: MouseEvent): void {
    try {
      this.elInputFormField.onContainerClick(event);
    } catch (e) {
      // Best effort
    }
  }

  public ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
