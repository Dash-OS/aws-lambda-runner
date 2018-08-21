/* @flow */
import type {
  Runner$PluginHooksIndex$Sequential,
  Runner$PluginHooksIndex$Parallel,
} from '../types/runner';

/*
  Hooks allow plugins to "hook" into various parts of
  the execution process for the function.  These are 
  dynamically built using the functions below to allow
  defining new hooks easily.

  Calling the hooks in 
*/

export const buildParallelPluginHooks = (): Runner$PluginHooksIndex$Parallel =>
  Object.freeze({
    onExecute: new Set(),
    onComplete: new Set(),
    onError: new Set(),
  });

export const buildSequentialPluginHooks = (): Runner$PluginHooksIndex$Sequential =>
  Object.freeze({
    onExecute: [],
    onComplete: [],
    onError: [],
  });
