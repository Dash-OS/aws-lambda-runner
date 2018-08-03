/* @flow */
import run from '../../lib/runner';

export default run(
  {
    settings: {
      log: true,
    },
  },
  async (data, config) => {
    console.log('Config: ', config.request.body);
    console.log('Data: ', data);
    return {
      result: 'success',
      data,
    };
  }
);
