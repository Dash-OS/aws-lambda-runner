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

    plugins: [[RunnerPluginTest, { stateID: 'slack', foo: 'bar' }]],
  },
  (data: { body: string }, config) => {
    const { payload } = config.state.slack;
    console.log('Config: ', config.state);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  }
);
