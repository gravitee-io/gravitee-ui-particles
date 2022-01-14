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
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';
import { FlowService } from './services/flow.service.fixture';
import { PolicyService } from './services/policy.service.fixture';
import { ResourceService } from './services/resource.service.fixture';
import { SpelService } from './services/spel.service.fixture';

@NgModule({
  declarations: [GioPolicyStudioComponent],
  imports: [],
  exports: [GioPolicyStudioComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GioPolicyStudioModule {
  static forSpecs(): GioPolicyStudioModule {
    return {
      ngModule: GioPolicyStudioModule,
      providers: [
        {
          provide: 'FlowService',
          useClass: FlowService,
        },
        {
          provide: 'PolicyService',
          useClass: PolicyService,
        },
        {
          provide: 'ResourceService',
          useClass: ResourceService,
        },
        {
          provide: 'SpelService',
          useClass: SpelService,
        },
      ],
    };
  }
}
