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
// export type MixedArgs<T> = {[K in keyof T]: MetaFlow<T[K]>}
// export type IF = {
//   [s: string]: AFlow<any>
// }

export interface  AFlow<T> {
  (...a: T[]): T
  v: T
  imv: T
  id: any
  o: any
  data: T[]
  immutable: T
  meta(...meta): AFlow<T>
  isMeta(metaName): Boolean
  isFlow(key?): Boolean
  isValue(value?): Boolean
  on(fn: Listener<T>): AFlow<T>
  im(fn: Listener<T>): AFlow<T>
  off(fn: Listener<T>): AFlow<T>
  stateless(v?: boolean): AFlow<T>
  emitter(v?: boolean): AFlow<T>
  end(): void
  emit(): void
  silent(...a: T[]): T
  match(...pattern)
  mutate(fn: Listener<T>): T
  branch<U>(fn: (...a: any[]) => U[]): AFlow<any>
  stop(fn): void
  drop(): void
  inject(obj: any, key?: string): void
  reject(obj): void
  setId(name:string): void
  setMetaObj(obj): void
  extend(key:string, obj): void
};


//
// export type Partial<T> = {
//   [P in keyof T]?: AFlow<T>
// };
// interface Model extends AFlow<any> {
//   [others: string]: any & Model;
// }
// export type MetaFlow<T> = AFlow<T> extends Partial<T> ? any : AFlow<T>
//
// let asd:Model
// let x = asd.f.f.f.f

let x