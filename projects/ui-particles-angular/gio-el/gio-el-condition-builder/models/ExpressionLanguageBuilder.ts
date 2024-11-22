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
import { isNil } from 'lodash';

import { ElPropertyType } from '../../models/ElProperty';

import { ConditionGroup } from './ConditionGroup';
import { Operator } from './Operator';
import { Condition } from './Condition';

export class ExpressionLanguageBuilder {
  private static CONDITION_MAP = {
    OR: '||',
    AND: '&&',
  };
  private static OPERATOR_MAP: Record<Operator, (field: string, value: unknown) => string> = {
    EQUALS: (field, value) => `${field} == ${value}`,
    NOT_EQUALS: (field, value) => `${field} != ${value}`,
    LESS_THAN: (field, value) => `${field} < ${value}`,
    LESS_THAN_OR_EQUALS: (field, value) => `${field} <= ${value}`,
    GREATER_THAN: (field, value) => `${field} > ${value}`,
    GREATER_THAN_OR_EQUALS: (field, value) => `${field} >= ${value}`,
    CONTAINS: (field, value) => `${field} matches "${value}"`,
    NOT_CONTAINS: (field, value) => `!${field} matches "${value}"`,
    STARTS_WITH: (field, value) => `${field} matches "^${value}"`,
    ENDS_WITH: (field, value) => `${field} matches "${value}$"`,
  };

  private static buildConditionGroup(conditionGroup: ConditionGroup): string {
    let el = '';
    for (const condition of conditionGroup.conditions) {
      if (condition instanceof ConditionGroup) {
        const hasMultipleConditions = condition.conditions.length > 1;

        if (hasMultipleConditions) {
          el += '( ';
        }
        el += ExpressionLanguageBuilder.buildConditionGroup(condition);
        if (hasMultipleConditions) {
          el += ' )';
        }
      } else {
        el += ExpressionLanguageBuilder.buildCondition(condition);
      }

      if (condition !== conditionGroup.conditions[conditionGroup.conditions.length - 1]) {
        el += ` ${ExpressionLanguageBuilder.CONDITION_MAP[conditionGroup.condition]} `;
      }
    }
    if (el === '') {
      return '';
    }
    return el;
  }

  private static buildCondition(condition: Condition<ElPropertyType>): string {
    const operator = ExpressionLanguageBuilder.OPERATOR_MAP[condition.operator];
    return operator(
      ExpressionLanguageBuilder.toFieldString(condition.field),
      ExpressionLanguageBuilder.valueToString(condition.type, condition.value),
    );
  }

  private static valueToString<T extends ElPropertyType>(type: T, value: unknown): string {
    if (!type) {
      return '';
    }

    switch (type) {
      case 'string':
        return `"${value}"`;
      case 'date':
        return `${(value as Date).getTime()}l`;
      default:
        return `${value}`;
    }
  }

  private static toFieldString(field: Condition<ElPropertyType>['field']): string {
    if (field instanceof Object && !isNil(field.key1Value) && !isNil(field.key2Value)) {
      return `#${field.field}?.["${field.key1Value}"]?.[${field.key2Value}]`;
    } else if (field instanceof Object && !isNil(field.key1Value)) {
      return `#${field.field}?.["${field.key1Value}"]`;
    } else if (field instanceof Object) {
      return `#${field.field}`;
    }
    return `#${field}`;
  }

  constructor(private conditionGroup: ConditionGroup) {}

  public build(): string {
    const el = ExpressionLanguageBuilder.buildConditionGroup(this.conditionGroup);

    return `{ ${el} }`;
  }
}
