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
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { GioPolicyStudioService } from '../../gio-policy-studio.service';
import { Policy, Step } from '../../models';

@Component({
  selector: 'gio-ps-step-form',
  templateUrl: './gio-ps-step-form.component.html',
  styleUrls: ['./gio-ps-step-form.component.scss'],
})
export class GioPolicyStudioStepFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public step?: Step;

  @Input()
  public policy!: Policy;

  @Output()
  public stepChange = new EventEmitter<Step>();

  @Output()
  public isValid = new EventEmitter<boolean>();

  public policySchema$?: unknown;
  public policyDocumentation$?: unknown;

  public stepForm?: FormGroup;

  private unsubscribe$ = new Subject<void>();
  constructor(private readonly policyStudioService: GioPolicyStudioService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.policy) {
      this.policySchema$ = this.policyStudioService.getPolicySchema(this.policy);
      this.policyDocumentation$ = this.policyStudioService.getPolicyDocumentation(this.policy);
    }

    if (changes.step && !changes.step.firstChange) {
      this.initStepForm();
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
    this.stepForm = new FormGroup({
      description: new FormControl(this.step?.description, []),
    });

    this.stepForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.stepChange.emit({
        ...this.step,
        description: this.stepForm?.get('description')?.value,
      });
    });

    this.stepForm.statusChanges.pipe(takeUntil(this.unsubscribe$), startWith(this.stepForm.status)).subscribe(valid => {
      this.isValid.emit(valid === 'VALID');
    });
  }
}
