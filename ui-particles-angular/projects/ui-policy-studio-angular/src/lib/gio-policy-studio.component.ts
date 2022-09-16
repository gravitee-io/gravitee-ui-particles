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
import { chain, isNil } from 'lodash';
import { catchError, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { EMPTY } from 'rxjs';
import '@gravitee/ui-components/wc/gv-policy-studio';

import { FlowServiceAbstract } from './services/flow.abstract.service';
import { FlowConfigurationSchema } from './models/flow/ConfigurationSchema';
import { PolicyListItem } from './models/policy';
import { PolicyServiceAbstract } from './services/policy.abstract.service';
import { ResourceServiceAbstract } from './services/resource.abstract.service';
import { SpelServiceAbstract } from './services/spel.abstract.service';
import { Grammar } from './models/spel';

interface UrlParams {
  path: string;
  tabId: string;
  flowsIds: string[];
}

@Component({
  selector: 'gio-policy-studio',
  templateUrl: './gio-policy-studio.component.html',
  styleUrls: ['./gio-policy-studio.component.scss'],
})
export class GioPolicyStudioComponent implements OnInit {
  @Input()
  public readonly!: boolean;

  @Input()
  // TODO: Remove ! and add init value ! for all
  public canAdd!: boolean;

  @Input()
  public canDebug!: boolean;

  @Input()
  public hasResources!: boolean;

  @Input()
  public hasProperties!: boolean;

  @Input()
  public hasPolicyFilter!: boolean;

  @Input()
  public hasConditionalSteps!: boolean;

  @Input()
  public hasPlans = false;

  @Input()
  public sortable!: boolean;

  @Input()
  public set policies(policies: PolicyListItem[]) {
    this._policies = chain(policies)
      .map(policy => (!isNil(policy.category) ? policy : { ...policy, category: this.unknownPolicyCategory }))
      // First sort by category (based on category order) and then by name
      .sortBy([policy => this.policyCategoriesOrder.indexOf(policy.category ?? ''), policy => policy.name])
      .value();
  }
  public get policies(): PolicyListItem[] {
    return this._policies;
  }

  @Input()
  public definition: unknown;

  @Input()
  public services: Record<string, unknown> = {};

  @Input()
  public flowSchema: unknown;

  @Input()
  public resourceTypes!: unknown[];

  @Input()
  public propertyProviders!: unknown[];

  @Input()
  public readonlyPlans!: boolean;

  @Input()
  public dynamicPropertySchema: unknown = {};

  @Input()
  public debugResponse: unknown;

  @Input()
  public flowsTitle!: string;

  @Input()
  public configurationInformation =
    'By default, the selection of a flow is based on the operator defined in the flow itself. This operator allows either to select a flow when the path matches exactly, or when the start of the path matches. The "Best match" option allows you to select the flow from the path that is closest.';

  @Input()
  public hideTab = false;

  @Input()
  public tabId!: string;

  @Output()
  public save = new EventEmitter<unknown>();

  @Output()
  public debug = new EventEmitter<{ definition: unknown; services: unknown; request: unknown }>();

  public selectedFlowsIds!: string;
  public configurationSchema!: FlowConfigurationSchema;
  public policyDocumentation!: { id: string; image: string; content: string };

  private readonly unknownPolicyCategory = 'others';
  private readonly policyCategoriesOrder = ['security', 'performance', 'transformation', this.unknownPolicyCategory];
  private _policies!: PolicyListItem[];

  constructor(
    private readonly location: Location,
    @Inject('FlowService') private readonly flowService: FlowServiceAbstract,
    @Inject('PolicyService') private readonly policyService: PolicyServiceAbstract,
    @Inject('ResourceService') private readonly resourceService: ResourceServiceAbstract,
    @Inject('SpelService') private readonly spelService: SpelServiceAbstract,
  ) {}

  public ngOnInit(): void {
    this.flowService
      .getConfigurationSchemaForm()
      .pipe(
        tap(configurationSchema => {
          this.configurationSchema = configurationSchema;
        }),
      )
      .subscribe();

    const { tabId, flowsIds } = this.parseUrl();

    if (!this.hideTab) {
      this.tabId = tabId;
    }

    this.selectedFlowsIds = JSON.stringify(flowsIds);
  }

  public onTabChanged(tabId: string): void {
    this.updateUrl({ ...this.parseUrl(), tabId });
  }

  public onFlowSelectionChanged({ flows }: { flows: string[] }): void {
    this.updateUrl({ ...this.parseUrl(), flowsIds: flows });
  }

  public fetchPolicyDocumentation({ policy }: { policy: { id: string; icon: string } }): void {
    this.policyService
      .getDocumentation(policy.id)
      .pipe(tap(documentation => (this.policyDocumentation = { id: policy.id, image: policy.icon, content: documentation })))
      .subscribe();
  }

  public fetchResourceDocumentation({
    resourceType,
    target,
  }: {
    resourceType: { id: string; icon: string };
    target: { documentation: unknown };
  }): void {
    this.resourceService
      .getDocumentation(resourceType.id)
      .pipe(
        tap(documentation => (target.documentation = { image: resourceType.icon, content: documentation })),
        catchError(() => {
          target.documentation = null;
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public fetchSpelGrammar({ currentTarget }: { currentTarget: { grammar: Grammar } }): void {
    this.spelService
      .getGrammar()
      .pipe(tap(grammar => (currentTarget.grammar = grammar)))
      .subscribe();
  }

  private parseUrl(): UrlParams {
    // TODO: Improve this with Angular Router
    // Hack to add the tab as Fragment part of the URL
    const [path, tabId] = this.location.path(true).split(/#(\w*)$/);

    const [basePath, ...flowsIds] = path.split('flows');

    const cleanedPath = basePath.replace('?', '');
    const cleanedFlows = (flowsIds ?? []).map(flow => flow.replace('=', ''));

    return {
      path: cleanedPath,
      tabId: tabId ?? '',
      flowsIds: cleanedFlows,
    };
  }

  private updateUrl({ path, tabId, flowsIds }: UrlParams): void {
    // TODO: Improve this with Angular Router
    // Hack to add the tab as Fragment part of the URL
    const flowsQueryParams = (flowsIds ?? []).map(value => `flows=${value}`).join('&');

    const queryParams = flowsQueryParams.length > 0 ? `?${flowsQueryParams}` : '';

    this.location.go(`${path}${queryParams}#${tabId}`);
  }
}
