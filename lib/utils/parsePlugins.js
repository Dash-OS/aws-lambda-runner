/* @flow */

import type {
  Runner$PluginDefinition$Sequential,
  Runner$PluginDefinition$Parallel,
  Runner$PluginHooksIndex$Sequential,
  Runner$PluginHooksIndex$Parallel,
} from '../types/runner';

function parseRunnerPluginsSequential(
  plugins: Runner$PluginDefinition$Sequential,
  indexes: Runner$PluginHooksIndex$Sequential
) {
  plugins.forEach(plugin => {
    if (plugin instanceof Set) {
      const childIndexes: Runner$PluginHooksIndex$Parallel = {
        onExecute: new Set(),
        onComplete: new Set(),
        onError: new Set(),
      };
      parseRunnerPluginsParallel(plugin, childIndexes);
      Object.keys(childIndexes).forEach(hook => {
        if (childIndexes[hook].size > 0) {
          indexes[hook].push(childIndexes[hook]);
        }
      });
    } else {
      Object.keys(indexes).forEach(hook => {
        if (typeof plugin[hook] === 'function') {
          indexes[hook].push(plugin[hook]);
        }
      });
    }
  });
}

export default function parseRunnerPluginsParallel(
  plugins: Runner$PluginDefinition$Parallel,
  indexes: Runner$PluginHooksIndex$Parallel
) {
  plugins.forEach(plugin => {
    if (Array.isArray(plugin)) {
      // sequential resolution
      const childIndexes: Runner$PluginHooksIndex$Sequential = {
        onExecute: [],
        onComplete: [],
        onError: [],
      };
      parseRunnerPluginsSequential(plugin, childIndexes);
      Object.keys(childIndexes).forEach(hook => {
        if (childIndexes[hook].length > 0) {
          indexes[hook].add(childIndexes[hook]);
        }
      });
      return;
    } else {
      Object.keys(indexes).forEach(hook => {
        if (typeof plugin[hook] === 'function') {
          indexes[hook].add(plugin[hook]);
        }
      });
    }
  });
}
