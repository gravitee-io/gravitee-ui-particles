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
import { JSONSchema7 } from 'json-schema';

import { ElProperties, isElProperty } from './models/ElProperties';

@Injectable({
  providedIn: 'root',
})
export class GioElService {
  private elPropertiesByScope$ = new BehaviorSubject<Record<string, ElProperties>>({});

  public elProperties$(scope: string[]): Observable<ElProperties> {
    return this.elPropertiesByScope$.pipe(
      map(elPropertiesByScope => {
        return scope.reduce((acc, currentScope) => {
          return [...acc, ...(elPropertiesByScope[currentScope] || [])];
        }, [] as ElProperties);
      }),
    );
  }

  public getElPropertiesJsonSchema(scope: string[]): Observable<unknown> {
    return this.elProperties$(scope).pipe(
      map(elProperties => {
        return toJsonObject(elProperties);
      }),
    );
  }

  public setElProperties(scope: string, elProperties: ElProperties) {
    this.elPropertiesByScope$.next({
      ...this.elPropertiesByScope$.value,
      [scope]: elProperties,
    });
  }
}

const toJsonObject = (elProperties: ElProperties): JSONSchema7 => {
  return elProperties.reduce((acc, elProperty) => {
    if (isElProperty(elProperty)) {
      if (elProperty.type === 'Map') {
        return {
          ...acc,
          [elProperty.field]: {
            title: elProperty.label,
            type: 'object',
            additionalProperties: { type: elProperty.valueProperty?.type === 'string' ? 'string' : 'object' },
          },
        };
      } else if (elProperty.type === 'MultiMap') {
        return {
          ...acc,
          [elProperty.field]: {
            title: elProperty.label,
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: elProperty.valueProperty?.type === 'string' ? 'string' : 'object' },
            },
          },
        };
      }

      return {
        ...acc,
        [elProperty.field]: {
          title: elProperty.label,
          type: elProperty.type === 'date' ? 'string' : elProperty.type,
        },
      };
    } else {
      return {
        ...acc,
        [elProperty.field]: {
          title: elProperty.label,
          type: 'object',
          properties: toJsonObject(elProperty.properties),
        },
      };
    }
  }, {});
};
