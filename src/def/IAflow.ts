import {Listener} from "./index";


export interface IAflow<T extends any> {
  (...a: T[]): T

  meta(...meta): IAflow<T>

  isMeta(metaName): Boolean
  isFlow(key?): Boolean
  isValue(value?): Boolean

  v: T
  data: T[]

  on(fn: Listener<T>): IAflow<T>

  weakOn(fn: Listener<T>): IAflow<T>

  off(fn: Listener<T>): IAflow<T>

  stateless(v?: boolean): IAflow<T>

  immutable: T

  emitter(v?: boolean): IAflow<T>

  end(): void

  emit(): void

  match(...pattern)

  mutate(fn: Listener<T>): T

  branch<U>(fn: (...a: any[]) => U[]): IAflow<U>

  stop(fn): void

  drop(): void

  inject(obj: any, key?: string): void

  reject(obj): void

  [s: string]: IAflow<T>

}
