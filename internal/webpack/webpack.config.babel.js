import path from 'path';
// eslint-disable-next-line import/no-unresolved
import webpack from 'webpack';

// // Resolves folders with /{name}/{name}.js first then falls back to /{name}/index.js
// import { factory as componentResolver } from 'component-webpack-resolver-plugin';
// Capture the root directory of the application
import getRootDir from 'app-root-dir';

const rootDir = getRootDir.get();

console.log('ROOT ', rootDir);

export default {
  context: rootDir,

  /* Do Not Change */
  entry: ['./lib/runner.js'],

  /* Used so that we resolve files using async fs instead of node require() */
  target: 'async-node',

  /* Main addition to Webpack 4, provides zero-config presets for production / development */
  mode: 'production',

  /* aws-sdk included in lambda so we dont want to expect that it is packaged */
  externals: ['aws-sdk'],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              /* Don't use the babelrc file */
              babelrc: false,
              cacheDirectory: true,
              presets: [
                /* Strips any FlowTypes */
                '@babel/preset-flow',
                [
                  /* Automatically determine required polyfills, add where needed */
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    modules: false, // needed for tree-shaking
                    targets: {
                      node: '6.10', // current lambda runtime
                    },
                  },
                ],
                /* Fun */
                '@babel/preset-stage-0',
              ],
              plugins: [
                // [
                //   '@babel/plugin-transform-runtime',
                //   {
                //     helpers: false,
                //     polyfill: false,
                //     regenerator: false,
                //   },
                // ],
                'lodash',
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],

  output: {
    libraryTarget: 'commonjs2',
    path: path.join(rootDir, '.webpack'),
    filename: '[name].js',
  },
};
