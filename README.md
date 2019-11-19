# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm publish
```

### Debug

`Prerequisite`: `@angular-devkit/schematics` should be installed globally.

To debug, run this command line in your angular project:

```bash
node --inspect-brk `which schematics` schematics-rx-module:ng-add --dry-run --name=hello
```

That's it!
