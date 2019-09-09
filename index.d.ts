export interface AFlow<T> {
  /** get value*/
  v: T
  /** get value*/
  value: T
  /** does the box contain any value, 'null' and 'undefined' are also values*/
  isEmpty: boolean
  /** get string value to identify the flow*/
  id: string
  /** add event listener for change async state of data, "await, ready, etc...
   *@experimental*/
  on: AboutStateEvents
  /** remove event listener for change async state of data, "await, ready, etc...
   * @experimental*/
  off: AboutStateEvents
  /** unsubscribe all listeners*/
  clear(): void
  /** delete value*/
  clearValue(): void
  /** close flow, force free memory*/
  close(): void
  /** send values to the listening functions*/
  notify(): void
  /** add listener to the value changes*/
  up(fn: ValueReceiver<T>): void
  /** add listener to the value changes since the next update*/
  next(fn: ValueReceiver<T>): void
  /** remove receiving function*/
  down(fn: ValueReceiver<T>): void
  /** only one passing value to a function*/
  once(fn: ValueReceiver<T>): void
  /** same as 'flow.value === v'*/

  is(v: T): boolean
  /** add function of receiving all changes value with current value if it not null or undefined*/
  upSome(fn: ValueReceiver<T>): void
  /** add function of receiving all changes value with current value if it is true after casting value to boolean type*/
  upTrue(fn: ValueReceiver<T>): void
  /** add function of receiving all changes value with current value if it is null or undefined*/
  upNone(fn: ValueReceiver<T>): void
  /** set string value to identify the flow*/

  setId(id: string): void
  /** add meta value to extend properties the flow*/
  addMeta(metaName: string, value?: any)

  /** does the stream have a meta name*/
  hasMeta(metaName: string): boolean
  /** get meta value by name*/
  getMeta(metaName: string): any
  /** set value with args OR get value from warp function if exist*/
  (value?: T, ...v: any[]): T | Promise<T>
  /** set warp function for data-mine*/
  useWarp(fn: () => T | Promise<T>): void
  /** check 'from' or 'warp' function are async*/
  isAsync:Boolean
  /** pattern matching see examples https://github.com/gleba/alak/blob/master/tests/3_pattern_maching.ts*/
  match(...pattern: any[]): any
  /** function that takes values and returns a new value for flow*/
  mutate(mutator: (v: T) => T): void
  /** mutate computed value from multi flow https://github.com/gleba/alak/blob/master/tests/2_mutate_from.ts*/
  from<A extends AFlow<any>[]>(...a: A): AFlowFrom<T, A>
}

type AboutStateEvents = {
  (eventName: string, fn: AnyFunction)
  [eventName: string]: (fn: AnyFunction) => void
  /** send true if value are computing in async warp function*/
  await: (fn: AnyFunction) => void
  /** send when first fill data value*/
  ready: (fn: AnyFunction) => void
}
type ReturnTypefy<T extends any[]> = {
  [K in keyof T]: T[K] extends (...args: any) => infer R ? R : any
}
type FromHandler<T, A extends any[]> = {
  (...a: ReturnTypefy<A>): T | PromiseLike<T>
}

type FromFlowFn<T, A extends any[]> = {
  (fn: FromHandler<T, A>): T
}

export interface AFlowFrom<T, A extends any[]> {
  holistic: FromFlowFn<T, A>
  quantum: FromFlowFn<T, A>
}

type AnyFunction = {
  (...v: any[]): any
}

export type ValueReceiver<T extends any> = (...a: T[]) => any

export type FlowStarter =
  | {
  <T>(v?: T): AFlow<T>
}
  | {
  (...v: any[]): AFlow<any>
}

export interface Facade {
  flow: FlowStarter

  [s: string]: FlowStarter
}

export declare const A: Facade
export declare const Al: FlowStarter
export declare const DFlow: FlowStarter
declare const _default: Facade
export default _default
