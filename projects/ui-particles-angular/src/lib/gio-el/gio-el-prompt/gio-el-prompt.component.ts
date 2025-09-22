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
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  WritableSignal,
  Signal,
  computed,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';

import { GioElService } from '../gio-el.service';
import { ElAiPromptState, isPromptError, isPromptSuccess, FeedbackRequestId } from '../models/ElAiPromptState';
import { GioIconsModule } from '../../gio-icons/gio-icons.module';
import { GioBannerModule } from '../../gio-banner/gio-banner.module';
import { GioClipboardModule } from '../../gio-clipboard/gio-clipboard.module';

type PromptState = 'loading' | ElAiPromptState;
type FeedbackState = 'helpful' | 'not-helpful' | null;

@Component({
  selector: 'gio-el-prompt',
  templateUrl: './gio-el-prompt.component.html',
  styleUrl: './gio-el-prompt.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconButton,
    GioIconsModule,
    GioBannerModule,
    GioClipboardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioElPromptComponent implements AfterViewInit {
  public readonly maxPromptSize = 256;
  public aiRequestFormGroup: FormGroup<{
    prompt: FormControl<string | null>;
  }> = new FormGroup({
    prompt: new FormControl('', [Validators.required, Validators.maxLength(this.maxPromptSize)]),
  });
  public elService: GioElService = inject(GioElService);

  @Input()
  public responseState: WritableSignal<PromptState | null> = signal(null);
  @ViewChild('promptArea') public myInput!: ElementRef<HTMLInputElement>;

  public feedbackState: WritableSignal<FeedbackState> = signal(null);

  public get prompt() {
    return this.aiRequestFormGroup.get('prompt');
  }
  public el: Signal<string | null> = computed(() => {
    const state = this.responseState();
    return isPromptSuccess(state) ? state.el : null;
  });

  public feedbackRequestId: Signal<FeedbackRequestId | null> = computed(() => {
    const state = this.responseState();
    return isPromptSuccess(state) ? state.feedbackRequestId || null : null;
  });
  public errorMessage: Signal<string | null> = computed(() => {
    const state = this.responseState();
    return isPromptError(state) ? state.message : null;
  });

  public showFeedback: Signal<boolean> = computed(() => {
    const state = this.responseState();
    const feedback = this.feedbackState();
    return isPromptSuccess(state) && feedback === null;
  });

  public ngAfterViewInit() {
    setTimeout(() => {
      this.myInput.nativeElement.focus();
    }, 1000);
  }

  public sendPromptToIA() {
    const prompt = this.aiRequestFormGroup.get('prompt')?.value;
    if (!prompt) {
      return;
    }
    this.responseState.set('loading');
    this.feedbackState.set(null);
    this.elService.prompt(prompt).subscribe(reply => this.responseState.set(reply));
  }

  public submitFeedback(feedback: 'helpful' | 'not-helpful') {
    this.feedbackState.set(feedback);
    const expression = this.el();
    const feedbackRequestId = this.feedbackRequestId();
    if (expression) {
      this.elService.submitFeedback(feedback, feedbackRequestId || undefined).subscribe();
    }
  }
}
