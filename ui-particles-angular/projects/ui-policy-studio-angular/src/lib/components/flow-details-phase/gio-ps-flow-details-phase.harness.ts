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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { DivHarness, SpanHarness } from '@gravitee/ui-particles-angular/testing';
import { isEmpty } from 'lodash';

import { GioPolicyStudioDetailsPhasePolicyHarness } from '../flow-details-phase-policy/gio-ps-flow-details-phase-policy.harness';

export type PhaseType = 'REQUEST' | 'RESPONSE' | 'PUBLISH' | 'SUBSCRIBE';

export type GioPolicyStudioDetailsPhaseHarnessFilters = BaseHarnessFilters & {
  type?: PhaseType;
};

const TYPE_TO_TEXT: Record<PhaseType, string> = {
  REQUEST: 'Request phase',
  RESPONSE: 'Response phase',
  PUBLISH: 'Publish phase',
  SUBSCRIBE: 'Subscribe phase',
};

export class GioPolicyStudioDetailsPhaseHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-details-phase';

  private getHeaderName = () =>
    this.locatorForOptional(SpanHarness.with({ selector: '.header__name' }))().then(async span => span?.getText() ?? null);

  /**
   * Get Harness with the given filter.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioPolicyStudioDetailsPhaseHarnessFilters = {}): HarnessPredicate<GioPolicyStudioDetailsPhaseHarness> {
    return new HarnessPredicate(GioPolicyStudioDetailsPhaseHarness, options).addOption('type', options.type, async (harness, type) =>
      HarnessPredicate.stringMatches(harness.getHeaderName(), TYPE_TO_TEXT[type]),
    );
  }

  public async getSteps(): Promise<
    | {
        text: string;
        type: 'connector' | 'policy';
      }[]
    | null
  > {
    const stepsDiv = await this.locatorForAll(DivHarness.with({ selector: '.content__step' }))();

    if (isEmpty(stepsDiv)) {
      // No step - the phase is disabled
      return null;
    }

    return await parallel(() =>
      stepsDiv.map(async stepDiv => {
        const idConnector = !!(await stepDiv.getText({ childSelector: '.content__step__connectorBadge' }));
        if (idConnector) {
          return {
            text: (await stepDiv.getText()) ?? '',
            type: 'connector',
          };
        }

        return {
          text: await (await stepDiv.childLocatorFor(GioPolicyStudioDetailsPhasePolicyHarness)()).getName(),
          type: idConnector ? 'connector' : 'policy',
        };
      }),
    );
  }
}
