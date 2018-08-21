/* @flow */
// Try to parse as body -- return untouched if it fails

export function tryParseJSON(...args: any[]) {
  try {
    return (typeof args[0] === 'string' && JSON.parse(...args)) || args[0];
  } catch (e) {
    return args[0];
  }
}

// Try to stringify, return untouched if fails.
export function tryStringifyJSON(...args: any[]) {
  try {
    return (typeof args[0] === 'object' && JSON.stringify(...args)) || args[0];
  } catch (e) {
    return args[0];
  }
}

export function noNil(k: any, v: any) {
  return v !== undefined && v !== null ? v : undefined;
}
