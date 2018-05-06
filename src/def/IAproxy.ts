


// type RT<T> = T extends (...args: any[]) => any ? ReturnType<T> : any
//
// // type RA<T> = T & { (args?: any): Promise<any> } & { (...args: any[]): Promise<any> }
// type MixedArgs<T> = {[K in keyof T]: number}
// type MetaFlow<T> = T extends (...args: any[]) => any ? ReturnType<T> : any
// type RT<T> = T extends (...args: any[]) => any ? ReturnType<T> : any
//
// type MetaFlow<T> = T extends MixedArgs<T> ? any : IFlow<T>

import {AFlow} from "./AFlow";
import {flow} from "../Aflow";

type MayBeflow<T> = T extends AFlow <T> ? AFlow <T> : any
export type IflowStarter = {
  <T>(a?: T): AFlow<T>
  <K>(...a: K[]): AFlow<K>
  [s: string]:  IflowStarter
}

export type IAnyflowStarter = {
  (a: any): IAnyflowStarter
  [s: string]:  IAnyflowStarter

}
export interface IAproxy {
  flow: IflowStarter
  f: IflowStarter
  meta: IAnyflowStarter
  m: IAnyflowStarter
  stateless: IflowStarter
  emitter: IflowStarter
}
// let xx:AFlow<number>


// let A:IAproxy
// let f:AFlow<number>
//
// f.v
// let x = A.f(1)
//
// let x0 = A.f("xx").sd.ssd as AFlow
//
// let x1 = A.f("xx")
// let x2 = A.flow
// let x3 = A.flow("xx")
//
//
//
