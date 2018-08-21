/* @flow */
import type {
  Runner$RuntimeConfig,
  Runner$PluginHooks$Parallel,
  Runner$PluginHooks$Sequential,
} from '../types/runner';

import type { Lambda$CallbackFunction, Lambda$ContextObject, Lambda$Data } from '../types/lambda';

/**
 * Execution Hooks are called for any plugins that define them.
 * When we startup we run through and create a descriptor that
 * tells us the flow of the execution where:
 */
export default function handleExecuteHooksParallel(
  hooks: Runner$PluginHooks$Parallel,
  data: Lambda$Data,
  config: Runner$RuntimeConfig,
  context: Lambda$ContextObject,
  callback: Lambda$CallbackFunction
) {
  return Promise.all(
    Array.from(hooks).map(hook => {
      if (Array.isArray(hook)) {
        return handleExecuteHooksSequential(hook, data, config, context, callback);
      } else {
        return hook(data, config, context, callback);
      }
    })
  );
}

async function handleExecuteHooksSequential(
  hooks: Runner$PluginHooks$Sequential,
  data: Lambda$Data,
  config: Runner$RuntimeConfig,
  context: Lambda$ContextObject,
  callback: Lambda$CallbackFunction
) {
  let r = Promise.resolve();
  return Promise.all(
    hooks.reduce((p, hook) => {
      r = r.then(() => {
        if (hook instanceof Set) {
          return handleExecuteHooksParallel(hook, data, config, context, callback);
        } else if (typeof hook === 'function') {
          return hook(data, config, context, callback);
        } else {
          return hook;
        }
      });
      p.push(r);
      return p;
    }, [])
  );
}
