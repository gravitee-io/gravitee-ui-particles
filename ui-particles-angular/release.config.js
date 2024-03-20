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
  branches: ['+([0-9])?(.{+([0-9]),x}).x', 'main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/ui-analytics',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/ui-particles-angular',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/ui-policy-studio-angular',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/ui-schematics',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
  ],
};
