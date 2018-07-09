/* @flow */

import run from '../../dist/runner';

export default run(
  {
    settings: {
      log: true,
    },
  },
  () => ({
    result: 'success',
  })
);
