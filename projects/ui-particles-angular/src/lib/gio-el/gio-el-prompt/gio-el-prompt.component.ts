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
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ElAiReply, isPromptError, isPromptSuccess } from '../models/ElAiReply';
import { GioElService } from '../gio-el.service';

type PromptState = 'loading' | ElAiReply;

@Component({
  selector: 'gio-el-prompt',
  templateUrl: './gio-el-prompt.component.html',
  styleUrl: './gio-el-prompt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class GioElPromptComponent implements AfterViewInit {
  public readonly maxPromptSize = 256;
  public aiRequestFormGroup: FormGroup<{
    prompt: FormControl<string | null>;
  }> = new FormGroup({
    prompt: new FormControl('', [Validators.required, Validators.max(this.maxPromptSize)]),
  });
  public elService: GioElService = inject(GioElService);

  @Input()
  public responseState: WritableSignal<PromptState | null> = signal(null);
  @ViewChild('promptArea') public myInput!: ElementRef<HTMLInputElement>;

  public el: Signal<string | null> = computed(() => {
    const state = this.responseState();
    return isPromptSuccess(state) ? state.el : null;
  });
  public errorMessage: Signal<string | null> = computed(() => {
    const state = this.responseState();
    return isPromptError(state) ? state.message : null;
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
    this.elService.prompt(prompt).subscribe(reply => this.responseState.set(reply));
  }
}
