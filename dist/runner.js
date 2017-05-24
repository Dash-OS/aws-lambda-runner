module.exports=function(r){function t(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return r[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var e={};return t.m=r,t.c=e,t.i=function(r){return r},t.d=function(r,e,n){t.o(r,e)||Object.defineProperty(r,e,{configurable:!1,enumerable:!0,get:n})},t.n=function(r){var e=r&&r.__esModule?function(){return r.default}:function(){return r};return t.d(e,"a",e),e},t.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)},t.p="",t(t.s=5)}([function(r,t,e){"use strict";function n(r){if(Array.isArray(r)){for(var t=0,e=Array(r.length);t<r.length;t++)e[t]=r[t];return e}return Array.from(r)}function o(r){return Array.isArray(r)?r:Array.from(r)}function i(r,t,n,o){return e.i(l.a)(n,"debug")&&e.i(l.b)(n,!0===n.isProxy?n.statusCode+" | Returning Response to Caller":"Returning Response to Caller:",e.i(f.a)(o,null,2)),!0===n.isProxy?r(null,{statusCode:n.statusCode||n.errorCode,body:e.i(f.a)(o),headers:p({},n.cors?{"Access-Control-Allow-Origin":"*"}:void 0,n.headers)}):r(null,o)}function u(r,t,n,o,u){var a={result:"error",errors:n.errors};if(!0===n.isProxy&&200===n.statusCode&&(n.statusCode=n.errorCode||400),n.log&&e.i(l.c)(n,n.errors.join(", \n   "),u),"function"!=typeof n.onError)return i(r,t,n,a);Promise.resolve(n.onError(a,n,{data:t,result:o},u,r)).then(function(e){return!1===e?void 0:i(r,t,n,a)}).catch(function(o){return e.i(l.c)(n,o.message,o,"An Error Occurred During the Provided Error Handler","ERROR HANDLER"),n.errors.push(o.message),a.errors=n.errors,i(r,t,n,a)})}function a(r,t){for(var e=void 0,n=arguments.length,o=Array(n>2?n-2:0),i=2;i<n;i++)o[i-2]=arguments[i];switch(o.length){case 1:e=o[0],Object.assign(r,d);break;case 2:"object"!==y(o[0])?"object"===y(o[1])?t.push(s.a.argumentsOrder.apply(s.a,o)):t.push(s.a.invalidConfig.apply(s.a,o)):(Object.assign(r,d,o[0]),e=o[1]);break;default:t.push(s.a.wrongArguments.apply(s.a,o))}return e}Object.defineProperty(t,"__esModule",{value:!0});var s=e(1),c=e(3),l=e(2),f=e(4),y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},p=Object.assign||function(r){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n])}return r},d={isProxy:!1,log:!1,statusCode:200,cors:!1,headers:null,errorCode:400,onError:void 0,awaitEventLoop:!0,client:{},queries:{},params:{},stage:{},plugins:[]};t.default=function(){for(var r={},t=[],s=arguments.length,y=Array(s),p=0;p<s;p++)y[p]=arguments[p];var d=a.apply(void 0,[r,t].concat(y));return function(a,s,y){var p=void 0,g=Object.assign({},r,{errors:[].concat(t)});!1===g.awaitEventLoop?s.callbackWaitsForEmptyEventLoop=!1:!0===g.awaitEventLoop&&(s.callbackWaitsForEmptyEventLoop=!0);try{a&&void 0!==a.requestContext&&void 0!==a.headers?(e.i(c.a)(a,g,s),p=e.i(f.b)(a.body)):p=a,e.i(l.a)(g,"debug")&&e.i(l.b)(g,"Starting Function Execution",!0===g.isProxy?JSON.stringify({timeRemaining:s.getRemainingTimeInMillis(),path:g.path,method:g.method,queries:g.queries,params:g.params,stage:g.stage},f.c,2):JSON.stringify({timeRemaining:s.getRemainingTimeInMillis()},f.c,2));var m=g.plugins.map(function(r){var t=void 0,e=void 0;if(Array.isArray(r)){var i=o(r),u=i[0],a=i.slice(1);e=new(Function.prototype.bind.apply(u,[null].concat(n(a))))}else e=new r;return t="function"==typeof e.onBuild?e.onBuild(p,g,s,y):e,Promise.resolve(t).then(function(r){return e})});return Promise.all(m).then(function(r){return g.errors.length>0||"function"!=typeof d?u(y,p,g):Promise.resolve(d(p,g,s,y)).then(function(t){var e=r.map(function(r){if("function"==typeof r.onComplete)return r.onComplete(t,p,g,s,y)});return Promise.all(e).then(function(){return g.errors.length>0?u(y,p,g,t):i(y,p,g,t)})}).catch(function(r){return g.errors.push(r.message),u(y,p,g,a)})})}catch(r){return g.errors.push(r.message),u(y,p,g,r.message,r)}}}},function(r,t,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r};t.a={argumentsOrder:function(){return'[LAMBDA-RUNNER]\n    INVALID CONFIGURATION PROVIDED! \n    \n    Expected an "object" but received '+n(arguments.length<=0?void 0:arguments[0])+".  It appears \n    that you provided the values in an invalid order.  Try using \n    (config, fn) instead of (fn, config)."},invalidConfig:function(){return'[LAMBDA-RUNNER]\n    INVALID CONFIGURATION PROVIDED! \n    \n    Expected an "object" but received '+n(arguments.length<=0?void 0:arguments[0])},wrongArguments:function(){return"[LAMBDA-RUNNER]\n    FAILED TO INITIALIZE LAMBDA! \n    \n    Our initialization function expects either one or two arguments, however, \n    you provided "+arguments.length+" parameters."}}},function(r,t,e){"use strict";function n(r,t){return!!r.log&&(!(!0!==r.log||!a.includes(t))||(!(!Array.isArray(r.log)||!r.log.includes(t))||"debug"===r.log))}function o(r,t){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"LOG",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"log";console[n]("\n---------------------------------\n"+e+" | "+r+" "+(t&&"\n"+t)+"\n---------------------------------")}function i(r,t,e){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"Errors Occurred During a Request",u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"ERROR";r.log&&(n(r,"errors")&&o(i,t,u,"error"),e instanceof Error&&n(r,"exceptions")&&console.error(e))}function u(r,t,e,i){var u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"log";n(r,"debug")&&o(t,e,i,u)}t.a=n,t.c=i,t.b=u;var a=["errors","warnings"]},function(r,t,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},o={"User-Agent":function(r,t){t.client.agent=r},"X-Forwarded-For":function(r,t){t.client.forwardedFor=r.split(",")},"X-Forwarded-Port":function(r,t){t.client.forwardedPort=Number(r)},"CloudFront-Viewer-Country":function(r,t){t.client.country=r}},i={httpMethod:function(r,t){t.method=r},path:function(r,t){t.path=r},resource:function(r,t){t.resource=r},queryStringParameters:function(r,t){t.queries=r},pathParameters:function(r,t){t.params=r},stageVariables:function(r,t){t.stage=r},requestContext:function(r,t){r&&r.identity&&r.identity.sourceIp&&(t.client.sourceIP=r.identity.sourceIp),t.request.requestContext=r},DEFAULT:function(r,t,e){e.request[r]=t},headers:function(r,t){var e=Object.keys(o),n=Object.keys(r),i=function(e){void 0!==r[e]&&"function"==typeof o[e]&&o[e](r[e],t)};e.length>=n.length?n.forEach(i):e.forEach(i)}};t.a=function(r,t){if("object"===(void 0===r?"undefined":n(r))){t.isProxy=!0,t.request||(t.request={});for(var e in r)void 0===i[e]?i.DEFAULT(e,r[e],t):i[e](r[e],t)}}},function(r,t,e){"use strict";function n(){try{return"string"==typeof(arguments.length<=0?void 0:arguments[0])&&JSON.parse.apply(JSON,arguments)||(arguments.length<=0?void 0:arguments[0])}catch(r){return arguments.length<=0?void 0:arguments[0]}}function o(){try{return"object"===u(arguments.length<=0?void 0:arguments[0])&&JSON.stringify.apply(JSON,arguments)||(arguments.length<=0?void 0:arguments[0])}catch(r){return arguments.length<=0?void 0:arguments[0]}}function i(r,t){return void 0!==t&&null!==t?t:void 0}t.b=n,t.a=o,t.c=i;var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r}},function(r,t,e){r.exports=e(0)}]);