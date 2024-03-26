const path = require('path');
const { ProgressPlugin, DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : 'style-loader';

const handler = (percentage, message, ...args) => {
  console.info(percentage, message, ...args);
};

const config = {
  target: ['browserslist'],
  entry: './src/main.jsx',
  stats: 'errors-warnings',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    pathinfo: !isProduction,
    filename: isProduction
      ? 'static/js/[name].[contenthash:8].js'
      : 'static/js/bundle.js',
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    open: false,
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    hot: 'only',
    compress: true,
    historyApiFallback: true,
    client: {
      progress: true,
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: (error) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return false;
          }
          return true;
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: path.resolve(__dirname, 'public', 'index.html'),
        },
        isProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: ['/node_modules/'],
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/syntax-dynamic-import',
              !isProduction && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
            presets: ['@babel/preset-env', '@babel/preset-react'],
            compact: false,
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
    extensions: ['.jsx', '.js', '.json', '...'],
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      // https://webpack.js.org/plugins/terser-webpack-plugin/
      isProduction &&
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            compress: {
              passes: 2,
            },
          },
        }),
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      })
    );
  } else {
    config.mode = 'development';

    config.plugins.push(
      new ReactRefreshWebpackPlugin({
        overlay: false,
      })
    );
  }
  return config;
};
