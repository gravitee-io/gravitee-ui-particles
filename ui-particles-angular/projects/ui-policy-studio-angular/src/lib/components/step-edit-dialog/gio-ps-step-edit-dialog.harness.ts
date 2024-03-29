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

import { GioPolicyStudioStepFormHarness } from '../step-form/gio-ps-step-form.harness';

export class GioPolicyStudioStepEditDialogHarness extends ComponentHarness {
  public static hostSelector = 'gio-ps-step-edit-dialog';

  public async getPolicyName(): Promise<string> {
    return (await this.locatorFor('.title__name')()).text();
  }

  public async getStepForm(): Promise<GioPolicyStudioStepFormHarness> {
    return await this.locatorFor(GioPolicyStudioStepFormHarness)();
  }

  public async save(): Promise<void> {
    return (await this.locatorFor('.actions__saveBtn')()).click();
  }
}
