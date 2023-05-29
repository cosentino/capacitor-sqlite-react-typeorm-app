const CracoSwcPlugin = require('craco-swc');

module.exports = {
  plugins: [
    {
      plugin: CracoSwcPlugin,
      options: {
        swcLoaderOptions: {
          jsc: {
            externalHelpers: true,
            target: 'es5',
            parser: {
              syntax: 'typescript',
              tsx: true,
              dynamicImport: true,
              decorators: true
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true
            }
          },
        },
      },
    },
  ],
};