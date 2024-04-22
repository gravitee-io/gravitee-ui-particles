# Gravitee UI Particles 

![](./assets/gravitee-ui-particules-logo.png)

[![CircleCI](https://circleci.com/gh/gravitee-io/gravitee-ui-particles/tree/main.svg?style=svg)](https://circleci.com/gh/gravitee-io/gravitee-ui-particles/tree/main)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@main/badge/badge-storybook.svg)](https://particles.gravitee.io/)

## Overview

Gravitee UI Particles centralizes the design system applied to all Gravitee consoles. Based on Angular library.

It currently contains the following packages:
 - `@gravitee/ui-particles-angular`: Disign system for Gravitee.io Console (APIM, AM, Cockpit)
 - `@gravitee/ui-particles-analytic`: Contain analytics tools (Pendo)
 - `@gravitee/ui-policy-studio-angular`: Contain the Policy Studio to share between APIM versions
 - `@gravitee/ui-schematics`: Contain Angular schematics to generate components, services, etc.

### Live Demo

You can see components in action on [Storybook](https://main--6183b02d73381a003a3be1a6.chromatic.com/).

### Usage

To use it in your project just run:

```bash
npm install @gravitee/ui-particles-angular
# or
yarn add @gravitee/ui-particles-angular
```
or any other package you want to use.


## Contributing

You think Gravitee.io is awesome and want to contribute to the project?

- Ensure your dependencies are up-to-date by running `yarn install`
- Start Storybook locally with `yarn storybook`, it will serve it on `http://localhost:9008`
- Edit or create a component and Storybook will be updated automatically
- Do not forget to write documentation for each component
- Have a look on [guidelines](https://github.com/gravitee-io/gravitee-ui-particles/blob/master/CONTRIBUTING.md) that should help you get started.

## Copyright

Copyright (C) 2015 The Gravitee team (http://gravitee.io)
Licensed under the Apache License, Version 2.0 (the "License");

See the [LICENSE](https://github.com/gravitee-io/gravitee-ui-particles/blob/master/LICENSE.txt) file for details.

## Changelog

Refer to the [CHANGELOG](https://github.com/gravitee-io/gravitee-ui-particles/blob/main/ui-particles-angular/CHANGELOG.md) for a complete list of changes.
