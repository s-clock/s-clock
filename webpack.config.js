const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';

const PublicPath = join(__dirname, './public');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: './src/index.ts',
  mode: dev ? 'development' : 'production',
  output: {
    path: join(__dirname, 'dist'),
    filename: dev ? '[name].js' : '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  performance: {
    maxAssetSize: 50000000,
    maxEntrypointSize: 5000000,
  },
  devtool: dev ? 'source-map' : false,
  cache: {
    type: 'filesystem',
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, 'public', 'index.html'),
      env: {
        dev,
        prod: !dev,
      },
    }),
    new MiniCssExtractPlugin(),
    dev
      ? null
      : new GenerateSW({
          runtimeCaching: [
            {
              urlPattern: /http.+react.+\.js$/,
              handler: 'CacheFirst',
            },
            {
              urlPattern: /http.+i18next\.min\.js$/,
              handler: 'CacheFirst',
            },
          ],
        }),
    new CopyPlugin({
      patterns: [
        {
          from: join(PublicPath, 'manifest.json'),
          to: join(__dirname, 'dist'),
        },
        {
          from: join(PublicPath, 'icon.svg'),
          to: join(__dirname, 'dist'),
        },
      ],
    }),
  ].filter((v) => v),
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    i18next: 'i18next',
  },
  devServer: {
    port: 9000,
    hot: true,
  },
};

module.exports = config;
