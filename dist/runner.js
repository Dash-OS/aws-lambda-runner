module.exports=function(r){function e(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return r[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var t={};return e.m=r,e.c=t,e.i=function(r){return r},e.d=function(r,t,n){e.o(r,t)||Object.defineProperty(r,t,{configurable:!1,enumerable:!0,get:n})},e.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(t,"a",t),t},e.o=function(r,e){return Object.prototype.hasOwnProperty.call(r,e)},e.p="",e(e.s=5)}([function(r,e,t){"use strict";function n(r,e,n,o){return t.i(a.a)("debug")&&t.i(a.b)(n,!0===n.isProxy?n.statusCode+" | Returning Response to Caller":"Returning Response to Caller:",JSON.stringify(o,null,2)),!0===n.isProxy?r(null,{statusCode:n.statusCode||n.errorCode,body:t.i(c.a)(o),headers:l({},n.cors?{"Access-Control-Allow-Origin":"*"}:void 0,n.headers)}):r(null,o)}function o(r,e,o,i,u){var s={result:"error",errors:o.errors};if(!0===o.isProxy&&200===o.statusCode&&(o.statusCode=o.errorCode||400),o.log&&t.i(a.c)(o,o.errors.join(", \n   "),u),"function"!=typeof o.onError)return n(r,e,o,s);Promise.resolve(o.onError(s,o,{data:e,result:i},u,r)).then(function(t){return!1===t?void 0:n(r,e,o,s)}).catch(function(i){return t.i(a.c)(o,i.message,i,"An Error Occurred During the Provided Error Handler","ERROR HANDLER"),o.errors.push(i.message),s.errors=o.errors,n(r,e,o,s)})}function i(r,e){for(var t=void 0,n=arguments.length,o=Array(n>2?n-2:0),i=2;i<n;i++)o[i-2]=arguments[i];switch(o.length){case 1:t=o[0],Object.assign(r,y);break;case 2:"object"!==f(o[0])?"object"===f(o[1])?e.push(u.a.argumentsOrder.apply(u.a,o)):e.push(u.a.invalidConfig.apply(u.a,o)):(Object.assign(r,y,o[0]),t=o[1]);break;default:e.push(u.a.wrongArguments.apply(u.a,o))}return t}Object.defineProperty(e,"__esModule",{value:!0});var u=t(1),s=t(3),a=t(2),c=t(4),f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},l=Object.assign||function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},y={isProxy:!1,log:!1,statusCode:200,cors:!1,headers:null,errorCode:400,onError:void 0};e.default=function(){for(var r=void 0,e={},u=[],f=arguments.length,l=Array(f),y=0;y<f;y++)l[y]=arguments[y];var p=i.apply(void 0,[e,u].concat(l));return e.errors=u,function(i,u,f){try{if(t.i(a.a)("debug")&&t.i(a.b)(e,"Starting Function Execution",!0===e.isProxy?JSON.stringify({timeRemaining:u.getRemainingTimeInMillis(),path:e.path,method:e.method,queries:e.queries,params:e.params,stage:e.stage},null,2):JSON.stringify({timeRemaining:u.getRemainingTimeInMillis()},null,2)),i&&void 0!==i.requestContext&&void 0!==i.headers?(t.i(s.a)(i,e),r=t.i(c.b)(i.body)):r=i,e.errors.length>0||"function"!=typeof p)return o(f,r,e);Promise.resolve(p(r,e,u,f)).then(function(t){return e.errors.length>0?o(f,r,e,t):n(f,r,e,t)}).catch(function(t){return e.errors.push(t.message),o(f,r,e)})}catch(t){return e.errors.push(t.message),o(f,r,e)}}}},function(r,e,t){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r};e.a={argumentsOrder:function(){return'[LAMBDA-RUNNER]\n    INVALID CONFIGURATION PROVIDED! \n    \n    Expected an "object" but received '+n(arguments.length<=0?void 0:arguments[0])+".  It appears \n    that you provided the values in an invalid order.  Try using \n    (config, fn) instead of (fn, config)."},invalidConfig:function(){return'[LAMBDA-RUNNER]\n    INVALID CONFIGURATION PROVIDED! \n    \n    Expected an "object" but received '+n(arguments.length<=0?void 0:arguments[0])},wrongArguments:function(){return"[LAMBDA-RUNNER]\n    FAILED TO INITIALIZE LAMBDA! \n    \n    Our initialization function expects either one or two arguments, however, \n    you provided "+arguments.length+" parameters."}}},function(r,e,t){"use strict";function n(r,e){return!!r.log&&(!(!0!==r.log||!s.includes(e))||(!(!Array.isArray(r.log)||!r.log.includes(e))||"debug"===r.log))}function o(r,e){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"LOG",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"log";console[n]("\n  ---------------------------------\n   "+t+" | "+r+" "+(e&&"\n   "+e)+"\n  ---------------------------------")}function i(r,e,t){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"Errors Occurred During a Request",u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"ERROR";r.log&&(n(r,"errors")&&o(i,e,u,"error"),t instanceof Error&&n(r,"exceptions")&&console.error(t))}function u(r,e,t){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"DEBUG",u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"log";n("debug")&&o(t,e,i,u)}e.a=n,e.c=i,e.b=u;var s=["errors","warnings"]},function(r,e,t){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},o={httpMethod:function(r,e){e.method=r},path:function(r,e){e.path=r},resource:function(r,e){e.resource=r},queryStringParameters:function(r,e){e.queries=r},pathParameters:function(r,e){e.params=r},stageVariables:function(r,e){e.stage=r},DEFAULT:function(r,e,t){t.request[r]=e}};e.a=function(r,e){if("object"===(void 0===r?"undefined":n(r))){e.isProxy=!0,e.request||(e.request={});for(var t in r)void 0===o[t]?o.DEFAULT(t,r[t],e):o[t](r[t],e)}}},function(r,e,t){"use strict";function n(r){try{return"string"==typeof r&&JSON.parse(r)||r}catch(e){return r}}function o(r){try{return"object"===(void 0===r?"undefined":i(r))&&JSON.stringify(r)||r}catch(e){return r}}e.b=n,e.a=o;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r}},function(r,e,t){r.exports=t(0)}]);