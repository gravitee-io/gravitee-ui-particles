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
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GioLicenseExpirationNotificationModule } from './gio-license-expiration-notification.module';
import { GioLicenseExpirationNotificationHarness } from './gio-license-expiration-notification.harness';

describe('GioLicenseExpirationNotificationComponent', () => {
  @Component({
    template: `
      <div>
        <gio-license-expiration-notification
          [expirationDate]="expirationDate"
          [inError]="inError"
          [showCallToAction]="showCallToAction"
          [callToActionMessage]="callToActionMessage"
          [link]="link"
        ></gio-license-expiration-notification>
      </div>
    `,
  })
  class TestComponent {
    public expirationDate: Date = new Date();
    public inError = false;
    public showCallToAction = true;
    public callToActionMessage: string | undefined;
    public link: string | undefined;
  }

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioLicenseExpirationNotificationModule, NoopAnimationsModule, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('simple usage', () => {
    it('should load component', async () => {
      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(harness).toBeDefined();
    });

    it('should display expiration message', async () => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - 1);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getTitleText()).toEqual('Your license has expired');
    });

    it('should display expiration message when expires today', async () => {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 1);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getTitleText()).toEqual('Your license will expire today');
    });

    it('should display expiration message when expired today 1 minute ago', async () => {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() - 1);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getTitleText()).toEqual('Your license has expired');
    });

    it('should display countdown message', async () => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 10);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getTitleText()).toEqual('Your license will expire in 10 days');
    });

    it('should display call to action', async () => {
      component.showCallToAction = true;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.isCallToActionVisible()).toEqual(true);
    });

    it('should hide call to action', async () => {
      component.showCallToAction = false;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.isCallToActionVisible()).toEqual(false);
    });

    it('should use default call to action information', async () => {
      component.showCallToAction = true;
      component.link = undefined;
      component.callToActionMessage = undefined;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getLink()).toEqual('https://www.gravitee.io/contact-us-licence');
      expect(await harness.getCallToActionText()).toEqual('Contact Gravitee');
    });

    it('should use customize call to action information', async () => {
      component.showCallToAction = true;
      component.link = 'bubba';
      component.callToActionMessage = 'gump';
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getLink()).toEqual('bubba');
      expect(await harness.getCallToActionText()).toEqual('gump');
    });

    it('should show error state', async () => {
      component.inError = true;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 60);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.getTitleText()).toEqual("There's an issue with your license");
    });

    it('should not appear if expires in more than 30 days', async () => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 31);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      await harness
        .getTitleText()
        .then(_ => fail('The notification should not appear'))
        .catch(err => expect(err).toBeTruthy());
    });

    it('should be blue if expires in more than 5 days', async () => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 6);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.isColor('blue')).toEqual(true);
    });

    it('should be orange if expires in less than or equal to 5 days', async () => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 5);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.isColor('orange')).toEqual(true);
    });

    it('should be orange if expires today', async () => {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 1);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.isColor('orange')).toEqual(true);
    });

    it('should be red if expired', async () => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - 1);

      component.expirationDate = expirationDate;
      fixture.detectChanges();

      const harness = await loader.getHarness(GioLicenseExpirationNotificationHarness);
      expect(await harness.isColor('red')).toEqual(true);
    });
  });
});
