/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
export interface Step {
  /**
   * The name of the step
   */
  name?: string;
  /**
   * The description of the step
   */
  description?: string;
  /**
   * Is the step enabled or not.
   */
  enabled?: boolean;
  /**
   * The policy of the step
   */
  policy?: string;
  /**
   * The configuration of the step
   */
  configuration?: unknown;
  /**
   * The condition of the step
   */
  condition?: string;
  /**
   * The message condition of the step
   */
  messageCondition?: string;
  /**
   * Is the policy deployed or not.
   */
  deployed?: boolean;
}
