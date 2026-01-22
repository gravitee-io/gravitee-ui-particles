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
  FlowPhase,
  fromExecutionPhase,
  fromPolicyInput,
  GenericPolicy,
  Policy,
  PolicyDocumentationFetcher,
  PolicyInput,
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

const PROXY_REQUEST_PHASE: PolicyGroupVM = {
  name: 'Request phase',
  description: 'Policies will be applied during the connection establishment',
  startConnectorName: 'Incoming request',
  endConnectorName: 'Outgoing request',
};

const PROXY_RESPONSE_PHASE: PolicyGroupVM = {
  name: 'Response phase',
  description: 'Policies will be applied to the response from the initial connection.',
  startConnectorName: 'Incoming response',
  endConnectorName: 'Outgoing response',
};

const NATIVE_ENTRYPOINT_CONNECT_PHASE: PolicyGroupVM = {
  name: 'Entrypoint Connect phase',
  description: 'Policies will be applied when client connects to entrypoint before authentication and message processing',
  startConnectorName: 'Client',
  endConnectorName: 'Entrypoint',
};

@Component({
  selector: 'gio-policy-group-studio',
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
  public set policies(value: (PolicyInput | Policy)[]) {
    this._policies = value.map(fromPolicyInput);
  }
  public get policies(): Policy[] {
    return this._policies;
  }
  private _policies: Policy[] = [];

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
   * @deprecated Use `flowPhase` instead. To keep as long as we support APIM < 4.6
   */
  @Input()
  public set executionPhase(value: ExecutionPhase) {
    this.flowPhase = fromExecutionPhase(value);
  }

  /**
   * Execution phase targeted by the Policy Group Studio
   */
  @Input()
  public flowPhase!: FlowPhase;

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

  private phases: Record<`${ApiType}__${FlowPhase}`, PolicyGroupVM | null> = {
    // HTTP Proxy
    PROXY__REQUEST: PROXY_REQUEST_PHASE,
    PROXY__RESPONSE: PROXY_RESPONSE_PHASE,
    PROXY__PUBLISH: null, // n/a
    PROXY__SUBSCRIBE: null, // n/a
    PROXY__INTERACT: null, // n/a
    PROXY__ENTRYPOINT_CONNECT: null, // n/a
    // A2A Proxy
    A2A_PROXY__REQUEST: PROXY_REQUEST_PHASE,
    A2A_PROXY__RESPONSE: PROXY_RESPONSE_PHASE,
    A2A_PROXY__PUBLISH: null, // n/a
    A2A_PROXY__SUBSCRIBE: null, // n/a
    A2A_PROXY__INTERACT: null, // n/a
    A2A_PROXY__ENTRYPOINT_CONNECT: null, // n/a
    // LLM Proxy
    LLM_PROXY__REQUEST: PROXY_REQUEST_PHASE,
    LLM_PROXY__RESPONSE: PROXY_RESPONSE_PHASE,
    LLM_PROXY__PUBLISH: null, // n/a
    LLM_PROXY__SUBSCRIBE: null, // n/a
    LLM_PROXY__INTERACT: null, // n/a
    LLM_PROXY__ENTRYPOINT_CONNECT: null, // n/a
    // MCP Proxy
    MCP_PROXY__REQUEST: PROXY_REQUEST_PHASE,
    MCP_PROXY__RESPONSE: PROXY_RESPONSE_PHASE,
    MCP_PROXY__PUBLISH: null, // n/a
    MCP_PROXY__SUBSCRIBE: null, // n/a
    MCP_PROXY__INTERACT: null, // n/a
    MCP_PROXY__ENTRYPOINT_CONNECT: null, // n/a
    // HTTP Message
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
    MESSAGE__PUBLISH: {
      name: 'Publish phase',
      description: 'Policies will be applied on messages sent to the endpoint',
      startConnectorName: 'Incoming message request',
      endConnectorName: 'Outgoing message request',
    },
    MESSAGE__SUBSCRIBE: {
      name: 'Subscribe phase',
      description: 'Policies will be applied on messages received by the entrypoint',
      startConnectorName: 'Incoming message response',
      endConnectorName: 'Outgoing message response',
    },
    MESSAGE__INTERACT: null, // n/a
    MESSAGE__ENTRYPOINT_CONNECT: null, // n/a
    // NATIVE
    NATIVE__INTERACT: null, // n/a
    NATIVE__PUBLISH: null, // n/a
    NATIVE__SUBSCRIBE: null, // n/a
    NATIVE__REQUEST: null, // n/a
    NATIVE__RESPONSE: null, // n/a
    NATIVE__ENTRYPOINT_CONNECT: NATIVE_ENTRYPOINT_CONNECT_PHASE,
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
      this.genericPolicies = toGenericPolicies(this._policies);
    }
    if (changes.executionPhase || changes.flowPhase) {
      this.policyGroupVM = this.phases[`${this.apiType}__${this.flowPhase}`] ?? undefined;
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
