const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
// const { spawn } = require('node-pty') // only require works


const ENV = process.env.NODE_ENV || 'development'
// console.log('__dirname:', __dirname)

module.exports = {
  watch: ENV === 'development',
  target: 'electron-renderer',
  entry: ['@babel/polyfill', './app/renderer.jsx'],
  output: {
    path: `${__dirname}/app/build`,
    publicPath: 'build/',
    filename: 'bundle.js'
  },
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // include: [path.resolve(__dirname, 'app', 'src')],
        // include: [`${__dirname}/app`],
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader',
          options: {
            import: true,
            // prevent selector hashing, keep original name
            // modules: false,
            // camelCase: 'dashes',
          }
        })
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         // you can specify a publicPath here
      //         // by default it uses publicPath in webpackOptions.output
      //         // publicPath: '../',
      //         hmr: process.env.NODE_ENV === 'development',
      //       },
      //     },
      //     'css-loader',
      //   ],
      // },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'images',
        }
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true
    })
    // new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    // filename: 'bundle.css',
    // chunkFilename: '[id].css',
    // }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.svg'],
    alias: {
      Images: path.resolve(__dirname, 'app/src/assets/images/'),
    }
  },

  // externals: [/(node-pty)$/i]
  externals: [nodeExternals({
    whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
  })]
}
