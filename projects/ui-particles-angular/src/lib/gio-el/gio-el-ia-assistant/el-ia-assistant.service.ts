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
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type AiRequestConfig = {
  username: string;
  password: string;
};

export type AiRequest = {
  context: string;
  message: string;
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

  public sendRequest(request: AiRequest, config: AiRequestConfig) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${config.username}:${config.password}`)}`,
    };

    return new Observable<AiResponse>(observer => {
      fetch(this.BASE_URL + '/ai', {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      })
        .then(async response => {
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            observer.error({ status: response.status, ...error });
            return;
          }
          const data = await response.json();
          observer.next(data);
          observer.complete();
        })
        .catch(err => observer.error(err));
    });
  }

  //  TODO: Do not ask me why it's not working in APIM with el java backend :man_shrugging:
  // private httpClient$ = inject(HttpClient);
  //
  // public sendRequest(request: AiRequest, config: AiRequestConfig) {
  //   return this.httpClient$.post<AiResponse>(this.BASE_URL + '/ai', request, {
  //     headers: {
  //       Authorization: `Basic ${btoa(`${config.username}:${config.password}`)}`,
  //     },
  //   });
  // }
}
