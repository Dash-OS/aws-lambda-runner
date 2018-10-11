/* @flow */

import run from '../../dist/runner';

export default run(
  {
    settings: {
      cors: true,
      log: true,
    },
  },
  () => ({
    result: 'success',
  })
);
