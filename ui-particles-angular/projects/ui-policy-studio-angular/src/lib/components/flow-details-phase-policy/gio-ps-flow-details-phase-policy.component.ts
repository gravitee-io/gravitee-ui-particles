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
import { Component, Input } from '@angular/core';

import { Step } from '../../models';

@Component({
  selector: 'gio-ps-flow-details-phase-policy',
  templateUrl: './gio-ps-flow-details-phase-policy.component.html',
  styleUrls: ['./gio-ps-flow-details-phase-policy.component.scss'],
})
export class GioPolicyStudioDetailsPhasePolicyComponent {
  @Input()
  public step!: Step;

  public onEdit() {
    throw new Error('Wip');
  }

  public onDisable() {
    throw new Error('Wip');
  }

  public onDelete() {
    throw new Error('Wip');
  }
}
