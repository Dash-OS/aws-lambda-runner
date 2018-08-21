/* @flow */

import run from '../../lib/runner';

import RunnerPluginTest from './plugins/runner-plugin-test';

export default run(
  {
    settings: {
      log: true,
    },
    response: {
      headers: {
        Foo: 'bar',
      },
    },
    handlers: {
      onError(config) {
        console.log('Error occurred!');
        return {
          result: 'error',
          message: config.errors[0].message,
        };
      },
    },

    plugins: new Set([
      RunnerPluginTest('one'),
      [
        RunnerPluginTest('two'),
        new Set([RunnerPluginTest('three'), RunnerPluginTest('four')]),
        RunnerPluginTest('five'),
      ],
      [RunnerPluginTest('six'), RunnerPluginTest('seven')],
    ]),
  },
  (data: { body: string }, config) => {
    console.log('Config: ', config.state);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  }
);
