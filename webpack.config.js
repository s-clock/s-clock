const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: './src/index.ts',
  mode: dev ? 'development' : 'production',
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
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
    new GenerateSW({
      runtimeCaching: [
        {
          urlPattern: /react.+\.js$/,
          handler: 'CacheFirst',
        },
      ],
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  devServer: {
    port: 9000,
    hot: true,
  },
};

module.exports = config;
