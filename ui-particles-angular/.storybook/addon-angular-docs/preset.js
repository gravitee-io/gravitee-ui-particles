const path = require('path');

module.exports = {
  webpackFinal: async (config, options) => {
    console.log('"webpackFinal", ');
    config.module.rules.push({
      test: /\.stories.ts$/,
      use: [
        {
          loader: path.resolve(__dirname, 'loader.js'),
          //   options: {},
        },
      ],
    });

    return config;
  },
};
