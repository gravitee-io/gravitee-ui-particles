/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { formatJsonString } from './gio-monaco-editor.component';

describe('formatJsonString', () => {
  it('should indent a compact object with two spaces', () => {
    expect(formatJsonString('{"message":"Hello World !"}')).toEqual(`{\n  "message": "Hello World !"\n}`);
  });

  it('should indent nested values', () => {
    expect(formatJsonString('{"a":{"b":[1,2]}}')).toEqual(`{\n  "a": {\n    "b": [\n      1,\n      2\n    ]\n  }\n}`);
  });

  it('should leave an already formatted value as it is', () => {
    const formatted = `{\n  "message": "Hello World !"\n}`;
    expect(formatJsonString(formatted)).toEqual(formatted);
  });

  it('should format the arrays Monaco would have formatted', () => {
    expect(formatJsonString('[{"id":1},{"id":2}]')).toEqual(`[\n  {\n    "id": 1\n  },\n  {\n    "id": 2\n  }\n]`);
  });

  it.each([
    ['not JSON at all', 'a plain sentence'],
    ['a truncated object', '{"a":'],
    ['an empty string', ''],
  ])('should return undefined for %s', (_, value) => {
    expect(formatJsonString(value)).toBeUndefined();
  });
});
