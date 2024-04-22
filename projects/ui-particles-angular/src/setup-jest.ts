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
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      getPropertyValue: () => {
        return '';
      },
    };
  },
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
// Object.defineProperty(document.body.style, 'transform', {
//   value: () => {
//     return {
//       enumerable: true,
//       configurable: true,
//     };
//   },
// });

/**
 * ISSUE: https://github.com/thymikee/jest-preset-angular/issues/79
 *Q: "Could not find Angular Material core theme.." or "Could not find HammerJS" when testing components which used Material Design lib.
 */
const WARN_SUPPRESSING_PATTERNS = [/Could not find Angular Material core theme/, /Could not find HammerJS/];

const warn = console.warn;

Object.defineProperty(console, 'warn', {
  value: (...params: string[]) => {
    if (!WARN_SUPPRESSING_PATTERNS.some(pattern => pattern.test(params[0]))) {
      warn(...params);
    }
  },
});

export {};
