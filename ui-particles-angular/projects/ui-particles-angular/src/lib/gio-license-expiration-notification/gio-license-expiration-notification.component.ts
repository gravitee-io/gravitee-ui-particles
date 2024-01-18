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
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'gio-license-expiration-notification',
  templateUrl: './gio-license-expiration-notification.component.html',
  styleUrls: ['./gio-license-expiration-notification.component.scss'],
})
export class GioLicenseExpirationNotificationComponent implements OnInit, OnChanges {
  @Input()
  public expirationDate: Date | undefined;

  @Input()
  public showCallToAction = true;

  @Input()
  public callToActionMessage: string | undefined;

  @Input()
  public link: string | undefined;

  @Input()
  public inError = false;

  public title = '';
  public daysRemaining = 0;
  public statusColor = 'blue';

  public ngOnInit(): void {
    if (!this.expirationDate) {
      return;
    }

    if (this.inError) {
      this.title = "There's an issue with your license";
      return;
    }

    const timeRemaining = this.transformDateWithoutHours(this.expirationDate) - this.transformDateWithoutHours(new Date());
    this.daysRemaining = timeRemaining / (1000 * 3600 * 24);

    if (this.daysRemaining <= 0) {
      this.title = 'Your license has expired';
      this.statusColor = 'red';
    } else {
      this.title = `Your license will expire in ${this.daysRemaining} day${this.daysRemaining === 1 ? '' : 's'}`;
      this.statusColor = this.daysRemaining > 5 ? 'blue' : 'orange';
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.expirationDate) {
      this.ngOnInit();
    }
  }

  private transformDateWithoutHours(date: Date): number {
    return new Date(date.toDateString()).valueOf();
  }
}
