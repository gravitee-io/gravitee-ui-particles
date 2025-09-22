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
import { get } from 'lodash';
export type ElAiPromptState = PromptSuccess | PromptError;

export interface PromptSuccess {
  el: string;
  feedbackRequestId?: FeedbackRequestId;
}

export interface FeedbackRequestId {
  chatId: string;
  userMessageId: string;
  agentMessageId: string;
}

export function isPromptSuccess(value: unknown): value is PromptSuccess {
  return typeof value === 'object' && value !== null && typeof get(value, 'el') === 'string';
}

export interface PromptError {
  message: string;
}

export function isPromptError(value: unknown): value is PromptError {
  return typeof value === 'object' && value !== null && typeof get(value, 'message') === 'string';
}
