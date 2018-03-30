/* @flow */

import run from '../../lib/runner';
import RunnerPluginTest from './plugins/runner-plugin-test';

export default run(
  {
    response: {
      headers: {
        Foo: 'bar',
      },
    },
    settings: {
      log: true,
    },
    plugins: [RunnerPluginTest],
  },
  (data, config) => {
    console.log('Config: ', config);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  },
);
