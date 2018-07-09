/* @flow */
import type { RunnerPluginInterface, RunnerRuntimeConfig } from './types/runner';

import type { LambdaData, LambdaContextObject, LambdaCallbackFunction } from './types/lambda';

let i = 0;

export opaque type PluginIDType: string = string;

function generatePluginID(): PluginIDType {
  i += 1;
  return `RunnerPlugin-${i}`;
}

// Flow Requires this because it is broken
export default class RunnerPlugin<PS> extends Object implements RunnerPluginInterface<PS> {
  pluginID: PluginIDType = generatePluginID();
  settings: PS;

  onExecute: (
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;

  onComplete: (
    result: any,
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;

  onError: (
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;

  // eslint-disable-next-line no-unused-vars
  constructor(settings?: void | $Shape<PS>, ...args: Array<any>) {
    super(...args);
    if (settings) {
      this.settings = settings;
    }
  }
}
