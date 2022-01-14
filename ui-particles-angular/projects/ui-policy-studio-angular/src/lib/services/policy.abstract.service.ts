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
import { Observable } from 'rxjs';

import { PolicyDocumentation, PolicyListItem, PolicySchema } from '../models/policy';

interface ListParams {
  expandSchema?: boolean;
  expandIcon?: boolean;
  withoutResource?: boolean;
}

export abstract class PolicyServiceAbstract {
  abstract list(params: ListParams): Observable<PolicyListItem[]>;

  abstract listSwaggerPolicies(): Observable<PolicyListItem[]>;

  abstract getSchema(policyId: string): Observable<PolicySchema>;

  abstract getDocumentation(policyId: string): Observable<PolicyDocumentation>;
}
