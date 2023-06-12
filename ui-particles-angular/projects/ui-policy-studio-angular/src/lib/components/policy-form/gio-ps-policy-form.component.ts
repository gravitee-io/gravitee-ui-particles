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
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Policy, Step } from '../../models';
import { GioPolicyStudioService } from '../../gio-policy-studio.service';

@Component({
  selector: 'gio-ps-policy-form',
  templateUrl: './gio-ps-policy-form.component.html',
  styleUrls: ['./gio-ps-policy-form.component.scss'],
})
export class GioPolicyStudioPolicyFormComponent implements OnChanges {
  @Input()
  public step?: Step;

  @Input()
  public policy!: Policy;

  public policySchema$?: unknown;
  public policyDocumentation$?: unknown;

  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.policy) {
      this.policySchema$ = this.policyStudioService.getPolicySchema(this.policy);
      this.policyDocumentation$ = this.policyStudioService.getPolicyDocumentation(this.policy);
    }
  }
}
