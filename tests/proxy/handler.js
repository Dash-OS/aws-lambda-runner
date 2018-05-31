/* @flow */
import run from '../../lib/runner';

export default run(
  {
    settings: {
      log: true,
    },
  },
  async (data, config) => {
    console.log('Config: ', config.settings.log);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  },
);
