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
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { has, isEmpty } from 'lodash';

import { GioLicenseDialogComponent, GioLicenseDialogData } from './gio-license-dialog/gio-license-dialog.component';

export type License = {
  tier: string;
  packs: Array<string>;
  features: Array<string>;
  expiresAt?: Date;
  scope?: string;
  isExpired?: boolean;
};

export interface LicenseConfiguration {
  resourceURL: string;
  featureInfoData: Record<string, FeatureInfo>;
  trialResourceURL: string;
  utmSource?: string;
  utmCampaign?: string;
}

export interface UTM {
  source: string;
  medium: string;
  campaign: string;
}

export type LicenseOptionsBase = {
  // We used feature name as utm_medium
  feature?: string;
  // Optional, useful if need a context in utm campaign (utm_content)
  context?: string;
};

export type LicensePluginOptions = LicenseOptionsBase & {
  // When is deployed, the plugin is included in license
  deployed: boolean;
};

export type LicenseOptions = LicenseOptionsBase | LicensePluginOptions;

export const isLicensePluginOptions = (licenseOptions: LicenseOptions): licenseOptions is LicensePluginOptions =>
  has(licenseOptions, 'deployed');

export interface FeatureInfo {
  image?: string;
  description?: string;
  title?: string;
  trialButtonLabel?: string;
  hideDays?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GioLicenseService {
  private readonly loadLicense$: Observable<License>;

  constructor(
    private readonly http: HttpClient,
    @Inject('LicenseConfiguration')
    private readonly licenseConfiguration: LicenseConfiguration,
    private readonly matDialog: MatDialog,
  ) {
    this.loadLicense$ = this.http.get<License>(licenseConfiguration.resourceURL).pipe(shareReplay(1));
  }

  public getLicense$(): Observable<License> {
    return this.loadLicense$;
  }

  public isMissingFeature$(feature: string | undefined): Observable<boolean> {
    if (feature == null) {
      return of(false);
    }
    return this.isExpired$().pipe(
      switchMap(isExpired => {
        if (isExpired) {
          return of(isExpired);
        }
        return this.getLicense$().pipe(map(license => license == null || !license.features.some(feat => feat === feature)));
      }),
    );
  }

  public hasAllFeatures$(licenseOptions: LicenseOptions[] | undefined): Observable<boolean> {
    if (!licenseOptions || isEmpty(licenseOptions)) {
      return of(true);
    }
    return this.isExpired$().pipe(
      switchMap(isExpired => {
        const featuresDefined = licenseOptions.some(o => !!o.feature);
        if (isExpired && featuresDefined) {
          return of(false);
        }
        return this.getLicense$().pipe(
          map(license => license != null && licenseOptions.every(o => license.features.some(feat => feat === o.feature))),
        );
      }),
    );
  }

  public getFeatureInfo(licenseOptions: LicenseOptions): FeatureInfo {
    if (!licenseOptions.feature) {
      throw new Error(`feature is undefined`);
    }
    const featureInfo = this.licenseConfiguration.featureInfoData[licenseOptions.feature];
    if (!featureInfo) {
      throw new Error(
        `Unknown Feature value ${licenseOptions.feature}. Expected one of ${Object.keys(this.licenseConfiguration.featureInfoData)}`,
      );
    }
    return featureInfo;
  }

  public getTrialURL(licenseOptions: LicenseOptions): string {
    if (!licenseOptions.feature) {
      throw new Error(`feature is undefined`);
    }
    const urlParams =
      this.licenseConfiguration.utmSource || this.licenseConfiguration.utmCampaign
        ? `?utm_source=${this.licenseConfiguration.utmSource}&utm_medium=${licenseOptions.feature}&utm_campaign=${this.licenseConfiguration.utmCampaign}`
        : '';
    const context = urlParams.length > 0 && licenseOptions.context ? `&utm_content=${licenseOptions.context}` : '';
    return `${this.licenseConfiguration.trialResourceURL}${urlParams}${context}`;
  }

  public isOEM$(): Observable<boolean> {
    return this.getLicense$().pipe(map(license => license !== null && license.features.includes('oem-customization')));
  }

  public isNativeKafka$(): Observable<boolean> {
    return this.getLicense$().pipe(map(license => license !== null && license.packs.includes('native-kafka')));
  }

  public openDialog(licenseOptions: LicenseOptions, event?: Event) {
    event?.stopPropagation();
    event?.preventDefault();
    const featureInfo = this.getFeatureInfo(licenseOptions);
    const trialURL = this.getTrialURL(licenseOptions);
    return this.matDialog
      .open<GioLicenseDialogComponent, GioLicenseDialogData, boolean>(GioLicenseDialogComponent, {
        data: {
          featureInfo,
          trialURL,
        },
        role: 'alertdialog',
        id: 'gioLicenseDialog',
      })
      .afterClosed()
      .subscribe();
  }

  public getExpiresAt$(): Observable<Date | undefined> {
    return this.getLicense$().pipe(map(license => (license.expiresAt ? new Date(license.expiresAt) : undefined)));
  }

  public isExpired$(): Observable<boolean> {
    return this.getLicense$().pipe(map(license => license?.isExpired === true));
  }
}
