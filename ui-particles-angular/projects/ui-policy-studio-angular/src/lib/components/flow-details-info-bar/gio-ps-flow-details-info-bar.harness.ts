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

import { ComponentHarness, parallel } from '@angular/cdk/testing';
import { DivHarness, SpanHarness } from '@gravitee/ui-particles-angular/testing';

export class GioPolicyStudioDetailsInfoBarHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-details-info-bar';

  public async getInfos(): Promise<Record<string, (string | null)[]>> {
    const infosDiv = await this.locatorForAll(DivHarness.with({ selector: '.info' }))();

    const allKeyValue = await parallel(() =>
      infosDiv.map(async info => {
        const label = await info.childLocatorFor(SpanHarness.with({ selector: '.info__label' }))();
        const value = await info.childLocatorForAll(SpanHarness.with({ selector: '.info__value' }))();
        return { label: await label.getText(), value: await parallel(() => value.map(v => v.getText())) };
      }),
    );

    return allKeyValue.reduce(
      (acc, curr) => {
        if (curr.label) {
          return { ...acc, [curr.label]: curr.value };
        }
        return acc;
      },
      {} as Record<string, (string | null)[]>,
    );
  }
}
