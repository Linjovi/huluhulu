const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.tsx',
    blog: './src/blog.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/blog/, to: '/blog/index.html' },
        { from: /./, to: '/index.html' },
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern-compiler',
              sassOptions: {
                silenceDeprecations: ['legacy-js-api'],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/favicon.png',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/blog.html',
      filename: 'blog/index.html',
      favicon: './src/favicon.png',
      chunks: ['blog'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/apps/diary/content',
          to: 'diary/content',
        },
      ],
    }),
  ],
};
