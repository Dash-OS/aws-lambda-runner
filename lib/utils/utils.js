// Try to parse as body -- return untouched if it fails
export function tryParseJSON(j) {
  try {
    return typeof j === 'string' && JSON.parse(j) || j
  } catch (e) { return j }
}

// Try to stringify, return untouched if fails.
export function tryStringifyJSON(o) {
  try {
    return typeof o === 'object' && JSON.stringify(o) || o
  } catch (e) { return o }
}