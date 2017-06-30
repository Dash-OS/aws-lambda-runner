// NOTE: paths are relative to each functions folder
import path from 'path';
import Webpack from 'webpack';
// import BabiliPlugin from 'babili-webpack-plugin';

export default {
  entry: ['./lib/runner.js'],
  target: 'async-node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'runner.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // Don't use the babelrc file!
              babelrc: false,
              presets: [
                'stage-0',
                // Setup for TreeShaking
                [
                  'env',
                  {
                    modules: false,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Webpack.NoEmitOnErrorsPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // if you'd rather use babili for your minification
    // new BabiliPlugin(),
    new Webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      sourceMap: false,
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
  ],
};
