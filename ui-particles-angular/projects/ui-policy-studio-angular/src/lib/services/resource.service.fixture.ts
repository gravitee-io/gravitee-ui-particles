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

import { ResourceDocumentation, ResourceListItem } from '../models/resource';
import { fakeResourceDocumentation, fakeResourceListItem } from '../models/resource/testing';

import { ListParams, ResourceServiceAbstract } from './resource.abstract.service';

@Injectable()
export class ResourceService extends ResourceServiceAbstract {
  list(_params: ListParams): Observable<ResourceListItem[]> {
    return of([fakeResourceListItem()]);
  }

  getDocumentation(_resourceId: string): Observable<ResourceDocumentation> {
    return of(fakeResourceDocumentation());
  }
}
