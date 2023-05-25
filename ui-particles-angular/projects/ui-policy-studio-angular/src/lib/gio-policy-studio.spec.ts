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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { SimpleChange } from '@angular/core';

import { GioPolicyStudioModule } from './gio-policy-studio.module';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';

describe('GioPolicyStudioModule', () => {
  let loader: HarnessLoader;
  let component: GioPolicyStudioComponent;
  let fixture: ComponentFixture<GioPolicyStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GioPolicyStudioModule, MatIconTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GioPolicyStudioComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    component.apiType = 'MESSAGE';
    fixture.detectChanges();
  });

  it('should display api info', async () => {
    component.entrypointsInfo = [
      {
        type: 'webhook',
        icon: 'gio:webhook',
      },
    ];
    component.endpointsInfo = [
      {
        type: 'kafka',
        icon: 'gio:kafka',
      },
    ];
    component.ngOnChanges({
      entrypointsInfo: new SimpleChange(null, null, true),
      endpointsInfo: new SimpleChange(null, null, true),
    });
    fixture.detectChanges();

    const tooltip = await loader.getHarness(
      MatTooltipHarness.with({ selector: '[mattooltipclass="gio-policy-studio__tooltip-line-break"]' }),
    );
    await tooltip.show();
    expect(await tooltip.getTooltipText()).toEqual(`Entrypoints: Webhook\nEndpoints: Kafka`);
  });
});
