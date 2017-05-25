# PromiseMap

> **Note:** This documentation is unfinisehd and it will become its own package
> once we have had the chance to complete it.  The package itself should be complete.

## Overview

PromiseMap attempts to take the ideas of `Map` and `Promise` and combine them 
into a useful tool for handling situations where you may be working with multiple 
promises simultaneously.

It does behave differently in a few aspects from `Map`.

  - Consuming (getting) values removes them from the Map once resolved.
  - Due to the above, we accept an array of keys to resolve / get
  - Values are resolved deeply if possible.

## Simple Example

```javascript
// assuming timeoutPromised() is:
const timeoutPromised = (fn, delay) => new Promise((resolve, reject) => {
  setTimeout(() => { try { resolve(fn()) } catch (e) { reject(e) } }, delay)
})
export default timeoutPromised
```

```javascript
import PromiseMap from 'PromiseMap'
import timeoutPromised from './timeoutPromised'

const P = new PromiseMap()

P.set('foo', timeoutPromised(() => 1, 1000))
P.set('bar', timeoutPromised(() => 2, 2000))
P.set('baz', timeoutPromised(() => 3, 3000))

P.then(result => console.log(result))
// after 3 seconds: { foo: 1, bar: 2, baz: 3 }
```

## PromiseMap Syntax

> **Note:** All examples extend the example above by replacing the final function call.

### Properties

#### PromiseMap.prototype.size

Returns the number of key/value pairs in the PromiseMap object.

```js
P.size; // 3
```

**returns** ***Number*** *Map.size*
### Methods


#### PromiseMap.prototype.clear()

Removes all key/value pairs from the PromiseMap object.  All promises are simply 
ignored without resolution since Promises are not cancellable by design.

```js
P.size; // 3
P.clear();
P.size; // 0
```

**returns** _undefined_

#### PromiseMap.prototype.delete(...keys)

Deletes the given key(s) and returns the result for each.  Each result is the 
result of running the [`delete`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete) 
method on the underlying `Map`.

```js
P.size; // 3
P.delete('foo', 'baz'); // [true, true]
P.size; // 1
```

**returns** ***Array*** *keys.map(k => Map.delete(k))*

#### PromiseMap.prototype.entries(?...keys?)

Returns a Promise which resolves to a standard `entries()` result where each value 
is resolved.  If *keys* is provided then only the given keys will be resolved.  All 
resolved values are removed from the `PromiseMap` once consumed.

```js
P.entries().then(entries => {
  console.log(entries); // [ ['foo', 1], ['bar', 2], ['baz', 3] ]
})
P.size; // 0
```

```js
P.entries('foo', 'baz').then(entries => {
  console.log(entries); // [ ['foo', 1], ['baz', 3] ]
})
P.size; // 1
```

**returns** ***Promise*** *.then(entries)*

#### PromiseMap.prototype.get(...keys)

Returns a Promise which resolves with an object that represents the resolved key/value pairs 
that were requested.  All resolved values are removed from the `PromiseMap` once consumed.

```js
P.get('foo').then(result => console.log(result)); // { foo: 1 }
P.size; // 2
```

**returns** ***Promise*** *.then(result)*

#### PromiseMap.prototype.has(...keys)

Returns _Boolean_ whether all given keys are within the `PromiseMap`. 

```js
P.has('foo'); // true
P.has('foo', 'bar'); // true
P.has('foo', 'bar', 'blah'); // false
```

**returns** ***Boolean*** *keys.every(k => Map.has(k))*

#### PromiseMap.prototype.push(...Promises)

Adds promises that will be resolved when the `PromiseMap` is resolved, however, the 
values will not be included in the resolved value.  This is helpful for situations that 
you want to be sure various functions have completed before continuing, but don't want their 
resolved values to affect the final object.

```js
P.push(timeoutPromised(() => 4, 10000))
P.then(result => console.log(result))
// after 10 seconds: { foo: 1, bar: 2, baz: 3 }
```

**returns** ***undefined***

#### PromiseMap.prototype.then(onResolve, onReject)

Resolves the entire PromiseMap and returns the result.  PromiseMap will be empty once completed. 
Note that the second argument (onReject) is better handled by chaining a .catch().

```js
P.then(result => console.log(result)); // { foo: 1, bar: 2, baz: 3 }
P.size; // 0
```
**returns** ***Promise*** *.then(result, error)*

#### PromiseMap.prototype.catch(fn)

Resolves the entire PromiseMap and only registers a callback to occur should an error be 
caught while resolving the values.  Note that since this consumes the values you will not 
be able to retrieve them when using this method.

```js
P.add('errorExample', timeoutPromised(() => { throw new Error('Fail') }))
P.catch(e => console.log(e.name, e.message)); //  errorExample Fail
P.size; // 0
```

**returns** ***Promise***