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
import { Component, importProvidersFrom, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { action } from '@storybook/addon-actions';
import { GioMonacoEditorModule } from '@gravitee/ui-particles-angular';

import { GioElEditorHelperToggleComponent } from '../gio-el-editor-helper/gio-el-editor-helper-toggle.component';
import { GioElEditorHelperInputDirective } from '../gio-el-editor-helper/gio-el-editor-helper-input.directive';
import { GioElService } from '../gio-el.service';

import { GioElEditorInputComponent } from './gio-el-editor-input.component';

@Component({
  selector: 'gio-story-component',
  template: `
    <mat-form-field style="width: 100%">
      <mat-label>El condition</mat-label>
      <gio-el-editor-input [gioElEditorHelper]="elEditor" [formControl]="formControl" [singleLineMode]="singleLineMode" />
      <gio-el-editor-helper-toggle
        matIconSuffix
        #elEditor
        [enableConditionBuilder]="true"
        [scopes]="['node']"
      ></gio-el-editor-helper-toggle>
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
    MatButtonModule,
    GioElEditorInputComponent,
    GioElEditorHelperToggleComponent,
    GioElEditorHelperInputDirective,
  ],
})
class StoryInputComponent {
  @Input()
  public singleLineMode: boolean = true;

  public formControl = new FormControl();
  public disable = false;

  constructor(private gioElService: GioElService) {
    this.gioElService.setElProperties('node', [
      {
        field: 'node',
        label: 'Node',
        properties: [
          {
            field: 'id',
            label: 'Id',
            type: 'string',
          },
          {
            field: 'shardingTags',
            label: 'Shared Tags',
            type: 'Map', // FIXME: Array ?
            valueProperty: {
              type: 'string',
            },
          },
          {
            field: 'tenant',
            label: 'Tenant',
            type: 'string',
          },
          {
            field: 'version',
            label: 'Version',
            type: 'string',
          },
          {
            field: 'zone',
            label: 'Zone',
            type: 'string',
          },
        ],
      },
    ]);
    this.formControl.valueChanges.subscribe(value => action('El Value')(value));
  }

  public disableToggle() {
    this.disable = !this.disable;
    this.disable ? this.formControl.disable() : this.formControl.enable();
  }
}

export default {
  title: 'Components / EL / EL editor input for MatFormField',
  component: StoryInputComponent,
  render: args => ({
    template: `<gio-story-component [singleLineMode]="singleLineMode" ></gio-story-component>`,
    props: {
      singleLineMode: args.singleLineMode,
    },
  }),
  decorators: [
    moduleMetadata({
      imports: [GioMonacoEditorModule.forRoot({ baseUrl: '.' })],
    }),
    applicationConfig({
      providers: [importProvidersFrom(GioMonacoEditorModule.forRoot({ baseUrl: '.' })), GioMonacoEditorModule],
    }),
  ],
} as Meta;

export const ConditionElSingleLine: StoryObj = {};
ConditionElSingleLine.args = {
  singleLineMode: true,
};

export const ConditionElMultiLine: StoryObj = {};
ConditionElMultiLine.args = {
  singleLineMode: false,
};
