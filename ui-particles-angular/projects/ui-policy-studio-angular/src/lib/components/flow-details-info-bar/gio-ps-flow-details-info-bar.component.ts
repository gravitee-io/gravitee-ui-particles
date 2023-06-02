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
import { Component, Input } from '@angular/core';

import { FlowVM } from '../../gio-policy-studio.model';
import { ChannelSelector, ConditionSelector, ConnectorsInfo, Operation } from '../../models';

@Component({
  selector: 'gio-ps-flow-details-info-bar',
  templateUrl: './gio-ps-flow-details-info-bar.component.html',
  styleUrls: ['./gio-ps-flow-details-info-bar.component.scss'],
})
export class GioPolicyStudioDetailsInfoBarComponent {
  @Input()
  public flow?: FlowVM = undefined;

  @Input()
  public entrypointsInfo: ConnectorsInfo[] = [];

  public get operations(): string[] | undefined {
    if (!this.flow) {
      return [];
    }
    const operationToBadge: Record<Operation, string> = {
      PUBLISH: 'PUB',
      SUBSCRIBE: 'SUB',
    };
    const channelSelector = this.flow.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    return channelSelector?.operations?.map(o => operationToBadge[o]).sort();
  }

  public get channel(): string | undefined {
    if (!this.flow) {
      return undefined;
    }
    const channelSelector = this.flow.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    return channelSelector?.channel;
  }

  public get channelOperator(): string | undefined {
    if (!this.flow) {
      return undefined;
    }
    const channelSelector = this.flow.selectors?.find(s => s.type === 'CHANNEL') as ChannelSelector;
    return channelSelector?.channelOperator;
  }

  public get condition(): string | undefined {
    if (!this.flow) {
      return undefined;
    }
    const conditionSelector = this.flow.selectors?.find(s => s.type === 'CONDITION') as ConditionSelector;
    return conditionSelector?.condition;
  }
}
