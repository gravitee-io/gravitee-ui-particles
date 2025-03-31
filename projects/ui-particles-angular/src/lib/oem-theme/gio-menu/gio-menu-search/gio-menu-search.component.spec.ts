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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';

import { GioMenuModule } from '../gio-menu.module';

import { GioMenuSearchHarness } from './gio-menu-search.harness';
import { GioMenuSearchService } from './gio-menu-search.service';

@Component({
  template: ` <gio-menu-search *ngIf="menuItems"></gio-menu-search> `,
  standalone: false,
})
class TestComponent {
  public menuItems = [
    { name: 'Apis', routerLink: '/apis', category: 'Apis' },
    { name: 'Configuration', routerLink: '/apis/:apiId', category: 'Apis' },
    { name: 'General', routerLink: '/apis/:apiId/', category: 'Apis' },
    { name: 'Settings', routerLink: '/apis/:apiId/v4/runtime-logs-settings', category: 'Apis' },
    { name: 'Settings', routerLink: '/organization/settings', category: 'Organizations' },
    { name: 'Settings', routerLink: '/settings', category: 'Environment' },
  ];

  constructor(private readonly gioMenuSearchService: GioMenuSearchService) {
    this.gioMenuSearchService.addMenuSearchItems(this.menuItems);
  }
}

describe('GioMenuSearchComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let harness: GioMenuSearchHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, HttpClientTestingModule, GioMenuModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    harness = await loader.getHarness(GioMenuSearchHarness);
  });

  it('should not display any options when the input is empty', async () => {
    expect(await harness.getSearchValue()).toStrictEqual('');
    expect(await harness.isAutoCompletePanelVisible()).toBeFalsy();
  });

  it('should display `settings` options', async () => {
    await harness.setSearchValue('settings');

    expect(await harness.getFilteredOptions()).toStrictEqual(['SettingsApis', 'SettingsOrganizations', 'SettingsEnvironment']);
  });
});
