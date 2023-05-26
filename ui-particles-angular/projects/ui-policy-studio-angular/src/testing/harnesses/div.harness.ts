/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { AsyncFactoryFn, BaseHarnessFilters, ComponentHarness, HarnessPredicate, HarnessQuery } from '@angular/cdk/testing';

export type DivHarnessFilters = BaseHarnessFilters;

export class DivHarness extends ComponentHarness {
  public static hostSelector = 'div';

  /**
   * Get Harness with the given filter.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: DivHarnessFilters = {}): HarnessPredicate<DivHarness> {
    return new HarnessPredicate(DivHarness, options);
  }

  public childLocatorFor<T extends ComponentHarness>(query: HarnessQuery<T>): AsyncFactoryFn<T> {
    return this.locatorFor(query);
  }

  public childLocatorForAll<T extends ComponentHarness>(query: HarnessQuery<T>): AsyncFactoryFn<T[]> {
    return this.locatorForAll(query);
  }

  public async getText(): Promise<string> {
    const hostText = await (await this.host()).text();
    return hostText;
  }
}
