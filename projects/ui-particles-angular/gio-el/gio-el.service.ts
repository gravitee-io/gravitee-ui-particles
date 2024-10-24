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
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConditionsModel, isConditionModel } from './models/ConditionsModel';

@Injectable({
  providedIn: 'root',
})
export class GioElService {
  private conditionsModelByScope$ = new BehaviorSubject<Record<string, ConditionsModel>>({});

  public conditionsModel$(scope: string[]): Observable<ConditionsModel> {
    return this.conditionsModelByScope$.pipe(
      map(conditionsModelByScope => {
        return scope.reduce((acc, currentScope) => {
          return [...acc, ...(conditionsModelByScope[currentScope] || [])];
        }, [] as ConditionsModel);
      }),
    );
  }

  public getConditionsModelJsonSchema(scope: string[]): Observable<unknown> {
    return this.conditionsModel$(scope).pipe(
      map(conditionsModel => {
        return toJsonObject(conditionsModel);
      }),
    );
  }

  public setConditionsModel(scope: string, conditionsModel: ConditionsModel) {
    this.conditionsModelByScope$.next({
      ...this.conditionsModelByScope$.value,
      [scope]: conditionsModel,
    });
  }
}

const toJsonObject = (conditionsModel: ConditionsModel): Record<string, unknown> => {
  return conditionsModel.reduce((acc, condition) => {
    if (isConditionModel(condition)) {
      return {
        ...acc,
        [condition.field]: {
          title: condition.label,
          type: condition.type === 'date' ? 'string' : condition.type,
        },
      };
    } else {
      return {
        ...acc,
        [condition.field]: {
          title: condition.label,
          type: 'object',
          properties: toJsonObject(condition.conditions),
        },
      };
    }
  }, {});
};
