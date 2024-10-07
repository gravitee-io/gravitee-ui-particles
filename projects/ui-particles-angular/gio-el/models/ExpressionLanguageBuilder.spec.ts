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
import { ExpressionLanguageBuilder } from './ExpressionLanguageBuilder';
import { ConditionGroup } from './ConditionGroup';
import { Condition } from './Condition';

describe('ExpressionLanguageBuilder', () => {
  it('should build a condition group', () => {
    // Arrange
    const conditionGroup: ConditionGroup = new ConditionGroup('AND', [
      new Condition('field1', 'string', 'EQUALS', 'value1'),
      new Condition('field2', 'string', 'NOT_EQUALS', 'value2'),
    ]);
    const expressionLanguageBuilder = new ExpressionLanguageBuilder(conditionGroup);

    // Act
    const expression = expressionLanguageBuilder.build();

    // Assert
    expect(expression).toEqual('{ #field1 == "value1" && #field2 != "value2" }');
  });

  it('should build a condition group with multiple conditions', () => {
    // Arrange
    const conditionGroup: ConditionGroup = new ConditionGroup('OR', [
      new Condition('field1', 'string', 'EQUALS', 'value1'),
      new Condition('field2', 'string', 'NOT_EQUALS', 'value2'),
      new Condition('field3', 'string', 'LESS_THAN', 'value3'),
    ]);
    const expressionLanguageBuilder = new ExpressionLanguageBuilder(conditionGroup);

    // Act
    const expression = expressionLanguageBuilder.build();

    // Assert
    expect(expression).toEqual('{ #field1 == "value1" || #field2 != "value2" || #field3 < "value3" }');
  });

  it('should build a condition group with nested condition groups', () => {
    // Arrange
    const conditionGroup = new ConditionGroup('OR', [
      new Condition('field1', 'string', 'EQUALS', 'value1'),
      new Condition('field2', 'string', 'NOT_EQUALS', 'value2'),
      new ConditionGroup('AND', [
        new Condition('field3', 'string', 'LESS_THAN', 'value3'),
        new Condition('field4', 'string', 'GREATER_THAN', 'value4'),
      ]),
    ]);
    const expressionLanguageBuilder = new ExpressionLanguageBuilder(conditionGroup);

    // Act
    const expression = expressionLanguageBuilder.build();

    // Assert
    expect(expression).toEqual('{ #field1 == "value1" || #field2 != "value2" || ( #field3 < "value3" && #field4 > "value4" ) }');
  });

  it('should build a condition group with nested condition groups and single condition', () => {
    // Arrange
    const conditionGroup = new ConditionGroup('OR', [
      new Condition('field1', 'string', 'EQUALS', 'value1'),
      new ConditionGroup('AND', [new Condition('field2', 'string', 'NOT_EQUALS', 'value2')]),
    ]);
    const expressionLanguageBuilder = new ExpressionLanguageBuilder(conditionGroup);

    // Act
    const expression = expressionLanguageBuilder.build();

    // Assert
    expect(expression).toEqual('{ #field1 == "value1" || #field2 != "value2" }');
  });

  it('should build a condition group all operators', () => {
    // Arrange
    const conditionGroup = new ConditionGroup('AND', [
      new Condition('field1', 'string', 'EQUALS', 'value1'),
      new Condition('field2', 'string', 'NOT_EQUALS', 'value2'),
      new Condition('field3', 'string', 'LESS_THAN', 'value3'),
      new Condition('field4', 'string', 'LESS_THAN_OR_EQUALS', 'value4'),
      new Condition('field5', 'string', 'GREATER_THAN', 'value5'),
      new Condition('field6', 'string', 'GREATER_THAN_OR_EQUALS', 'value6'),
      new Condition('field7', 'string', 'CONTAINS', 'value7'),
      new Condition('field8', 'string', 'NOT_CONTAINS', 'value8'),
      new Condition('field9', 'string', 'STARTS_WITH', 'value9'),
      new Condition('field10', 'string', 'ENDS_WITH', 'value10'),
    ]);
    const expressionLanguageBuilder = new ExpressionLanguageBuilder(conditionGroup);

    // Act
    const expression = expressionLanguageBuilder.build();

    // Assert
    expect(expression).toEqual(
      '{ #field1 == "value1" && #field2 != "value2" && #field3 < "value3" && #field4 <= "value4" && #field5 > "value5" && #field6 >= "value6" && #field7 matches ""value7"" && !#field8 matches ""value8"" && #field9 matches "^"value9"" && #field10 matches ""value10"$" }',
    );
  });

  it('should build a condition group with date', () => {
    // Arrange
    const conditionGroup = new ConditionGroup('AND', [new Condition('field1', 'date', 'EQUALS', new Date('2021-01-01'))]);
    const expressionLanguageBuilder = new ExpressionLanguageBuilder(conditionGroup);

    // Act
    const expression = expressionLanguageBuilder.build();

    // Assert
    expect(expression).toEqual('{ #field1 == 1609459200000l }');
  });
});
