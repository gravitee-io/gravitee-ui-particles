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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';

import { LICENSE_CONFIGURATION_TESTING } from './gio-license.testing.module';
import { GioLicenseService, License } from './gio-license.service';

describe('GioLicenseService', () => {
  let httpTestingController: HttpTestingController;
  let gioLicenseService: GioLicenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        {
          provide: 'LicenseConfiguration',
          useValue: LICENSE_CONFIGURATION_TESTING,
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    gioLicenseService = TestBed.inject<GioLicenseService>(GioLicenseService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  const mockLicense: License = {
    tier: 'tier',
    packs: [],
    features: ['foobar'],
  };

  it('should call the API', done => {
    gioLicenseService.getLicense$().subscribe(response => {
      expect(response).toMatchObject(mockLicense);
      done();
    });

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `https://url.test:3000/license`,
    });

    req.flush(mockLicense);
  });

  it('should get license', done => {
    gioLicenseService
      .getLicense$()
      .pipe(
        switchMap(() => gioLicenseService.getLicense$()),
        tap(license => {
          expect(license).toMatchObject(mockLicense);
          done();
        }),
      )
      .subscribe();

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `https://url.test:3000/license`,
    });

    req.flush(mockLicense);
  });

  it('should check if feature is not missing', done => {
    gioLicenseService
      .isMissingFeature$({ feature: 'foobar' })
      .pipe(
        tap(isMissing => {
          expect(isMissing).toBeFalsy();
          done();
        }),
      )
      .subscribe();

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `https://url.test:3000/license`,
    });

    req.flush(mockLicense);
  });

  it('should check if feature is not missing with deployed plugin', done => {
    gioLicenseService
      .isMissingFeature$({ deployed: true })
      .pipe(
        tap(isMissing => {
          expect(isMissing).toBeFalsy();
          done();
        }),
      )
      .subscribe();
  });

  it('should check if feature is missing with deployed plugin', done => {
    gioLicenseService
      .isMissingFeature$({ deployed: false })
      .pipe(
        tap(isMissing => {
          expect(isMissing).toBeTruthy();
          done();
        }),
      )
      .subscribe();
  });

  it('should check if feature is missing', done => {
    gioLicenseService
      .isMissingFeature$({ feature: 'missing' })
      .pipe(
        tap(isMissing => {
          expect(isMissing).toBeTruthy();
          done();
        }),
      )
      .subscribe();

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `https://url.test:3000/license`,
    });

    req.flush(mockLicense);
  });

  it('should use isMissingFeature$ with undefined options', done => {
    gioLicenseService
      .isMissingFeature$(undefined)
      .pipe(
        tap(isMissing => {
          expect(isMissing).toBeFalsy();
          done();
        }),
      )
      .subscribe();
  });

  it('should get feature more information', () => {
    expect(gioLicenseService.getFeatureInfo({ feature: 'foobar' })).not.toBeNull();
  });

  it('should throw error when get more information with wrong feature', () => {
    expect(() => gioLicenseService.getFeatureInfo({ feature: 'bad' })).toThrow();
  });

  it('should return trial URL from UTM medium', () => {
    const expected =
      'https://url.test:3000/trial?utm_source=oss_utm_source_test&utm_medium=feature_debugmode_v2&utm_campaign=oss_utm_campaign_test';
    expect(gioLicenseService.getTrialURL({ feature: 'feature_debugmode_v2' })).toEqual(expected);
  });

  it('should return trial URL from UTM medium and UTM content', () => {
    const expected =
      'https://url.test:3000/trial?utm_source=oss_utm_source_test&utm_medium=feature_debugmode_v2&utm_campaign=oss_utm_campaign_test&utm_content=organization';
    expect(gioLicenseService.getTrialURL({ feature: 'feature_debugmode_v2', context: 'organization' })).toEqual(expected);
  });
});
