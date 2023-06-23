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
import { ChannelSelector, ConditionSelector, ConnectorInfo, HttpSelector, Operation } from '../../models';

@Component({
  selector: 'gio-ps-flow-details-info-bar',
  templateUrl: './gio-ps-flow-details-info-bar.component.html',
  styleUrls: ['./gio-ps-flow-details-info-bar.component.scss'],
})
export class GioPolicyStudioDetailsInfoBarComponent {
  @Input()
  public flow?: FlowVM = undefined;

  @Input()
  public entrypointsInfo?: ConnectorInfo[];

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
    return channelSelector?.operations?.map(o => operationToBadge[o]).sort();
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

  public get methods(): { name: string; class: string }[] | undefined {
    const httpSelector = this.flow?.selectors?.find(s => s.type === 'HTTP') as HttpSelector;
    if (!httpSelector) {
      return undefined;
    }
    return httpSelector?.methods?.length
      ? httpSelector?.methods.map(m => ({
          name: m,
          class: `gio-method-badge-${m.toLowerCase()}`,
        }))
      : [
          {
            name: 'ALL',
            class: 'gio-badge-neutral',
          },
        ];
  }
}
