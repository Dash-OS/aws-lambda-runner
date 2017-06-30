// https://github.com/Dash-OS/promise-map-es6
import PromiseMap from 'promise-map-es6';

/*
  Adds a PromiseMap to our config under the 'promises' key which resolves and
  adds the resolved result to our response.
*/
export default class PromiseMapPlugin {
  onBuild = (data, config) => {
    config.promises = new PromiseMap();
  };
  onComplete = (response, data, config /* ctx , cb */) =>
    new Promise((resolve /* reject */) => {
      if (config.promises.size > 0) {
        return config.promises.then(result => {
          Object.assign(response, result);
          return resolve();
        });
      }
      resolve();
    });
}
