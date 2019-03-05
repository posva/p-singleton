const fakePromise = require('faked-promise')
const pSingleton = require('./index')

const tick = () => new Promise(r => setImmediate(r))

describe('p-singleton', () => {
  it('returns a promise', () => {
    const promise = new Promise(() => {})
    const p = pSingleton(() => promise)
    expect(p() instanceof Promise).toBe(true)
  })

  it('can be called multiple times', () => {
    const promise = new Promise(() => {})
    const p = pSingleton(() => promise)
    expect(p() instanceof Promise).toBe(true)
    expect(p() instanceof Promise).toBe(true)
    expect(p() instanceof Promise).toBe(true)
  })

  it('resolves the promise', async () => {
    const [promise, resolve] = fakePromise()
    const p = pSingleton(() => promise)
    const spy = jest.fn()
    p().then(spy)
    expect(spy).not.toHaveBeenCalled()
    resolve('hey')
    await tick()
    expect(spy).toHaveBeenCalledWith('hey')
  })

  it('resolves all the chained then', async () => {
    const [promise, resolve] = fakePromise()
    const p = pSingleton(() => promise)
    const spy = jest.fn()
    p().then(spy)
    p().then(spy)
    p().then(spy)
    expect(spy).not.toHaveBeenCalled()
    resolve('hey')
    await tick()
    expect(spy).toHaveBeenCalledWith('hey')
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('consecutive calls return the same promise', () => {
    const [promise, resolve] = fakePromise()
    const p = pSingleton(() => promise)
    const spy = jest.fn()
    expect(p()).toBe(p())
  })
})
