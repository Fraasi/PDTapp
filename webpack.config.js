const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require("copy-webpack-plugin")

const ENV = process.env.NODE_ENV || 'development'

module.exports = {
  watch: ENV === 'development',
  devtool: ENV === 'development' ? 'eval-source-map' : 'source-map',
  target: 'electron-renderer',
  entry: ['./app/renderer.jsx'],
  output: {
    path: `${__dirname}/build`,
    // https://medium.com/@raviroshan.talk/webpack-understanding-the-publicpath-mystery-aeb96d9effb1
    // publicPath: 'public',
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
            [
              "@babel/preset-env",
              {
                "targets": {
                  "node": "16"
                }
              }
            ],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
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
    new MiniCssExtractPlugin({
    filename: 'bundle.css',
    chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: "app/index.html", to: "index.html" },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.svg'],
    alias: {
      Images: path.join(__dirname, 'app/src/assets/images/'),
    }
  },

  externals: [nodeExternals({
    allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
  })]
}
