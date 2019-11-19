import { join, normalize, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  renameTemplateFiles,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src');
  return host;
}

function buildSelector(options: any, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

export function rxModule(options: any): Rule {
  return async (tree: Tree) => {
    setupOptions(tree, options);

    const workspace = await getWorkspace(tree);
    const project = workspace.projects[options.project];
    const selector =
      options.selector ||
      buildSelector(options, (project && project.prefix) || '');

    const movePath = normalize(
      `${options.path}/app/modules/${strings.dasherize(options.name)}`,
    );
    const templateSource = apply(url('./files'), [
      template({
        selector,
        ...options,
        ...strings,
        huminize: (str: string) => {
          if (typeof str !== 'string') {
            return '';
          }

          return str
            .split('-')
            .map(strings.capitalize)
            .join(' ');
        },
      }),
      renameTemplateFiles(),
      move(movePath),
    ]);
    return chain([mergeWith(templateSource, MergeStrategy.Overwrite)]);
  };
}
