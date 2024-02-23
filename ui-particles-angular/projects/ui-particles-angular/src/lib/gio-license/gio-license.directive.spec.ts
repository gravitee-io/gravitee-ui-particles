/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GioLicenseTestingModule } from './gio-license.testing.module';
import { LicenseOptions } from './gio-license.service';
import { GioLicenseModule } from './gio-license.module';

@Component({ template: `<div [gioLicense]="license" (click)="onClick()">A Content</div>` })
class TestLicenseComponent {
  @Input()
  public license: LicenseOptions = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick() {}
}

describe('GioLicenseDirective', () => {
  let fixture: ComponentFixture<TestLicenseComponent>;
  let component: TestLicenseComponent;
  function prepareTestLicenseComponent(licenseOptions: LicenseOptions, license: boolean) {
    fixture = TestBed.configureTestingModule({
      declarations: [TestLicenseComponent],
      imports: [HttpClientTestingModule, GioLicenseModule, GioLicenseTestingModule.with(license)],
    }).createComponent(TestLicenseComponent);
    component = fixture.componentInstance;
    component.license = licenseOptions;
    fixture.detectChanges();
  }

  describe('Override click & open dialog', () => {
    it('should override click if license not allowed', () => {
      prepareTestLicenseComponent({ feature: 'foobar' }, false);
      const onClickSpy = jest.spyOn(component, 'onClick');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('div');
      element.click();

      expect(onClickSpy).toHaveBeenCalledTimes(0);
    });

    it('should override click if plugin is not deployed', () => {
      prepareTestLicenseComponent({ feature: 'foobar', deployed: false }, true);
      const onClickSpy = jest.spyOn(component, 'onClick');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('div');
      element.click();

      expect(onClickSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Not override click & not open dialog', () => {
    it('should not override click if license is allowed', () => {
      prepareTestLicenseComponent({ feature: 'foobar' }, true);
      const onClickSpy = jest.spyOn(component, 'onClick');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('div');
      element.click();

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not override click if plugin is deployed', () => {
      prepareTestLicenseComponent({ feature: 'foobar', deployed: true }, false);
      const onClickSpy = jest.spyOn(component, 'onClick');
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('div');
      element.click();

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
