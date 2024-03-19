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
import {
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { validateHtmlSelector } from '@schematics/angular/utility/validation';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { Schema } from '../schema';

function buildSelector(options: Schema, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }
  return selector;
}

function buildPath(project: ProjectDefinition, name: string) {
  const currentDir = process.cwd();
  const sourceRoot = project?.sourceRoot as string;
  let relativePath = currentDir.substring(currentDir.indexOf(sourceRoot));
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
  }
  return `${relativePath}/${name}`;
}

export function createComponent(options: Schema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const log = _context.logger;
    log.info(`🚀Begin component creation with options ${JSON.stringify(options)}`);

    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(options.project);
    if (!project) {
      throw new SchematicsException(`Project "${options.project}" does not exist. 😿`);
    }
    if (options.path === undefined) {
      log.info(`🚧 Build component path`);
      options.path = buildPath(project, options.name) ?? buildDefaultPath(project);
    }
    options.module = findModuleFromOptions(tree, options);
    options.selector = options.selector || buildSelector(options, (project && project.prefix) || '');
    validateHtmlSelector(options.selector);

    log.info(`👀Component will be created at location: ${options.path}`);
    const templateSource = apply(url('./files'), [
      options.skipStories ? filter(path => !path.endsWith('.stories.ts.template')) : noop(),
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        ...options,
      }),
      move(options.path),
    ]);
    return chain([mergeWith(templateSource)]);
  };
}
