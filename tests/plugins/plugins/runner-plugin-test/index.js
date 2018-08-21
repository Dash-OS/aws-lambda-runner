/* @flow */
import util from 'util';

import type { Runner$PluginInterface } from '../../../../lib/types/runner';

const wait = setTimeout[util.promisify.custom];

let i = 0;

const start = Date.now();

const RunnerPluginTestFactory = (id: string): Runner$PluginInterface => {
  let n = i;
  i += 1;
  let isError = false;
  let cancelPromise;
  let timeoutID;

  return {
    onExecute() {
      return new Promise((resolve, reject) => {
        cancelPromise = reject;
        // if (id === 'two') {
        //   return reject(Error('Death'));
        // }
        timeoutID = setTimeout(() => {
          console.log('onExecute: ', id, n, Date.now() - start);
          resolve();
        }, 5000);
      });
    },
    async onComplete() {
      if (!isError) {
        await wait(5000);
        console.log('onComplete: ', id, n, Date.now() - start);
      }
    },
    async onError() {
      isError = true;
      console.log('onError: ', id, n, Date.now() - start);
      clearTimeout(timeoutID);
      if (cancelPromise) {
        // cancelPromise(id);
      }
    },
  };
};

export default RunnerPluginTestFactory;
