import run from '../../lib/runner';

export default run(
  {
    settings: {
      log: 'debug',
    },
    response: {
      headers: {
        Foo: 'bar',
      },
    },
  },
  (data, config) => {
    console.log('Config: ', config);
    console.log('Data: ', data);
    return {
      result: 'success',
    };
  },
);
