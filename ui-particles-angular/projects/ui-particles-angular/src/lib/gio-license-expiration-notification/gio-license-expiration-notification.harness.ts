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

import { ComponentHarness } from '@angular/cdk/testing';

export class GioLicenseExpirationNotificationHarness extends ComponentHarness {
  public static hostSelector = 'gio-license-expiration-notification';

  protected getTitleContainer = this.locatorFor('.status__title');
  protected getTitleMessage = this.locatorFor('.status__title__text');
  protected getCallToActionMessage = this.locatorFor('.status__action__text');
  protected getCallToActionLink = this.locatorFor('.status__action');

  public async getTitleText(): Promise<string> {
    return this.getTitleMessage().then(el => el.text());
  }

  public async isCallToActionVisible(): Promise<boolean> {
    return this.getCallToActionLink()
      .then(_ => true)
      .catch(_ => false);
  }

  public async getCallToActionText(): Promise<string> {
    return this.getCallToActionMessage().then(el => el.text());
  }

  public async getLink(): Promise<string | null> {
    return this.getCallToActionLink().then(el => el.getAttribute('href'));
  }

  public async isColor(color: string): Promise<boolean> {
    return this.getTitleContainer().then(el => el.hasClass(color));
  }
}
