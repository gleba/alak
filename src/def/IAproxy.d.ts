import {IFlow} from "./Iflow";


type RT<T> = T extends (...args: any[]) => any ? ReturnType<T> : any

// type RA<T> = T & { (args?: any): Promise<any> } & { (...args: any[]): Promise<any> }
type MixedArgs<T> = {[K in keyof T]: number}
// type MetaFlow<T> = T extends (...args: any[]) => any ? ReturnType<T> : any
// type RT<T> = T extends (...args: any[]) => any ? ReturnType<T> : any
//
// type MetaFlow<T> = T extends MixedArgs<T> ? any : IFlow<T>

export type flowStarter = {
  <T>(a?: T): IFlow<T>
  [s: string]: any
}
export interface IAproxy {
  flow: IFlow<any>
  f: flowStarter
}