import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('rx-module', () => {

  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, './../collection.json'),
  );

  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.5.0',
  };

  const appOptions: any = {
    name: 'schematest'
  };

  const schemaOptions: any = {
    name: 'foo'
  };

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  });

  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematicAsync('rx-module', schemaOptions, appTree).toPromise().then(tree => {
      const basePath = `/projects/schematest/src/app/modules/${schemaOptions.name}`;
      const serviceContent = tree.readContent(`${basePath}/${schemaOptions.name}.service.ts`);
      const containerContent = tree.readContent(`${basePath}/components/container/container.component.html`);
      expect(serviceContent).toContain('export class FooService');
      expect(containerContent).toContain('Foo Works!');
    });
  });
});