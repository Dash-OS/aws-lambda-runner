
const DEFAULT_LOG_LEVELS = [ 'errors', 'warnings' ]

export function isLogLevel (config, level) {
  if ( ! config.log ) { return false }
  if ( config.log === true && DEFAULT_LOG_LEVELS.includes(level) ) {
    return true
  } else if ( Array.isArray(config.log) && config.log.includes(level) ) {
    return true
  } else if ( config.log === 'debug' ) {
    return true
  } else { return false }
}

function log (
  header, message,
  category = 'LOG',
  type = 'log'
) { console[type](`
  ---------------------------------
   ${category} | ${header} ${message && `\n   ${message}`}
  ---------------------------------`)
}

export function handleLogError (
  config, message, exception,
  header = 'Errors Occurred During a Request', 
  category = 'ERROR'
) {
  if ( ! config.log ) { return }
  if (isLogLevel(config, 'errors')) {
    log(header, message, category, 'error')
  }
  if (exception instanceof Error && isLogLevel(config, 'exceptions')) {
    console.error(exception) 
  }
}

export function handleLogDebug (
  config, header, message, category,
  type = 'log'
) { if ( isLogLevel(config, 'debug') ) {
  log(header, message, category, type)
} }