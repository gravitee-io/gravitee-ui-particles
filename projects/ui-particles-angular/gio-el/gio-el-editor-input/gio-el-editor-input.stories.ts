/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { Component, importProvidersFrom } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { action } from '@storybook/addon-actions';
import { GioMonacoEditorModule } from '@gravitee/ui-particles-angular';

import { GioElEditorHelperToggleComponent } from '../gio-el-editor-helper/gio-el-editor-helper-toggle.component';
import { GioElEditorHelperInputDirective } from '../gio-el-editor-helper/gio-el-editor-helper-input.directive';

import { GioElEditorInputComponent } from './gio-el-editor-input.component';

@Component({
  selector: 'gio-story-component',
  template: `
    <mat-form-field style="width: 100%">
      <mat-label>El condition</mat-label>
      <gio-el-editor-input [gioElEditorHelper]="elEditor" [formControl]="formControl" />
      <gio-el-editor-helper-toggle matIconSuffix #elEditor></gio-el-editor-helper-toggle>
      <mat-hint>Accept EL</mat-hint>
    </mat-form-field>

    <br />
    ----
    <br />

    <button mat-button (click)="disableToggle()">{{ disable ? 'Enable' : 'Disable' }} input</button> |
    {{ formControl.dirty ? 'DIRTY' : 'PRISTINE' }} | {{ formControl.touched ? 'TOUCHED' : 'UNTOUCHED' }}
  `,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    GioElEditorInputComponent,
    MatButtonModule,
    GioElEditorHelperToggleComponent,
    GioElEditorHelperInputDirective,
  ],
})
class StoryInputComponent {
  public formControl = new FormControl();
  public disable = false;

  constructor() {
    this.formControl.valueChanges.subscribe(value => action('El Value')(value));
  }

  public disableToggle() {
    this.disable = !this.disable;
    this.disable ? this.formControl.disable() : this.formControl.enable();
  }
}

export default {
  title: 'Components / EL / CodeEditor input for MatFormField',
  component: StoryInputComponent,
  decorators: [
    moduleMetadata({
      imports: [GioMonacoEditorModule.forRoot({ baseUrl: '.' })],
    }),
    applicationConfig({
      providers: [importProvidersFrom(GioMonacoEditorModule.forRoot({ baseUrl: '.' })), GioMonacoEditorModule],
    }),
  ],
} as Meta;

export const Default: StoryObj = {};
