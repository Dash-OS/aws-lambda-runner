/* @flow */

import type { Runner$TopConfig, Runner$Function, Runner$Arguments } from '../types/runner';

import errors from './errors';

import { getDefaultConfig } from './getConfig';

export default function parseArgs(
  top: Runner$TopConfig,
  args: Runner$Arguments
): void | Runner$Function {
  let runner: Runner$Function;
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
