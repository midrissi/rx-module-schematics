import {
  url,
  Rule,
  move,
  Tree,
  apply,
  template,
  mergeWith,
  MergeStrategy,
  SchematicContext,
  renameTemplateFiles
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { strings, join, normalize } from '@angular-devkit/core';

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src');
  return host;
}

export function rxModule(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);

    const movePath = normalize(`${_options.path}/app/modules/${strings.dasherize(_options.name)}`);
    const templateSource = apply(url('./files'), [
      template({
        ..._options,
        ...strings,
        huminize: (str: string) => {
          if(typeof str !== 'string') {
            return '';
          }

          return str.split('-').map(strings.capitalize).join(' ');
        }
      }),
      renameTemplateFiles(),
      move(movePath)
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}
