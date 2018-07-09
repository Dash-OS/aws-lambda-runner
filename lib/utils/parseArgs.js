/* @flow */

import type {
  RunnerTopConfig,
  RunnerFunction,
  // RunnerConfig,
  RunnerArguments,
} from '../types/runner';

import errors from './errors';

import { getDefaultConfig } from './getConfig';

export default function parseArgs(
  top: RunnerTopConfig,
  args: RunnerArguments
): void | RunnerFunction {
  let runner: RunnerFunction;
  switch (args.length) {
    case 1: {
      if (typeof args[0] === 'function') {
        [runner] = args;
      } else {
        top.config.errors.push(errors.invalidConfig(args));
      }
      break;
    }
    case 2: {
      if (typeof args[0] === 'object' && typeof args[1] === 'function') {
        [, runner] = args;
        top.config = getDefaultConfig(top.config, args[0]);
      } else {
        top.config.errors.push(errors.invalidConfig(args));
      }
      break;
    }
    default: {
      top.config.errors.push(errors.wrongArguments(args));
      break;
    }
  }
  return runner;
}
