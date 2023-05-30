# Ionic/React Capacitor SQLite + TypeORM Example App

[TypeORM](https://typeorm.io/) usage example within [Capacitor SQLite plugin](https://github.com/capacitor-community/sqlite) within a React Ionic App.

This project is an React conversion of the Ionic/Vue [TypeORM App](https://github.com/jepiqueau/vue-typeorm-app) and the [Ionic/Angular SQLite TypeOrm App](https://github.com/jepiqueau/ionic-sqlite-typeorm-app) by [@jepiqueau](https://github.com/jepiqueau).

See also [typeorm-react-swc](https://github.com/ItayGarin/typeorm-react-swc) for an example of TypeORM integration in a Create React App application.

## Installation

Since Create React App does not allow to tweek the react project compilation as required by TypeORM.
We thus need to replace react-script with a tool such as [CRACO](https://craco.js.org/) and then override the default configurations (note: ejecting CRA is a viable solution).
CRACO will allow us to customize the default CRA Webpack configuration.

### 1. Install the latest version of the package from npm as a dev dependency

```bash
npm i -D @craco/craco craco-swc
```

### 2. Create a CRACO configuration file in your project's root directory and configure

Create the files craco.config.js and .swcrc the files in the project root.
The following will tell CRACO to:

- force the minimizer (Terser) settings "keep_classnames" and "keep_fnames" to true
- use SWC instead of Babel as transpiler
- configure SWC parser and tranformer so that uses "legacyDecorator" and "decoratorMetadata"

craco.config.js:

```js
const CracoSwcPlugin = require('craco-swc');

module.exports = {
  plugins: [
    {
      plugin: CracoSwcPlugin, // see .swcrc for SWC configuration (that will replace Babel)
    }, 
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {          
          const terser = webpackConfig?.optimization?.minimizer?.find(x => x.options.minimizer);
          if (terser) {
            terser.options.minimizer.options = {
              ...terser.options.minimizer.options,
              keep_classnames: true,
              keep_fnames: true,
            }
          }
          return webpackConfig;
        }
      }
    }
  ],
};
```

.swcrc:

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "externalHelpers": true,
    "target": "es5",
    "preserveAllComments": true,
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dynamicImport": true,
      "decorators": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    }
  }
}
```

### 3. Update build commands to use craco CLI

In particular in the :

- Update existing calls to react-scripts in the scripts section of your package.json to use the craco CLI.
- Override the ionic build​ command to use craco cli (see [https://ionicframework.com/docs/cli/configuration#overriding-the-build]).

```json
"scripts": {
  "start": "npm run copysqlwasm && craco start",
  "build": "npm run copysqlwasm && craco build",  
  "copysqlwasm": "copyfiles -u 3 node_modules/sql.js/dist/sql-wasm.wasm public/assets",
  "ionic:build": "npm run build",
  "ionic:serve": "npm run start"
},
```

### 4. Add the following to tsconfig.json

```json
  "strictPropertyInitialization": false,
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
```

### 5. Install reflect-metadata package

```bash
npm i reflect-metadata
```

### 6. import 'reflect-metadata' once, before any typeorm entity import, for example add the following to the ./src/index.tsx

```ts
import "reflect-metadata";
import React from 'react';  
```

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<p align="center">
  <a href="https://github.com/cosentino"><img src="https://avatars.githubusercontent.com/u/376903?s=48&v=4" width="50" height="50" /></a>  
</p>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!