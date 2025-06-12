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
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  Host,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GioMonacoEditorComponent } from './gio-monaco-editor.component';

@Directive({
  selector: '[gioMonacoEditorFormField]',
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => GioMonacoEditorFormFieldDirective),
    },
  ],
  standalone: false,
})
export class GioMonacoEditorFormFieldDirective implements OnInit, DoCheck, MatFormFieldControl<string>, OnDestroy {
  public static nextId = 0;

  public stateChanges = new Subject<void>();

  @HostBinding()
  public id = `gio-monaco-editor-${GioMonacoEditorFormFieldDirective.nextId++}`;

  @HostBinding('attr.aria-describedBy')
  public userAriaDescribedBy = '';

  public get value(): string | null {
    return this.hostGioMonacoEditorComponent?.value ?? null;
  }

  @Input()
  public set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }
  public get placeholder() {
    return this._placeholder;
  }

  @Input()
  public set required(required: boolean) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }
  public get required() {
    return this._required;
  }

  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  public get disabled() {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  public ngControl: NgControl | null = null;

  public focused = false;

  public get empty(): boolean {
    return !this.value;
  }

  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @HostBinding('class.hidden')
  public get shouldHideEditor(): boolean {
    return !this.shouldLabelFloat;
  }

  public errorState = false;
  public controlType = 'gio-monaco-editor';
  // autofilled?: boolean | undefined;

  private _placeholder = '';
  private _required = false;
  private _disabled = false;
  private maxHeight = 500;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly elementRef: ElementRef,
    private readonly focusMonitor: FocusMonitor,
    private readonly renderer: Renderer2,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Host() @Self() @Optional() public readonly hostGioMonacoEditorComponent: GioMonacoEditorComponent,
  ) {}

  public ngOnInit(): void {
    this.stateChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.changeDetectorRef.markForCheck());

    this.focusMonitor
      .monitor(this.elementRef.nativeElement.parentElement, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
    this.ngControl = this.hostGioMonacoEditorComponent?.ngControl;

    this.hostGioMonacoEditorComponent?.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      // Auto resize editor
      this.hostGioMonacoEditorComponent.standaloneCodeEditor?.onDidContentSizeChange(() => {
        const height = Math.min(
          this.hostGioMonacoEditorComponent.standaloneCodeEditor?.getContentHeight() ?? this.maxHeight,
          this.maxHeight,
        );
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${height}px`);

        this.hostGioMonacoEditorComponent.standaloneCodeEditor?.layout();
        this.stateChanges.next();
      });
    });
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = !!this.ngControl.invalid && !!this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  public setDescribedByIds(ids: string[]): void {
    this.userAriaDescribedBy = ids.join(' ');
  }

  public onContainerClick(_event: MouseEvent): void {
    if (!this.focused) {
      this.hostGioMonacoEditorComponent.standaloneCodeEditor?.focus();
    }
  }
}
