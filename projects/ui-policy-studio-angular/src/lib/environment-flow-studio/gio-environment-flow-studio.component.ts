/*
 * Copyright (C) 2024 The Gravitee team (http://gravitee.io)
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
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EMPTY } from 'rxjs';
import { GioFormJsonSchemaModule } from '@gravitee/ui-particles-angular';

import { GioPolicyStudioDetailsPhaseComponent } from '../components/flow-details-phase/gio-ps-flow-details-phase.component';
import { ApiType, ConnectorInfo, Policy, PolicyDocumentationFetcher, PolicySchemaFetcher, Step } from '../models';
import { GioPolicyStudioService } from '../policy-studio/gio-policy-studio.service';

export type EnvironmentFlowOutput = Step[];

@Component({
  selector: 'gio-environment-flow-studio',
  standalone: true,
  imports: [GioPolicyStudioDetailsPhaseComponent, GioFormJsonSchemaModule],
  templateUrl: './gio-environment-flow-studio.component.html',
  styleUrl: './gio-environment-flow-studio.component.scss',
})
export class GioEnvironmentFlowStudioComponent implements OnChanges {
  @Input()
  public policies: Policy[] = [];

  /**
   * Called when Environment-flow Studio needs to fetch the policy schema
   * @returns Observable of the policy schema
   */
  @Input()
  public policySchemaFetcher: PolicySchemaFetcher = () => EMPTY;

  /**
   * Called when Environment-flow Studio needs to fetch the policy documentation
   * @returns Observable of the policy documentation
   */
  @Input()
  public policyDocumentationFetcher: PolicyDocumentationFetcher = () => EMPTY;

  @Output()
  public environmentFlowChange: EventEmitter<EnvironmentFlowOutput> = new EventEmitter<EnvironmentFlowOutput>();

  protected readOnly = false;
  protected startConnector: ConnectorInfo[] = [
    {
      name: 'Incoming request',
      icon: 'gio:arrow-right',
      type: 'start',
      supportedModes: ['REQUEST_RESPONSE'],
    },
  ];
  protected endConnector: ConnectorInfo[] = [
    {
      name: 'Outgoing request',
      icon: 'gio:arrow-right',
      type: 'end',
      supportedModes: ['REQUEST_RESPONSE'],
    },
  ];
  protected steps: Step[] = [];
  protected apiType: ApiType = 'MESSAGE';
  protected trialUrl: string | undefined;

  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.policySchemaFetcher) {
      this.policyStudioService.setPolicySchemaFetcher(this.policySchemaFetcher);
    }

    if (changes.policyDocumentationFetcher) {
      this.policyStudioService.setPolicyDocumentationFetcher(this.policyDocumentationFetcher);
    }
  }

  protected onStepsChange(flowPhase: 'request' | 'response' | 'publish' | 'subscribe', steps: Step[]): void {
    this.steps = steps;
    this.environmentFlowChange.emit(steps);
  }
}
