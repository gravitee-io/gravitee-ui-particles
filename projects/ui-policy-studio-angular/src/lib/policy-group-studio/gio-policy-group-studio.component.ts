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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EMPTY } from 'rxjs';
import { GioFormJsonSchemaModule, GioLoaderModule } from '@gravitee/ui-particles-angular';

import { GioPolicyStudioDetailsPhaseComponent } from '../components/flow-details-phase/gio-ps-flow-details-phase.component';
import {
  ApiType,
  ConnectorInfo,
  ExecutionPhase,
  GenericPolicy,
  Policy,
  PolicyDocumentationFetcher,
  PolicySchemaFetcher,
  Step,
  toGenericPolicies,
} from '../models';
import { GioPolicyStudioService } from '../policy-studio/gio-policy-studio.service';

export type PolicyGroupOutput = Step[];
export type PolicyGroupInput = Step[];

type PolicyGroupVM = {
  name: string;
  description: string;
  startConnectorName: string;
  endConnectorName: string;
};

@Component({
  selector: 'gio-policy-group-studio',
  standalone: true,
  imports: [GioPolicyStudioDetailsPhaseComponent, GioFormJsonSchemaModule, GioLoaderModule],
  templateUrl: './gio-policy-group-studio.component.html',
  styleUrl: './gio-policy-group-studio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GioPolicyGroupStudioComponent implements OnChanges {
  /**
   * List of policies usable in the studio
   */
  @Input({
    transform: (policies: unknown) => policies ?? [],
  })
  public policies: Policy[] = [];

  /**
   * Whether the Policy Group Studio is in read-only mode
   */
  @Input()
  public readOnly = false;

  /**
   * Type of the API targeted by the Policy Group Studio
   */
  @Input({ required: true })
  public apiType!: ApiType;

  /**
   * Execution phase targeted by the Policy Group Studio
   */
  @Input({ required: true })
  public executionPhase!: ExecutionPhase;

  /**
   * Called when Policy Group Studio needs to fetch the policy schema
   * @returns Observable of the policy schema
   */
  @Input({ required: true })
  public policySchemaFetcher: PolicySchemaFetcher = () => EMPTY;

  /**
   * Called when Policy Group Studio needs to fetch the policy documentation
   * @returns Observable of the policy documentation
   */
  @Input({ required: true })
  public policyDocumentationFetcher: PolicyDocumentationFetcher = () => EMPTY;

  @Input()
  public policyGroup: PolicyGroupInput = [];

  /**
   * Output event when the Policy Group Studio changes
   */
  @Output()
  public policyGroupChange: EventEmitter<PolicyGroupOutput> = new EventEmitter<PolicyGroupOutput>();

  protected isLoading = true;
  protected createStartConnector: (name: string) => ConnectorInfo[] = name => [
    {
      name,
      icon: 'gio:arrow-right',
      type: 'start',
      supportedModes: [],
    },
  ];
  protected createEndConnector: (name: string) => ConnectorInfo[] = name => [
    {
      name,
      icon: 'gio:arrow-right',
      type: 'end',
      supportedModes: [],
    },
  ];
  protected policyGroupVM?: PolicyGroupVM;
  protected steps: Step[] = [];
  protected trialUrl: string | undefined;
  protected genericPolicies: GenericPolicy[] = [];
  protected startConnector: ConnectorInfo[] = [];
  protected endConnector: ConnectorInfo[] = [];

  private phases: Record<`${ApiType}__${ExecutionPhase}`, PolicyGroupVM | null> = {
    PROXY__REQUEST: {
      name: 'Request phase',
      description: 'Policies will be applied during the connection establishment',
      startConnectorName: 'Incoming request',
      endConnectorName: 'Outgoing request',
    },
    PROXY__RESPONSE: {
      name: 'Response phase',
      description: 'Policies will be applied to the response from the initial connection.',
      startConnectorName: 'Incoming response',
      endConnectorName: 'Outgoing response',
    },
    PROXY__MESSAGE_REQUEST: null, // n/a
    PROXY__MESSAGE_RESPONSE: null, // n/a
    MESSAGE__REQUEST: {
      name: 'Request phase',
      description: 'Policies will be applied during the connection establishment',
      startConnectorName: 'Incoming request',
      endConnectorName: 'Outgoing request',
    },
    MESSAGE__RESPONSE: {
      name: 'Response phase',
      description: 'Policies will be applied during the connection termination',
      startConnectorName: 'Incoming response',
      endConnectorName: 'Outgoing response',
    },
    MESSAGE__MESSAGE_REQUEST: {
      name: 'Publish phase',
      description: 'Policies will be applied on messages sent to the endpoint',
      startConnectorName: 'Incoming message request',
      endConnectorName: 'Outgoing message request',
    },
    MESSAGE__MESSAGE_RESPONSE: {
      name: 'Subscribe phase',
      description: 'Policies will be applied on messages received by the entrypoint',
      startConnectorName: 'Incoming message response',
      endConnectorName: 'Outgoing message response',
    },
  };

  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.policySchemaFetcher) {
      this.policyStudioService.setPolicySchemaFetcher(this.policySchemaFetcher);
    }

    if (changes.policyDocumentationFetcher) {
      this.policyStudioService.setPolicyDocumentationFetcher(this.policyDocumentationFetcher);
    }
    if (changes.policies) {
      this.isLoading = false;
      this.genericPolicies = toGenericPolicies(this.policies);
    }
    if (changes.executionPhase) {
      this.policyGroupVM = this.phases[`${this.apiType}__${this.executionPhase}`] ?? undefined;
      this.startConnector = this.createStartConnector(this.policyGroupVM?.startConnectorName ?? '');
      this.endConnector = this.createEndConnector(this.policyGroupVM?.endConnectorName ?? '');
    }
    if (changes.policyGroup) {
      this.steps = this.policyGroup;
    }
  }

  protected onStepsChange(steps: Step[]): void {
    this.steps = steps;
    this.policyGroupChange.emit(steps);
  }
}
