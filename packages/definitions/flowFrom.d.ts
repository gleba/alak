type UnpackedPromise<T> = T extends Promise<infer U> ? U : T
type UnpackedFlow<T> = T extends (...args: any[]) => infer U ? U : T
type ReturnArrayTypes<T extends any[]> = { [K in keyof T]: UnpackedPromise<UnpackedFlow<T[K]>> }
type FromHandler<T, A extends any[]> = {
  (...a: ReturnArrayTypes<A>): T | PromiseLike<T>
}
type FromFlowFn<T, A extends any[]> = {
  (fn: FromHandler<T, A>): T
}
interface AFlowFrom<T, A extends any[]> {
  quantum: FromFlowFn<T, A>
  some: FromFlowFn<T, A>
  strong: FromFlowFn<T, A>
  weak: FromFlowFn<T, A>
}
