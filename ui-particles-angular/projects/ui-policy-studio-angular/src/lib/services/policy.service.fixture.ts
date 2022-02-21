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
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PolicyDocumentation, PolicyListItem, PolicySchema } from '../models/policy';
import { fakePolicyListItem, fakePolicySchema, fakePolicyDocumentation } from '../models/policy/index-testing';

import { PolicyServiceAbstract } from './policy.abstract.service';
import { ListParams } from './resource.abstract.service';

@Injectable()
export class PolicyService extends PolicyServiceAbstract {
  public list(_params: ListParams): Observable<PolicyListItem[]> {
    return of([fakePolicyListItem()]);
  }

  public listSwaggerPolicies(): Observable<PolicyListItem[]> {
    return of([fakePolicyListItem()]);
  }

  public getSchema(_policyId: string): Observable<PolicySchema> {
    return of(fakePolicySchema());
  }

  public getDocumentation(_policyId: string): Observable<PolicyDocumentation> {
    return of(fakePolicyDocumentation()).pipe(map(buffer => buffer.toString()));
  }
}
