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
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { GioBannerModule, GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { get } from 'lodash';

import { AiRequestConfig, ElIaAssistantService } from './el-ia-assistant.service';

@Component({
  selector: 'gio-el-ia-assistant',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatProgressBarModule,
    MatTooltipModule,
    GioIconsModule,
    GioBannerModule,
  ],
  templateUrl: './gio-el-ia-assistant.component.html',
  styleUrl: './gio-el-ia-assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioElIaAssistantComponent {
  private readonly elIaAssistantService = inject(ElIaAssistantService);

  public aiRequestFormGroup: FormGroup<{
    message: FormControl<string | null>;
  }> = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.max(256)]),
  });

  @Input()
  public elContext?: string | null;

  @Output()
  public tryEl = new EventEmitter<string>();

  public aiAssistantConfig?: AiRequestConfig = undefined;

  public responseState: WritableSignal<'loading' | 'success' | 'error' | null> = signal(null);
  public responseMessage: WritableSignal<string | null> = signal(null);
  public responseQuota: WritableSignal<string | null> = signal(null);

  constructor() {
    const aiAssistantConfig = localStorage.getItem('AI_ASSISTANT_CONFIG');
    if (aiAssistantConfig) {
      try {
        this.aiAssistantConfig = JSON.parse(aiAssistantConfig);
      } catch (e) {
        // If parsing fails, we just ignore the config
      }
    }
  }

  public sendMessageToIA() {
    const message = this.aiRequestFormGroup.get('message')?.value;
    if (!message || !this.aiAssistantConfig) {
      return;
    }
    this.responseState.set('loading');

    this.elIaAssistantService
      .sendRequest({
        message,
        context: this.elContext ?? '{}',
        config: this.aiAssistantConfig,
      })
      .subscribe({
        next: response => {
          this.responseQuota.set(`${response.currentQuota}/${response.maxQuota}`);
          if (response.messageError) {
            this.responseState.set('error');
            this.responseMessage.set(response.messageError);
          } else {
            this.responseState.set('success');
            this.responseMessage.set(response.message);
          }
        },
        error: (error: unknown) => {
          this.responseState.set('error');
          const errorStatus = get(error, 'status', undefined);
          const errorMessage = get(error, 'message', 'An error occurred while processing your request');
          const isAuthError = errorStatus === 405 || errorStatus === 401 || errorStatus === 403;
          this.responseMessage.set(
            isAuthError ? 'You are not authorized to use the AI assistant. Please check your config.' : errorMessage,
          );
        },
      });
  }

  public canTryEL() {
    if (!this.responseMessage) {
      return;
    }

    return !!sanitizeEl(this.responseMessage());
  }

  public onTryEL() {
    if (!this.responseMessage) {
      return;
    }

    this.tryEl.emit(this.responseMessage()?.replace(/[`]/g, ''));
  }
}

function sanitizeEl(aiElResponse: string | null) {
  if (!aiElResponse) {
    return null;
  }

  const regex = /(\$\{[^}]+\}|\{#\s*[^}]+\s*\})/;
  const match = aiElResponse.match(regex);

  return match ? match[0] : null;
}
