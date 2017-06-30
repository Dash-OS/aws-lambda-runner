export default {
  argumentsOrder: (...args) =>
    `[LAMBDA-RUNNER]
    INVALID CONFIGURATION PROVIDED!

    Expected an "object" but received ${typeof args[0]}.  It appears
    that you provided the values in an invalid order.  Try using
    (config, fn) instead of (fn, config).`,
  invalidConfig: (...args) =>
    `[LAMBDA-RUNNER]
    INVALID CONFIGURATION PROVIDED!

    Expected an "object" but received ${typeof args[0]}`,
  wrongArguments: (...args) =>
    `[LAMBDA-RUNNER]
    FAILED TO INITIALIZE LAMBDA!

    Our initialization function expects either one or two arguments, however,
    you provided ${args.length} parameters.`,
};
