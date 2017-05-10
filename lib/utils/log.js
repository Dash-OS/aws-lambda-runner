
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
  config, message, header,
  category = 'DEBUG',
  type = 'log'
) {
  if ( isLogLevel('debug') ) {
    log(header, message, category, type)
  }
}