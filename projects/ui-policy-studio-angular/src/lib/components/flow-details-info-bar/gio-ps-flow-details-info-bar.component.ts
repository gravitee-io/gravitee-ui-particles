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
import { isEmpty } from 'lodash';
import { GioIconsModule } from '@gravitee/ui-particles-angular';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

import { ChannelSelector, ConditionSelector, ConnectorInfo, HttpSelector, Operation } from '../../models';
import { FlowVM } from '../../policy-studio/gio-policy-studio.model';

@Component({
  imports: [CommonModule, GioIconsModule, MatCommonModule],
  selector: 'gio-ps-flow-details-info-bar',
  templateUrl: './gio-ps-flow-details-info-bar.component.html',
  styleUrls: ['./gio-ps-flow-details-info-bar.component.scss'],
})
export class GioPolicyStudioDetailsInfoBarComponent implements OnChanges {
  @Input()
  public flow?: FlowVM = undefined;

  @Input()
  public entrypointsInfo?: ConnectorInfo[];

  private _methods?: { name: string; class: string }[] | null;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['flow']) {
      // Invalidate cache when flow changes
      this._methods = undefined;
    }
  }

  public get condition(): string | undefined {
    const conditionSelector = this.flow?.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;
    if (!conditionSelector) {
      return undefined;
    }
    return conditionSelector?.condition;
  }

  // MESSAGE API type

  public get operations(): string[] | undefined {
    const channelSelector = this.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    if (!channelSelector) {
      return undefined;
    }
    const operationToBadge: Record<Operation, string> = {
      PUBLISH: 'PUB',
      SUBSCRIBE: 'SUB',
    };
    // If no operations are selected, all operations are valid
    const operations =
      !channelSelector.operations || isEmpty(channelSelector.operations) ? (['PUBLISH', 'SUBSCRIBE'] as const) : channelSelector.operations;

    return operations.map(o => operationToBadge[o]).sort();
  }

  public get channel(): string | undefined {
    const channelSelector = this.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    if (!channelSelector) {
      return undefined;
    }
    return channelSelector?.channel;
  }

  public get channelOperator(): string | undefined {
    const channelSelector = this.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    if (!channelSelector) {
      return undefined;
    }
    return channelSelector?.channelOperator;
  }

  public get entrypoints(): ConnectorInfo[] | undefined {
    const channelSelector = this.flow?.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    if (!channelSelector) {
      return undefined;
    }

    return this.entrypointsInfo?.filter(
      e =>
        // If no entrypoints are selected, all entrypoints are valid
        !channelSelector.entrypoints || isEmpty(channelSelector.entrypoints) || channelSelector.entrypoints?.includes(e.type),
    );
  }

  // PROXY API type

  public get path(): string | undefined {
    const httpSelector = this.flow?.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
    if (!httpSelector) {
      return undefined;
    }
    return httpSelector?.path;
  }

  public get pathOperator(): string | undefined {
    const httpSelector = this.flow?.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
    if (!httpSelector) {
      return undefined;
    }
    return httpSelector?.pathOperator;
  }

  get methods() {
      if (this._methods === undefined && this.flow) {
          const httpSelector = this.flow.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
          if (!httpSelector) {
              this._methods = null; // Cache null to avoid recomputation
              return undefined;
          }
          this._methods = httpSelector?.methods?.length
              ? httpSelector.methods.map(m => ({ name: m, class: `gio-method-badge-${m.toLowerCase()}` }))
              : [{ name: 'ALL', class: 'gio-badge-neutral' }];
      }
      return this._methods === null ? undefined : this._methods;
  }
}
