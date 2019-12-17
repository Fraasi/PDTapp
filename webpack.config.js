const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')

const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  watch: ENV === 'development',
  devtool: ENV === 'development' ? 'eval-source-map' : 'source-map',
  target: 'electron-renderer',
  entry: ['@babel/polyfill', './app/renderer.jsx'],
  output: {
    path: `${__dirname}/app/build`,
    publicPath: 'build/',
    filename: 'bundle.js'
  },
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
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
    // new ExtractTextPlugin({
    //   filename: 'bundle.css',
    //   disable: false,
    //   allChunks: true
    // })
    new MiniCssExtractPlugin({
    filename: 'bundle.css',
    chunkFilename: '[id].css',
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.svg'],
    alias: {
      Images: path.resolve(__dirname, 'app/src/assets/images/'),
    }
  },

  externals: [nodeExternals({
    whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
  })]
}
