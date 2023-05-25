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
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { capitalize } from 'lodash';

import { ApiType, Flow } from './models';

export interface ConnectorsInfo {
  type: string;
  icon: string;
}

@Component({
  selector: 'gio-policy-studio',
  templateUrl: './gio-policy-studio.component.html',
  styleUrls: ['./gio-policy-studio.component.scss'],
})
export class GioPolicyStudioComponent implements OnChanges {
  @Input()
  public apiType!: ApiType;

  /**
   * List of entrypoints to display
   */
  @Input()
  public entrypointsInfo: ConnectorsInfo[] = [];

  /**
   * List of endpoints to display
   */
  @Input()
  public endpointsInfo: ConnectorsInfo[] = [];

  @Input()
  public flows: Flow[] = [];

  public connectorsTooltip = '';

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.entrypointsInfo || changes.endpointsInfo) {
      this.connectorsTooltip = `Entrypoints: ${this.entrypointsInfo
        .map(e => capitalize(e.type))
        .join(', ')}\nEndpoints: ${this.endpointsInfo.map(e => capitalize(e.type)).join(', ')}`;
    }
  }
}
