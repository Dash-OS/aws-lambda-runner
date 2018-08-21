/* @flow */

import type {
  Runner$PluginDefinition$Sequential,
  Runner$PluginDefinition$Parallel,
  Runner$PluginHooksIndex$Sequential,
  Runner$PluginHooksIndex$Parallel,
} from '../types/runner';

import { buildParallelPluginHooks, buildSequentialPluginHooks } from './context';

function parseRunnerPluginsSequential(
  plugins: Runner$PluginDefinition$Sequential,
  indexes: Runner$PluginHooksIndex$Sequential
) {
  plugins.forEach(plugin => {
    if (typeof plugin !== 'object') {
      return;
    }
    if (plugin instanceof Set) {
      const childIndexes = buildParallelPluginHooks();
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
    if (typeof plugin !== 'object') {
      return;
    }
    if (Array.isArray(plugin)) {
      const childIndexes = buildSequentialPluginHooks();
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
