const path = require("path");
module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        "chache-for-promise":['@babel/polyfill',"./cache-for-promise.js"],
        "chache-for-promise/key-generator":['@babel/polyfill',"./key-generator.js"]
    },
    output: {
        path: path.resolve(__dirname,"dist"),
        filename: '[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    "@babel/preset-env"
                  ]
                }
              }
            ]
          }
        ]
      }
  };