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

    plugins: [[RunnerPluginTest, {}], RunnerPluginTest],
  },
  (data: { body: string }, config) => {
    console.log('Config: ', config);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  },
);
