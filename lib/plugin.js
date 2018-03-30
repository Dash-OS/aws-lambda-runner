/* @flow */
import type { RunnerPluginInterface, RunnerRuntimeConfig } from './types/runner';

import type { LambdaData, LambdaContextObject, LambdaCallbackFunction } from './types/lambda';

let i = 0;

function generatePluginID() {
  i += 1;
  return `RunnerPlugin-${i}`;
}

// Flow Requires this because it is broken
export default class RunnerPlugin<PS> extends Object implements RunnerPluginInterface<PS> {
  pluginID: string = generatePluginID();
  settings: PS;

  onExecute: (
    data: LambdaData,
    config: RunnerRuntimeConfig<PS>,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction,
  ) => Promise<void> | void;

  onComplete: (
    result: any,
    data: LambdaData,
    config: RunnerRuntimeConfig<PS>,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction,
  ) => Promise<void> | void;

  onError: (
    data: LambdaData,
    config: RunnerRuntimeConfig<PS>,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction,
  ) => Promise<void> | void;

  // eslint-disable-next-line
  constructor(settings: PS, ...args: Array<*>) {
    super(...args);
    this.settings = settings;
  }
}
