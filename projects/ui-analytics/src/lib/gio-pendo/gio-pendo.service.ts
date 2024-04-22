/*
 * Copyright (C) 2022 The Gravitee team (http://gravitee.io)
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

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var pendo: any;
}

@Injectable()
export class GioPendoService {
  /**
   * Completely re-initialize the Agent with new options, which does NOT reload Guides automatically. See loadGuides instead
   * @param visitor
   * @param account
   * @returns
   */
  public initialize(visitor: { id: string } & Record<string, string>, account?: { id: string } & Record<string, string>): void {
    if (!window.pendo) {
      return;
    }

    window.pendo.initialize({ visitor, account });
  }

  /**
   * Queue a trackType event or transmission, optionally including metadata as the payload for the event.
   * @param event
   * @param properties
   * @returns
   */
  public track(event: string, properties: Record<string, unknown>): void {
    if (!window.pendo) {
      return;
    }

    window.pendo.track(event, properties);
  }
}
