# Gravitee.io UI Particles Angular

⚠️ Current version of this package is compatible with Angular 18.

## Overview

This package is the Angular version of the Gravitee UI Particles.

It contains:

- Angular Material palettes matching the Gravitee.io colors
- Angular Material overrides shared accros Gravitee.io's consoles
- Some Angular based components, available in the `lib` folder
- Some SCSS based components, available in the `sccs/component` folder

## Usage

To use it in your project just run:

```bash
npm install @gravitee/ui-particles-angular
# or
yarn add @gravitee/ui-particles-angular
```

## Secondary entry points

- `@gravitee/ui-particles-angular/gio-asciidoctor` renders AsciiDoc through `@asciidoctor/core`, declared as an
  optional peer dependency. Since its 4.0.0 the browser bundle keeps Node.js only code paths that a bundler resolves
  statically, so an application that uses this entry point needs a little build configuration — one line for esbuild,
  a webpack configuration otherwise — and its tests need `GioAsciidoctorTestingModule`, the module being unloadable
  under jsdom. Both are documented in the
  [Asciidoctor README](https://main--6183b02d73381a003a3be1a6.chromatic.com/?path=/docs/components-asciidoctor-readme--docs).
- `@gravitee/ui-particles-angular/gio-el` and `@gravitee/ui-particles-angular/testing` carry the Expression Language
  editor and the test harnesses.

## Extra

More info are available in the generic [Gravitee.io UI Particles repository](https://github.com/gravitee-io/gravitee-ui-particles).
