type ReturnsPromise = (...args: any[]) => Promise<any>

declare function pSingleton<F extends ReturnsPromise>(
  fn: F,
  serializer?: (args: Parameters<F>) => string
): F

export default pSingleton
