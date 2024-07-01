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
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { GioFormJsonSchemaComponent, GioJsonSchema } from '@gravitee/ui-particles-angular';
import { isEmpty } from 'lodash';

import { GioPolicyStudioService } from '../../gio-policy-studio.service';
import { Policy, Step } from '../../models';

@Component({
  selector: 'gio-ps-step-form',
  templateUrl: './gio-ps-step-form.component.html',
  styleUrls: ['./gio-ps-step-form.component.scss'],
})
export class GioPolicyStudioStepFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public readOnly = false;

  @Input()
  public step?: Step;

  @Input()
  public policy!: Policy;

  @Output()
  public stepChange = new EventEmitter<Step>();

  @Output()
  public isValid = new EventEmitter<boolean>();

  public policySchema$?: Observable<GioJsonSchema | null | undefined>;
  public policyDocumentation$?: Observable<string>;

  public stepForm?: UntypedFormGroup;

  private unsubscribe$ = new Subject<void>();
  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.policy) {
      this.policySchema$ = this.policyStudioService.getPolicySchema(this.policy).pipe(
        map(schema => {
          if (GioFormJsonSchemaComponent.isDisplayable(schema as GioJsonSchema)) {
            const gioJsonSchema = schema as GioJsonSchema;
            gioJsonSchema.readOnly = this.readOnly;
            return gioJsonSchema;
          }
          return {};
        }),
      );

      this.policyDocumentation$ = this.policyStudioService
        .getPolicyDocumentation(this.policy)
        .pipe(map(doc => (isEmpty(doc) ? 'No documentation available.' : doc)));
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
      description: new UntypedFormControl(this.step?.description),
      condition: new UntypedFormControl(this.step?.condition),
      configuration: new UntypedFormControl(this.step?.configuration ?? {}),
    });

    this.stepForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.emitStepChange();
    });

    this.stepForm.statusChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(valid => {
      this.isValid.emit(valid === 'VALID');
    });

    if (this.readOnly) {
      this.stepForm.disable({ emitEvent: false });
    }
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
    this.stepChange.emit({
      ...this.step,
      description: this.stepForm?.get('description')?.value,
      condition: this.stepForm?.get('condition')?.value ?? undefined,
      configuration: this.stepForm?.get('configuration')?.value,
    });
  }
}
