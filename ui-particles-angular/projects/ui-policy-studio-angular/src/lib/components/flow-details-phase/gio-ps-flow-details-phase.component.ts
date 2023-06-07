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

import { ConnectorInfo, Step } from '../../models';

type StepVM =
  | {
      type: 'connectors';
      connectors: {
        name?: string;
        icon?: string;
      }[];
    }
  | {
      type: 'policy';
      step?: Step;
    };

@Component({
  selector: 'gio-ps-flow-details-phase',
  templateUrl: './gio-ps-flow-details-phase.component.html',
  styleUrls: ['./gio-ps-flow-details-phase.component.scss'],
})
export class GioPolicyStudioDetailsPhaseComponent implements OnChanges {
  @Input()
  public steps?: Step[] = undefined;

  @Input()
  public name!: string;

  @Input()
  public description!: string;

  @Input()
  public startConnector: ConnectorInfo[] = [];

  @Input()
  public endConnector: ConnectorInfo[] = [];

  public stepsVM: StepVM[] = [];

  public isDisabled = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.steps || changes.startConnector || changes.endConnector) {
      this.stepsVM = [
        {
          type: 'connectors',
          connectors: this.startConnector.map(connector => ({
            name: connector.name,
            icon: connector.icon,
          })),
        },

        ...(this.steps ?? []).map(step => ({
          type: 'policy' as const,
          step: step,
        })),

        {
          type: 'connectors',
          connectors: this.endConnector.map(connector => ({
            name: connector.name,
            icon: connector.icon,
          })),
        },
      ];

      // Disable phase if there are not start & end connectors
      this.isDisabled = this.stepsVM.filter(step => step.type === 'connectors' && !isEmpty(step.connectors)).length < 2;
    }
  }
}
