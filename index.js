// @ts-check

/**
 *
 * @param {(...args: any[]) => Promise<any>} fn
 * @param {(args: any[]) => string} serialize
 *
 * @return {(...args: any[]) => Promise<any>}
 */
module.exports = function pSingleton(fn, serialize = JSON.stringify) {
  const runningPromises = new Map()
  return (...args) => {
    const serializedArgs = serialize(args)
    console.log(
      'checking for serialized args',
      serializedArgs,
      runningPromises.has(serializedArgs)
    )
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
