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
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { isNil } from 'lodash';

import { FeatureInfo, GioLicenseService, isLicensePluginOptions, LicenseOptions, LicensePluginOptions } from './gio-license.service';
import { GioLicenseDialogComponent, GioLicenseDialogData } from './gio-license-dialog/gio-license-dialog.component';

@Directive({
  selector: '[gioLicense]',
})
export class GioLicenseDirective implements OnInit, OnDestroy {
  /**
   * The license to check. Must be defined when the directive is initialised, otherwise the value will not be taken into account.
   */
  @Input()
  public gioLicense?: LicenseOptions | LicensePluginOptions;

  private featureInfo: FeatureInfo = {};
  private trialURL = '';

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();
  private onClick = this.click.bind(this);

  constructor(
    private readonly licenseService: GioLicenseService,
    private readonly matDialog: MatDialog,
    private elRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    const gioLicense = this.gioLicense;

    // If the license is not defined, we do not need to check anything
    if (isNil(gioLicense)) {
      return;
    }

    this.isNotAllowed$(gioLicense)
      .pipe(
        tap(() => {
          this.elRef.nativeElement.removeEventListener('click', this.onClick, true);
        }),
        filter(notAllowed => notAllowed),
        map(() => this.licenseService.getFeatureInfo(gioLicense)),
        tap(featureInfo => {
          this.featureInfo = featureInfo;
          this.elRef.nativeElement.addEventListener('click', this.onClick, true);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();

    if (gioLicense.feature) {
      this.trialURL = this.licenseService.getTrialURL(gioLicense);
    }
  }

  private isNotAllowed$(gioLicense: LicenseOptions | LicensePluginOptions) {
    if (isLicensePluginOptions(gioLicense)) {
      return of(!gioLicense.deployed);
    }
    return this.licenseService.isMissingFeature$(gioLicense.feature);
  }

  public ngOnDestroy(): void {
    this.elRef.nativeElement.removeEventListener('click', this.onClick, true);
    this.unsubscribe$.next(false);
    this.unsubscribe$.unsubscribe();
  }

  private click($event: PointerEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    this.matDialog
      .open<GioLicenseDialogComponent, GioLicenseDialogData, boolean>(GioLicenseDialogComponent, {
        data: {
          featureInfo: this.featureInfo,
          trialURL: this.trialURL,
        },
        role: 'alertdialog',
        id: 'gioLicenseDialog',
      })
      .afterClosed()
      .subscribe();
    return false;
  }
}
