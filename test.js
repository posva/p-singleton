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
    const p = pSingleton(() => new Promise(() => {}))
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

  it('rejects the promise', async () => {
    const [promise, resolve, reject] = fakePromise()
    const p = pSingleton(() => promise)
    const spy = jest.fn()
    p().catch(spy)
    expect(spy).not.toHaveBeenCalled()
    reject('hey')
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
    expect(p()).toBe(p())
  })

  it('consecutive calls with different parameters return the same promise', () => {
    const p = pSingleton(() => new Promise(() => {}))
    expect(p()).toBe(p())
    expect(p(2)).toBe(p(2))
    expect(p(2, 3)).toBe(p(2, 3))
    expect(p(2, 3)).not.toBe(p(2))
    expect(p(2)).not.toBe(p(3))
  })

  it('returns a new promise if resolves', async () => {
    let resolve
    const p = pSingleton(() => {
      const fake = fakePromise()
      resolve = fake[1]
      return fake[0]
    })
    const p1 = p()
    resolve()
    await tick()
    const p2 = p()

    expect(p1).not.toBe(p2)
  })
})
