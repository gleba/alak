import {IAflow} from "./IAflow";

type RT<T> = T extends (...args: any[]) => any ? ReturnType<T> : any
// type RA<T> = T & { (args?: any): Promise<any> } & { (...args: any[]): Promise<any> }
type MixedArgs<T> = {[K in keyof T]: RT<T[K]>}

type flowStarter = {
  <T>(a?: T): IAflow<T>
  [s: string]: flowStarter
}


export interface IAproxy {
  flow: flowStarter
  f: IAflow<any>
  fn: any
}