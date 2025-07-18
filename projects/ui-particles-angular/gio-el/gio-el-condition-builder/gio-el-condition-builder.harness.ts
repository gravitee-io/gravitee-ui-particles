/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { GioElConditionGroupHarness } from './gio-el-condition-group/gio-el-condition-group.harness';

export class GioElConditionBuilderHarness extends ComponentHarness {
  public static hostSelector = 'gio-el-condition-builder';

  public getMainConditionGroup = this.locatorFor(GioElConditionGroupHarness);

  public static with(options: BaseHarnessFilters = {}): HarnessPredicate<GioElConditionBuilderHarness> {
    return new HarnessPredicate(GioElConditionBuilderHarness, options);
  }
}
