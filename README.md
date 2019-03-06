# p-singleton [![Build Status](https://badgen.net/circleci/github/posva/p-singleton)](https://circleci.com/gh/posva/p-singleton) [![npm package](https://badgen.net/npm/v/p-singleton)](https://www.npmjs.com/package/p-singleton) [![coverage](https://badgen.net/codecov/c/github/posva/p-singleton)](https://codecov.io/github/posva/p-singleton) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Ensure only one version of a Promise-returning function is running at a time

## Installation

```sh
npm install p-singleton
```

## Usage

```js
const pSingleton = require('p-singleton')

// any function that returns a promise
function fetchUserDetailsAndDoSomething(id) {
  return fetch('/api/users/' + id).then(res => res.json())
}

const singletonUserFetch = pSingleton(fetchUserDetailsAndDoSomething)

const p1 = singletonUserFetch(2)
const p2 = singletonUserFetch(2)
const p3 = singletonUserFetch(3)
p1 === p2 // pointing to the same promise
p1 !== p3 // different promises because it was called with different arguments

// wait for p1 to resolve
await p1
const p4 = singletonUserFetch(2)
p4 !== p1 // a new promise is created
```

`p-singleton` uses `JSON.stringify` to cache existing promises by using the arguments passed to the function call (`singletonUserFetch` in the example) as the key. Then it hops into its `finally` hook to remove the promise from the cache so a new one is created the next time the function is called.
This will work out well most of the times but if you need something more performant (specially when dealing with objects as arguments) you can provide your own implementation:

```js
const singletonFetchUser = pSingleton(fetchData, ([user]) => user.id) // uses the id as the key
singletonFetchUser({ id: 1 })

const singletonFetchDocument = pSingleton(fetchData, ([user, options]) => `${user.id};${options.includeRefs}`) // uses multiple arguments
singletonFetchDocument({ id: 1 }),{ includeRefs: true })
```

## API

### `pSingleton(fn: (...args: any[]) => Promise<any>, serializer?: (...args: any[]) => string)) => (...args: any[]) => Promise<any>`

- `fn`: function that returns a Promise
- `serializer`: optional serializer function, defaults to JSON.stringify

returns a function that returns a Promise

## Related

- [p-fun](https://github.com/sindresorhus/promise-fun)

## License

[MIT](http://opensource.org/licenses/MIT)
