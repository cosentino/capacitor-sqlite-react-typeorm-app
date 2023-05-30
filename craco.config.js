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