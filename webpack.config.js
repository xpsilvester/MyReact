const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
      main: './main.js'
    },
    module: {
      rules: [
        {
          test:  /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [[
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'MyReact.createElement',
                  pragmaFrag: 'MyReact.Fragment'
                }
              ]]
            }
          }
        }
      ]
    },
    optimization: {
      minimize: false
    },
    mode: 'development',
    devServer: {
        contentBase: '/',
        hot: true,
        port: 5000,
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'My React'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
}