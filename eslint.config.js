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
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const rxjs = require('eslint-plugin-rxjs-x');

// plugin:import/typescript and plugin:storybook/recommended are only published in the eslintrc
// shape, and both carry `settings` on top of their rules, so they go through the bridge whole.
const compat = new FlatCompat({ baseDirectory: __dirname });
const importTypescript = compat.extends('plugin:import/typescript');
const storybook = compat.extends('plugin:storybook/recommended');

module.exports = [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/storybook-static/**', '**/.angular/**'],
  },
  ...storybook,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    processor: angularTemplate.processors['extract-inline-html'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angular,
      import: importPlugin,
      prettier: prettierPlugin,
      'rxjs-x': rxjs,
    },
    rules: {
      ...js.configs.recommended.rules,
      // TypeScript covers these core rules itself, no-undef among them.
      ...typescriptEslint.configs['flat/eslint-recommended'].rules,
      ...typescriptEslint.configs.recommended.rules,
      ...angular.configs.recommended.rules,
      ...rxjs.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': ['off'],
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Naming a generic specialisation, or a set of harness filters, is what these interfaces are for.
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
      // New in typescript-eslint 8. The codebase picks between two calls with a ternary, and guards a
      // call with &&, in both cases as a statement; the rule keeps catching the dead-expression form.
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['external', 'builtin', 'internal', 'object', 'type', 'parent', 'index', 'sibling'],
          'newlines-between': 'always',
        },
      ],
      'rxjs-x/no-sharereplay': ['off'],
      'rxjs-x/no-subject-unsubscribe': ['off'],
      // eslint-plugin-rxjs did not carry these four, and rxjs-x recommends them. They stay off so
      // the migration keeps the rule set it had.
      'rxjs-x/no-subscribe-in-pipe': ['off'],
      'rxjs-x/no-topromise': ['off'],
      'rxjs-x/prefer-observer': ['off'],
      'rxjs-x/prefer-root-operators': ['off'],
      'rxjs-x/throw-error': ['off'],
    },
  },
  // After the block above, as in the config it replaces: plugin:import/typescript turns off the
  // rules TypeScript already enforces, import/named among them.
  ...importTypescript.map(config => ({ ...config, files: ['**/*.ts'] })),
  {
    // What the four per-project .eslintrc files carried, all of them the same rules.
    files: ['projects/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'gio', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'gio', style: 'kebab-case' }],
      // TODO: enable when constructor injection is replaced by Angular's inject()
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': angularTemplate, prettier: prettierPlugin },
    rules: {
      ...angularTemplate.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.html'],
    ignores: ['**/*inline-template-*.component.html'],
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': ['error', { parser: 'angular' }],
    },
  },
];
