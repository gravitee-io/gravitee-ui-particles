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

import { DivHarness } from '../../../testing';

export class GioPolicyStudioFlowsMenuHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flows-menu';

  private locateFlowsGroups = this.locatorForAll(DivHarness.with({ selector: '.list__flowsGroup' }));

  public async getAllFlowsGroups(): Promise<
    {
      name: string;
    }[]
  > {
    const flowsGroups = await this.locateFlowsGroups();

    return parallel(() =>
      flowsGroups.map(async flowGroup => {
        const flowGroupName = await flowGroup
          .childLocatorFor(DivHarness.with({ selector: '.list__flowsGroup__header__label' }))()
          .then(div => div.getText());

        return {
          name: flowGroupName,
        };
      }),
    );
  }
}
