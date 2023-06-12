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

import { Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Policy, PolicySchemaFetcher } from './models';

@Inject({})
export class GioPolicyStudioService {
  private schemasCache: Record<string, unknown> = {};
  private documentationsCache: Record<string, unknown> = {};

  private policySchemaFetcher?: PolicySchemaFetcher;
  private policyDocumentationFetcher?: PolicySchemaFetcher;

  public setPolicySchemaFetcher(policySchemaFetcher: PolicySchemaFetcher) {
    this.policySchemaFetcher = policySchemaFetcher;
  }

  public setPolicyDocumentationFetcher(policyDocumentationFetcher: PolicySchemaFetcher) {
    this.policyDocumentationFetcher = policyDocumentationFetcher;
  }

  /**
   * Call the policy schema fetcher to get the schema for the given policy. If the
   * schema has already been fetched, it will be returned from the cache.
   *
   * @param policy to get the schema for
   * @returns the schema for the policy
   */
  public getPolicySchema(policy: Policy): Observable<unknown> {
    if (!this.policySchemaFetcher) throw new Error('PolicySchemaFetcher not defined!');

    if (this.schemasCache[policy.id]) {
      return of(this.schemasCache[policy.id]).pipe(shareReplay(1));
    }

    return this.policySchemaFetcher(policy);
  }

  /**
   * Call the policy documentation fetcher to get the documentation for the given policy. If the
   * documentation has already been fetched, it will be returned from the cache.
   *
   * @param policy to get the documentation for
   * @returns the documentation for the policy
   */
  public getPolicyDocumentation(policy: Policy): Observable<unknown> {
    if (!this.policyDocumentationFetcher) throw new Error('PolicyDocumentationFetcher not defined!');

    if (this.documentationsCache[policy.id]) {
      return of(this.documentationsCache[policy.id]).pipe(shareReplay(1));
    }

    return this.policyDocumentationFetcher(policy);
  }
}
