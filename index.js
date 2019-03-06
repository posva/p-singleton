// @ts-check

/** @typedef {(...args: any[]) => Promise<any>} ReturnsPromise */

/**
 * Wraps a Promise-returning function so it keeps returning the same promise
 * when called against the same parameters before the promise is resolved
 * or rejected
 *
 * @template {ReturnsPromise} F
 * @param {F} fn
 * @param {(...args: any[]) => string} serialize
 *
 * @return {(...args: Parameters<F>) => ReturnType<F>}
 */
module.exports = function pSingleton (fn, serialize = JSON.stringify) {
  /** @type {Map<string, ReturnType<F>>} */
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
