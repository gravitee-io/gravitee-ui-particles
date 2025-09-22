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
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ElAiPromptState, FeedbackRequestId } from './models/ElAiPromptState';

export type FeedbackType = 'helpful' | 'not-helpful';

export interface FeedbackSubmission {
  feedback: FeedbackType;
  feedbackRequestId?: FeedbackRequestId;
}

@Injectable({
  providedIn: 'root',
})
export class GioElService {
  private _promptCallback?: (prompt: string) => Observable<ElAiPromptState> = undefined;
  private _feedbackCallback?: (feedbackSubmission: FeedbackSubmission) => Observable<void> = undefined;

  public prompt(prompt: string): Observable<ElAiPromptState> {
    if (this._promptCallback === undefined) {
      return of({
        message: `Error: no handler given (input prompt: ${prompt})`,
      });
    }
    return this._promptCallback(prompt);
  }

  public set promptCallback(value: (prompt: string) => Observable<ElAiPromptState>) {
    this._promptCallback = value;
  }

  public submitFeedback(feedback: FeedbackType, feedbackRequestId?: FeedbackRequestId): Observable<void> {
    const feedbackSubmission: FeedbackSubmission = {
      feedback,
      feedbackRequestId,
    };

    if (this._feedbackCallback === undefined) {
      return of(undefined);
    }
    return this._feedbackCallback(feedbackSubmission);
  }

  public set feedbackCallback(value: (feedbackSubmission: FeedbackSubmission) => Observable<void>) {
    this._feedbackCallback = value;
  }

  public isEnabled(): boolean {
    return this._promptCallback !== undefined;
  }
}
