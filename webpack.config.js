const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ENV = process.env.NODE_ENV || 'development'
// console.log('__dirname:', __dirname)

module.exports = {
  watch: ENV === 'development',
  target: 'electron-renderer',
  // entry: ['@babel/polyfill', './app/renderer.jsx'],
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
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.svg'],
    alias: {
      Images: path.resolve(__dirname, 'app/src/assets/images/'),
    }
  }
}