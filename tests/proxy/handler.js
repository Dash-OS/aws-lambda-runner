/* @flow */
import run from '../../lib/runner';

export default run(
  {
    settings: {
      cors: true,
      log: true,
    },
  },
  async (data, config) => {
    console.log('Config: ', config.request.body);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  }
);
