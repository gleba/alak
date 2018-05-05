import {Listener} from "./index";


// interface Meta<T> {
//   [s: string]: IAflow<any>
// }

// export type MetaFlow<T> = T extends {[s: string]: IAflow<any>} ? string : any
// export type MetaFlow<T> = T extends {[s: string]: IAflow<any>} ? string : any
// type RT<T> = T extends Meta  ?  :
// export interface IAflow<T extends Iflow<T>> {
// }
type LinkedList<T> = T & { next: LinkedList<T> };
export type MixedArgs<T> = {[K in keyof T]: MetaFlow<T[K]>}
export type IF = {
  [s: string]: IFlow<any>
}
export type MetaFlow<T> = T extends IF ? any : any
export interface IFlow<T> {
  (...a: T[]): T
  meta(...meta): IFlow<T>
  isMeta(metaName): Boolean
  isFlow(key?): Boolean
  isValue(value?): Boolean

  v: T
  data: T[]

  on(fn: Listener<T>): IFlow<T>

  weakOn(fn: Listener<T>): IFlow<T>

  off(fn: Listener<T>): IFlow<T>

  stateless(v?: boolean): IFlow<T>

  immutable: T

  emitter(v?: boolean): IFlow<T>

  end(): void

  emit(): void

  match(...pattern)

  mutate(fn: Listener<T>): T

  branch<U>(fn: (...a: any[]) => U[]): IFlow<any>

  stop(fn): void

  drop(): void

  inject(obj: any, key?: string): void

  reject(obj): void


}
