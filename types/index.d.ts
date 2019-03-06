/**
 * Wraps a Promise-returning function so it keeps returning the same promise
 * when called against the same parameters before the promise is resolved
 * or rejected
 *
 */
declare function pSingleton<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  serializer?: (args: Parameters<F>) => string
): F

export default pSingleton
