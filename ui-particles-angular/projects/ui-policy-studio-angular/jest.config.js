/*
 * Copyright (C) 2021 The Gravitee team (http://gravitee.io)
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
module.exports = {
  preset: 'jest-preset-angular',
  roots: [__dirname + '/src'],
  setupFilesAfterEnv: [__dirname + '/src/setup-jest.ts'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.*\\.mjs$)|(@gravitee/ui-components/.*?\\.js)|lit|@lit/reactive-element|(lit-element/.*?\\.js)|(lit-html/.*?\\.js)|(resize-observer-polyfill/.*?\\.js)|(date-fns/.*?\\.js)$)',
  ],
  moduleNameMapper: {
    // 📝 Order is important
    '@gravitee/ui-particles-angular/testing': __dirname + '/../ui-particles-angular/testing/public-api.ts',
    '@gravitee/ui-particles-angular': __dirname + '/../ui-particles-angular/src/public-api.ts',
  },
};
