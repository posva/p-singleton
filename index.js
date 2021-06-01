module.exports = function pSingleton (fn, serialize = JSON.stringify) {
  const runningPromises = new Map()

  return function wrappedPromise (/* ...args */) {
    const serializedArgs = serialize(arguments)

    if (runningPromises.has(serializedArgs)) {
      return runningPromises.get(serializedArgs)
    }

    const promise = fn.apply(this, arguments).finally(() => {
      runningPromises.delete(serializedArgs)
    })

    runningPromises.set(serializedArgs, promise)
    return promise
  }
}
