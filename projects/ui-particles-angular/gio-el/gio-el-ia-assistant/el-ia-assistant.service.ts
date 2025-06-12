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
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AiRequestConfig = {
  username: string;
  password: string;
};

export type AiRequest = {
  context: string;
  message: string;
  config: AiRequestConfig;
};

export type AiResponse = {
  message: string;
  messageError: string;
  currentQuota: number;
  maxQuota: number;
  quotaExceeded: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ElIaAssistantService {
  private BASE_URL = 'https://apim-tools-el-sandbox.team-apim.gravitee.dev/api/el';

  private httpClient$ = inject(HttpClient);

  public sendRequest(request: AiRequest) {
    return this.httpClient$.post<AiResponse>(this.BASE_URL + '/ai', request, {
      headers: {
        Authorization: `Basic ${btoa(`${request.config.username}:${request.config.password}`)}`,
      },
    });
  }
}
