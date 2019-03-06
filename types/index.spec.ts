import pSingle from './'

const delay = (t: number) =>
  new Promise<void>(resolve => setTimeout(resolve, t))

const someParams = async (a: number, b: boolean) => {
  await delay(10)
  return { val: b ? a : '' + a }
}

const singletonDelay = pSingle(delay)

singletonDelay(100).then(() => {})

const singletonParams = pSingle(someParams)
singletonParams(7, true).then(obj => obj.val)

const singletonParamsWithSerializer = pSingle(
  someParams,
  ([a, b]) => '' + a + b
)

singletonParamsWithSerializer(7, true).then(obj => obj.val)
