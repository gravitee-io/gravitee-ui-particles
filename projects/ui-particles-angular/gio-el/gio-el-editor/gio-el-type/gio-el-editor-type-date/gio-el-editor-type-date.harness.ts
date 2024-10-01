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
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';

import { GioElEditorTypeComponentHarness } from '../gio-el-editor-type.harness';

export class GioElEditorTypeDateHarness extends GioElEditorTypeComponentHarness {
  public static hostSelector = 'gio-el-editor-type-date';

  public async getValue(): Promise<string> {
    const datepickerInputHarness = await this.locatorFor(MatDatepickerInputHarness)();
    return await datepickerInputHarness.getValue();
  }

  public async setValue(value: Date): Promise<void> {
    const datepickerInputHarness = await this.locatorFor(MatDatepickerInputHarness)();
    await datepickerInputHarness.setValue(value.toISOString());
  }
}
