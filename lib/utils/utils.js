// Try to parse as body -- return untouched if it fails
export function tryParseJSON(...args) {
  try {
    return typeof args[0] === 'string' && JSON.parse(...args) || args[0]
  } catch (e) { return args[0] }
}

// Try to stringify, return untouched if fails.
export function tryStringifyJSON(...args) {
  try {
    return typeof args[0] === 'object' && JSON.stringify(...args) || args[0]
  } catch (e) { return args[0] }
}

export function noNil(k, v) { return v !== undefined && v !== null ? v : undefined }