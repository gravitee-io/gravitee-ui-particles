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

import { ComponentHarness } from '@angular/cdk/testing';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';

import { GioPolicyStudioDetailsInfoBarHarness } from '../flow-details-info-bar/gio-ps-flow-details-info-bar.harness';

export class GioPolicyStudioDetailsHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-flow-details';

  public async isDisplayEmptyFlow(): Promise<boolean> {
    const hostText = await (await this.host()).text();
    return hostText.includes('No flows yet');
  }

  public async getFlowInfos(): Promise<Record<string, (string | null)[]>> {
    return await (await this.locatorFor(GioPolicyStudioDetailsInfoBarHarness)()).getInfos();
  }

  public async matchText(matcher: RegExp): Promise<boolean> {
    const hostText = await (await this.host()).text();
    return matcher.test(hostText);
  }

  public async clickEditFlowBtn(): Promise<void> {
    const editFlowBtn = await this.locatorFor(MatButtonHarness.with({ selector: '.header__configBtn__edit' }))();
    await editFlowBtn.click();
  }

  public async clickDeleteFlowBtn(): Promise<void> {
    const deleteFlowBtn = await this.locatorFor(MatButtonHarness.with({ selector: '.header__configBtn__delete' }))();
    await deleteFlowBtn.click();
  }
}
