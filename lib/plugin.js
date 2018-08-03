/* @flow */
import type { RunnerPluginInterface, RunnerRuntimeConfig } from './types/runner';

import type { LambdaData, LambdaContextObject, LambdaCallbackFunction } from './types/lambda';

// Flow Requires this because it is broken
export default class RunnerPlugin<PC, PS = void> extends Object
  implements RunnerPluginInterface<PC, PS> {
  settings: PC;
  state: PS;

  static getDefaultState: () => PS;

  onExecute: (
    data: LambdaData,
    config: RunnerRuntimeConfig,
    context: LambdaContextObject,
    callback: LambdaCallbackFunction
  ) => Promise<void> | void;

  onComplete: (
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

  constructor(settings?: void | PC, ...args: Array<any>) {
    super(...args);
    if (settings) {
      this.settings = settings;
    }
  }
}
