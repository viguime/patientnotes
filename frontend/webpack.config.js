const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
require('dotenv').config();

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/index.tsx',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'inline-source-map' : 'source-map',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      clean: true,
      publicPath: 'auto',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:3000'),
      }),
      new ModuleFederationPlugin({
        name: 'patientNotes',
        filename: 'remoteEntry.js',
        exposes: {
          './PatientNotesApp': './src/App',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Patient Notes',
      }),
    ],

    devServer: {
      port: 3001,
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      static: {
        directory: path.join(__dirname, 'public'),
      },
    },

    optimization: {
      minimize: !isDevelopment,
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};
