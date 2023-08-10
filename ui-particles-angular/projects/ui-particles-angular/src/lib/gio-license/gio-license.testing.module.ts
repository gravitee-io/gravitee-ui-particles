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
import { NgModule } from '@angular/core';
import { of } from 'rxjs';

import { GioLicenseService, LicenseConfiguration } from './gio-license.service';

export const LICENSE_CONFIGURATION_TESTING: LicenseConfiguration = {
  resourceURL: 'https://url.test:3000/license',
  trialResourceURL: 'https://url.test:3000/trial',
  utmSource: 'oss_utm_source_test',
  utmCampaign: 'oss_utm_campaign_test',
  featureInfoData: {
    foobar: {
      image: 'assets/gio-icons.svg',
      description: 'Foobar feature description',
      title: 'FOOBAR',
    },
  },
};

@NgModule({
  imports: [],
  providers: [
    {
      provide: 'LicenseConfiguration',
      useValue: LICENSE_CONFIGURATION_TESTING,
    },
    {
      provide: GioLicenseService,
      useValue: {
        isMissingFeature$: () => of(true),
        getFeatureInfo: () => ({}),
        getTrialURL: () => '',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        openDialog: () => {},
      },
    },
  ],
})
export class GioLicenseTestingModule {
  public static with(license: boolean) {
    return {
      ngModule: GioLicenseTestingModule,
      providers: [
        {
          provide: 'LicenseConfiguration',
          useValue: LICENSE_CONFIGURATION_TESTING,
        },
        {
          provide: GioLicenseService,
          useValue: {
            isMissingFeature$: () => of(!license),
            getFeatureInfo: () => ({}),
            getTrialURL: () => '',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            openDialog: () => {},
          },
        },
      ],
    };
  }
}
