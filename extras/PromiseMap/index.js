const isIterable = v => typeof v[Symbol.iterator] === 'function'
const isMap = v => v instanceof Map
const isPMap = v => v instanceof PromiseMap

/*

  Maps promises into an object which can be resolved to build a final 
  representation of the data.  This allows us to add promises at various 
  points in time and resolve it to get a final request response.
  
  "pushing" Promises will resolve the given promises before continuing without
  adding them to the final response object.
  
  The API is a mix of `Map` and `Array`
  
  const PMap = new PromiseMap()
  
  PMap.push(new Promise(resolve => setTimeout(() => resolve(1), 1000)))
  PMap.set('myKey', new Promise(resolve => setTimeout(() => resolve(2), 1000)))
  
  PMap.then(obj => {
    // { myKey: 2 }
  })
  
*/
class PromiseMapException {
  constructor(key, reason) {
    this.name = key
    this.message = reason
  }
}

class DeadPromise { constructor(name) { this.name = name } }

const resolveIterable = (key, obj, promises, response) => {
  if ( isMap(obj) ) {
    response[key] = {}
    resolveMap(obj, promises, response[key])
  } else {
    promises.push(
      Promise.all(obj).then(r => {
        if ( key instanceof DeadPromise ) { return }
        if ( Array.isArray(key) ) {
          let i = 0
          for ( let _key of key ) {
            response[_key] = r[i++]
          }
        } else  {
          response[key] = r
        }
      })
    )
  }
}

const resolveMap = (map, promises, response) => {
  for ( let [key, value] of map ) {
    resolveKey(key, value, promises, response)
  }
}

const resolveKey = (key, promise, promises, response) => {
  if ( ! promise ) { return }
  if ( typeof promise === 'object' ) {
    if ( typeof promise.then === 'function' ) {
      promises.push(
        Promise.resolve(promise)
          .then(result => { 
            if ( key instanceof DeadPromise ) { return }
            if ( Array.isArray(response) ) {
              response.push([key, result])
            } else {
              response[key] = result 
            }
          })
          .catch(e => {
            throw new PromiseMapException(key, e.message)
          })
      )
    } else if ( isIterable(promise) ) {
      resolveIterable(key, promise, promises, response)
    } else {
      response[key] = promise
    }
  }
}

const resolveDeep = (key, promise, response) => {
  const promises = []
  resolveKey(key, promise, promises, response)
  return Promise.all(promises)
}

export default class PromiseMap {
  promises = new Map()
  get size() { return this.promises.size }
  get length() { return this.promises.size }
  forEach = (...args) => { return this.promises.forEach(...args) }
  keys = () => { return this.promises.keys() }
  get = (...keys) => { return this.resolve(keys) }
  set = (key, promise) => {
    if ( this.promises.has(key) ) {
      throw new Error(`Promise by key ${key} already added, each must be unique`)
    } else {
      this.promises.set(key, promise)
    }
    return this
  }
  // adds promises which will be resolved but will not be added to the resulting
  // response once resolved.  Any keys which are instances of DeadPromise will 
  // not be added to the final results. 
  push = (...promises) => {
    for ( let promise of promises ) { this.set(new DeadPromise, promise) }
  }
  // delete one or more keys from our list of promises
  delete = (...keys) => {
    const response = []
    for ( let key of keys ) { response.push(this.promises.delete(key)) }
    return response
  }
  clear = () => { return this.delete(this.keys()) }
  has = (...keys) => { return keys.every(key => this.promises.has(key)) }
  // Resolve the given keys, return the results, remove from promises
  // if no keys are given, resolve all
  resolve = (keys, response = {}, promises = []) => {
    if ( ! keys ) { keys = [...this.promises.keys()] }
    if ( ! Array.isArray(keys) ) { keys = [ keys ] }
    for ( let key of keys ) {
      const promise = this.promises.get(key)
      this.promises.delete(key)
      promises.push(
        resolveDeep(key, promise, response)
      )
    }
    return Promise.all(promises).then(r => response)
  }
  entries = (...keys) => { return this.resolve(keys, []) }
  [Symbol.iterator] = function*() {
    for ( let [key, value] of this.promises ) {
      yield this.resolve(key)
    }
  }
  then = (resolve, reject) => this.resolve().then(resolve).catch(reject)
  catch = (reject) => this.resolve().then().catch(reject)
}
