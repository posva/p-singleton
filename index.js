/**
 * Wraps a Promise-returning function so it keeps returning the same promise
 * when called against the same parameters before the promise is resolved
 * or rejected
 *
 */
module.exports = function pSingleton (fn, serialize = JSON.stringify) {
  const runningPromises = new Map()

  return (...args) => {
    const serializedArgs = serialize(args)

    if (runningPromises.has(serializedArgs)) {
      return runningPromises.get(serializedArgs)
    }

    const promise = fn(...args).finally(() => {
      runningPromises.delete(serializedArgs)
    })

    runningPromises.set(serializedArgs, promise)
    return promise
  }
}
