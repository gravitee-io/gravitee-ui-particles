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
import { Component, Directive, Input } from '@angular/core';

export type GioBannerTypes = 'error' | 'info' | 'success' | 'warning';

@Component({
  selector: 'gio-banner',
  templateUrl: './gio-banner.component.html',
  styleUrls: ['./gio-banner.component.scss'],
})
export class GioBannerComponent {
  @Input()
  public type: GioBannerTypes = 'info';

  @Input()
  public icon?: string;
}

@Directive({
  selector: '[gioBannerBody]',
})
export class GioBannerBodyDirective {}

@Directive({
  selector: '[gioBannerAction]',
})
export class GioBannerActionDirective {}

@Component({
  selector: 'gio-banner-error',
  templateUrl: './gio-banner.component.html',
  styleUrls: ['./gio-banner.component.scss'],
})
export class GioBannerErrorComponent extends GioBannerComponent {
  public type = 'error' as GioBannerTypes;
  public icon = 'gio:chat-bubble-error';
}

@Component({
  selector: 'gio-banner-info',
  templateUrl: './gio-banner.component.html',
  styleUrls: ['./gio-banner.component.scss'],
})
export class GioBannerInfoComponent extends GioBannerComponent {
  public type = 'info' as GioBannerTypes;
  public icon = 'gio:chat-lines';
}

@Component({
  selector: 'gio-banner-success',
  templateUrl: './gio-banner.component.html',
  styleUrls: ['./gio-banner.component.scss'],
})
export class GioBannerSuccessComponent extends GioBannerComponent {
  public type = 'success' as GioBannerTypes;
  public icon = 'gio:chat-bubble-check';
}

@Component({
  selector: 'gio-banner-warning',
  templateUrl: './gio-banner.component.html',
  styleUrls: ['./gio-banner.component.scss'],
})
export class GioBannerWarningComponent extends GioBannerComponent {
  public type = 'warning' as GioBannerTypes;
  public icon = 'gio:chat-bubble-warning';
}
