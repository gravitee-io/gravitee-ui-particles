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
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import {
  GioBannerModule,
  GioFormJsonSchemaComponent,
  GioFormJsonSchemaModule,
  GioJsonSchema,
  GioJsonSchemaContext,
  GioLoaderModule,
} from '@gravitee/ui-particles-angular';
import { isEmpty } from 'lodash';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GioAsciidoctorModule } from '@gravitee/ui-particles-angular/gio-asciidoctor';

import { FlowPhase, isPolicy, isSharedPolicyGroupPolicy, Step, toPolicy, GenericPolicy } from '../../models';
import { GioPolicyStudioService } from '../../policy-studio/gio-policy-studio.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    GioFormJsonSchemaModule,
    GioAsciidoctorModule,
    GioLoaderModule,
    GioBannerModule,
  ],
  selector: 'gio-ps-step-form',
  templateUrl: './gio-ps-step-form.component.html',
  styleUrls: ['./gio-ps-step-form.component.scss'],
})
export class GioPolicyStudioStepFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public readOnly = false;

  @Input()
  public step?: Step;

  @Input({ required: true })
  public flowPhase!: FlowPhase;

  @Input()
  public genericPolicy!: GenericPolicy;

  @Output()
  public stepChange = new EventEmitter<Step>();

  @Output()
  public isValid = new EventEmitter<boolean>();

  public policySchema$?: Observable<GioJsonSchema | null | undefined>;
  public policyDocumentation$?: Observable<string>;
  public infoBanner?: string;

  public stepForm?: UntypedFormGroup;

  public context?: GioJsonSchemaContext;

  private unsubscribe$ = new Subject<void>();
  public isMessage = false;
  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.genericPolicy) {
      if (isPolicy(this.genericPolicy)) {
        this.policySchema$ = this.policyStudioService.getPolicySchema(toPolicy(this.genericPolicy)).pipe(
          map(schema => {
            if (GioFormJsonSchemaComponent.isDisplayable(schema as GioJsonSchema)) {
              return schema as GioJsonSchema;
            }
            return {};
          }),
        );

        this.policyDocumentation$ = this.policyStudioService.getPolicyDocumentation(toPolicy(this.genericPolicy)).pipe(
          map(doc => (isEmpty(doc) ? 'No documentation available.' : doc)),
          catchError(() => of('No documentation available.')),
        );
      }
      if (isSharedPolicyGroupPolicy(this.genericPolicy)) {
        this.policySchema$ = of({});

        this.policyDocumentation$ = of(' ');

        this.infoBanner = this.genericPolicy.prerequisiteMessage;
      }
    }
    if (changes.flowPhase) {
      this.context = {
        flowPhase: this.flowPhase,
      };
      this.isMessage = this.flowPhase === 'PUBLISH' || this.flowPhase === 'SUBSCRIBE';
    }
  }

  public ngOnInit(): void {
    this.initStepForm();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initStepForm(): void {
    this.stepForm = new UntypedFormGroup({
      description: new UntypedFormControl({ value: this.step?.description, disabled: this.readOnly }),
      condition: new UntypedFormControl({ value: this.step?.condition, disabled: this.readOnly }),
      messageCondition: new FormControl<string | undefined>({ value: this.step?.messageCondition, disabled: this.readOnly }),
      configuration: new UntypedFormControl({ value: this.step?.configuration, disabled: this.readOnly }),
    });

    this.stepForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.emitStepChange();
    });

    this.stepForm.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(valid => {
      this.isValid.emit(valid === 'VALID');
    });
  }

  public onJsonSchemaReady(isReady: boolean) {
    // When ready and if the form is valid, emit
    if (isReady) {
      this.emitStepChange();

      if (this.stepForm?.status === 'VALID') {
        this.isValid.emit(true);
      }
    }
  }

  public emitStepChange(): void {
    let configuration = this.stepForm?.get('configuration')?.value;

    if (isSharedPolicyGroupPolicy(this.genericPolicy)) {
      configuration = { sharedPolicyGroupId: this.genericPolicy.sharedPolicyGroupId };
    }

    this.stepChange.emit({
      ...this.step,
      description: this.stepForm?.get('description')?.value,
      condition: this.stepForm?.get('condition')?.value ?? undefined,
      messageCondition: this.stepForm?.get('messageCondition')?.value ?? undefined,
      configuration,
    });
  }
}
