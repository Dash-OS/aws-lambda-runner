module.exports=function(t){function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var e={};return n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=3)}([function(t,n,e){"use strict";function o(t){try{return"string"==typeof t&&JSON.parse(t)||t}catch(n){return t}}function r(t){try{return"object"===(void 0===t?"undefined":c(t))&&JSON.stringify(t)||t}catch(n){return t}}Object.defineProperty(n,"__esModule",{value:!0});var u=e(1),i=e(2),s=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a={statusCode:200,headers:null,cors:!1,isProxy:!1},f=function(t,n,e){return e(null,{statusCode:t.statusCode||400,body:r(n),headers:s({},t.cors?{"Access-Control-Allow-Origin":"*"}:void 0,t.headers)})};n.default=function(){var t=void 0,n=void 0,r=[];switch(arguments.length){case 1:n=arguments.length<=0?void 0:arguments[0],t=Object.assign({},a);break;case 2:"object"!==c(arguments.length<=0?void 0:arguments[0])?"object"===c(arguments.length<=1?void 0:arguments[1])?r.push(u.a.argumentsOrder.apply(u.a,arguments)):r.push(u.a.invalidConfig.apply(u.a,arguments)):(t=Object.assign({},a,arguments.length<=0?void 0:arguments[0]),n=arguments.length<=1?void 0:arguments[1]);break;default:r.push(u.a.wrongArguments.apply(u.a,arguments))}return function(u,s,a){var l=void 0;if(r.length>0||"function"!=typeof n||"object"!==(void 0===t?"undefined":c(t)))return t.statusCode=400,f(t,{result:"error",errors:r},a);u&&void 0!==u.requestContext&&void 0!==u.headers?(e.i(i.a)(u,t),l=o(u.body)):l=u;try{Promise.resolve(n(l,t,s,a)).then(function(n){return!1===t.isProxy?a(null,n):f(t,n,a)}).catch(function(n){return!1===t.isProxy?a(n):(200===t.statusCode&&(t.statusCode=400),r.push(n.message),f(t,{result:"error",errors:r},a))})}catch(n){return!1===t.isProxy?a(n):(200===t.statusCode&&(t.statusCode=400),r.push(n.message),f(t,{result:"error",errors:r},a))}}}},function(t,n,e){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};n.a={argumentsOrder:function(){return'\n    [LAMBDA-RUNNER]\n    INVALID CONFIGURATION PROVIDED! \n    \n    Expected an "object" but received '+o(arguments.length<=0?void 0:arguments[0])+".  It appears \n    that you provided the values in an invalid order.  Try using \n    (config, fn) instead of (fn, config).\n  "},invalidConfig:function(){return'\n    [LAMBDA-RUNNER]\n    INVALID CONFIGURATION PROVIDED! \n    \n    Expected an "object" but received '+o(arguments.length<=0?void 0:arguments[0])+"\n  "},wrongArguments:function(){return"\n    [LAMBDA-RUNNER]\n    FAILED TO INITIALIZE LAMBDA! \n    \n    Our initialization function expects either one or two arguments, however, \n    you provided "+arguments.length+" parameters.\n    \n    Example:\n    \n    [ config, fn ] || [ fn ]\n    \n    Example Function:\n    \n    export default run({ /* config */ }, ({ body }) => {\n      // Function Body\n    })\n  "}}},function(t,n,e){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r={httpMethod:function(t,n){n.method=t},path:function(t,n){n.path=t},resource:function(t,n){n.resource=t},queryStringParameters:function(t,n){n.queries=t},pathParameters:function(t,n){n.params=t},stageVariables:function(t,n){n.stage=t},DEFAULT:function(t,n,e){e.request[t]=n}};n.a=function(t,n){if("object"===(void 0===t?"undefined":o(t))){n.isProxy=!0,n.request||(n.request={});for(var e in t)void 0===r[e]?r.DEFAULT(e,t[e],n):r[e](t[e],n)}}},function(t,n,e){t.exports=e(0)}]);