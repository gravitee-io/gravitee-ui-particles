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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { apimPolicies } from '../testing';
import { GioPolicyStudioComponent } from './gio-policy-studio.component';
import { GioPolicyStudioModule } from './gio-policy-studio.module';

describe('UiPolicyStudioComponent', () => {
  let component: GioPolicyStudioComponent;
  let fixture: ComponentFixture<GioPolicyStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GioPolicyStudioModule.forSpecs()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GioPolicyStudioComponent);
    component = fixture.componentInstance;
    component.policies = apimPolicies.data as any;
    fixture.detectChanges();
  });

  it('should display policies in right column', () => {
    expect(component).toBeTruthy();

    const policiesGroupsIds = [
      ...fixture.nativeElement
        .querySelector('gv-policy-studio')
        .shadowRoot.querySelector('#design > gv-policy-studio-menu')
        .shadowRoot.querySelectorAll('div.box > div.content.expandable')
        .values(),
    ].map(el => el.id);

    expect(policiesGroupsIds).toEqual(['security', 'performance', 'transformation', 'others']);
  });
});
