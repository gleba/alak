export type Listener<T extends any> = (...a: T[]) => any


export declare const A: IAproxy;
export declare const Al: IflowStarter;
export declare const DFlow: IflowStarter;
declare const _default: IAproxy;
export default _default;

export interface AFlow<T> {
  /**
   * Witch arguments:
   * set flow value and notify child listiners
   * Without arguments :
   * return current flow value
   */
  (...a: T[]): T;

  /**
   * Get Value
   * get current flow value
   */
  v: T;
  /**
   * Immutable
   * get value clone
   */
  imv: T;
  cloneValue: T;
  immutable: any;
  /**
   * Get id
   * only if `setId` has been inited
   */
  id: any;
  /**
   * Meta object data
   */
  o: any;
  metaData: any;
  /**
   * Get value flow as array arguments
   */
  data: T[];
  /**
   * Make created flow always immutable
   */

  /**
   * ...maybe depricated
   * Set flow meta name
   * just call if need enable it
   * @param ...meta string
   * @returns {AFlow<T>}
   */
  meta(...meta: string[]): AFlow<T>;

  /**
   * Check flow meta name
   * @metaName string name of meta
   * @returns Boolean
   */
  isMeta(metaName: string): Boolean;

  /**
   * Check object is flow
   * @returns {Boolean}
   */
  isFlow(key?: any): Boolean;

  /**
   * Check Value
   * same as flow.v === value
   * @param value
   * @returns {Boolean}
   */
  isValue(value?: any): Boolean;

  /**
   * Remove key or index in object or array
   * @param value
   * @returns {Boolean}
   */
  remove(ki?: any);

  set(ki: string|number, item:any);
  push(item:any);

  map(f:(item:any,ki)=>any);
  each(f:(item:any,ki)=>void);

  effect(fn: Listener<T>, mutable?:boolean): any;
  clearEffect(): void;

  wrap(fn: Listener<T>): any;

  unwrap(): any;

  iMix( ...f): any;
  integralMix(fn: Listener<any>): any;
  mix(fn: Listener<any>): any;
  /**
   * Add edge
   * subscribe listener
   * call function on every flow data update
   * `f.on(v=>...)`
   * @param {Listener<T>} fn
   * @returns {AFlow<T>}
   */
  link(fn: Listener<T>): AFlow<T>;
  to(fn: Listener<T>): AFlow<T>;
  on(fn: Listener<T>): AFlow<T>;

  /**
   * Add edge only once
   * subscribe listener
   * call function on every flow data update
   * `f.on(v=>...)`
   * @param {Listener<T>} fn
   * @returns {AFlow<T>}
   */
  once(fn: Listener<T>): AFlow<T>;

  /**
   * Subscribe listener
   * call function on every next flow update
   * `f.on(v=>...)`
   * @param {Listener<T>} fn
   * @returns {AFlow<T>}
   */
  next(fn: Listener<T>): AFlow<T>;

  /**
   * Add Immutable edge
   * subscribe listener
   * call function on every flow update
   * with clone value
   * @param {Listener<T>} fn
   * @returns {AFlow<T>}
   */
  im(fn: Listener<T>): AFlow<T>;

  /**
   * Remove edge
   * unsubscribe listener
   * same as `stop`
   * @param {Listener<T>} fn
   * @returns {AFlow<T>}
   */
  off(fn: Listener<T>): AFlow<T>;

  /**
   * Remove edge
   * unsubscribe listener
   * same as `off`
   * @param fn
   */
  stop(fn: any): void;

  /**
   * Make flow as eventbus
   * do not save values and data in flow
   * set true if need enable it
   * @param {boolean} v
   * @returns {AFlow<T>}
   */
  stateless(v?: boolean): AFlow<T>;

  /**
   * Make flow as dispatcher
   * notify all edges/listeners when call flow() without arguments
   * set true if need enable it
   * @param {boolean} v
   * @returns {AFlow<T>}
   */
  emitter(v?: boolean): AFlow<T>;

  /**
   * Destroy flow
   * remove all data
   * kill object
   */
  end(): void;

  /**
   * Notify all edges/listeners with empty data value
   */
  emit(): void;

  /**
   * Updtate data without notify edges/listeners
   * @param {T} a
   * @returns {T}
   */
  silent(...a: T[]): T;

  /**
   * Patterm maching
   * @example
   * ```
   * flow.match(
   *    1, ()=>oneFunction(),
   *    2, v => v===2 ,
   *    v=>elseFuntion()
   * )
   * ```
   * @param pattern
   * @returns {any}
   */
  match(...pattern: any[]): any;

  /**
   * Mutate data value
   * and notify edges/listeners
   * @example
   * ```
   * flow.mutate(v=>v+1)
   * ```
   * @param {Listener<T>} fn
   * @returns {T}
   */
  mutate(fn: Listener<T>): T;

  /**
   * Create new flow edged on current
   * @param {(...a: any[]) => U[]} fn
   * @returns {AFlow<any>}
   */
  branch<U>(fn: (...a: any[]) => U[]): AFlow<any>;

  /**
   * Remove all injections
   */
  drop(): void;

  /**
   * Bind key in object to flow data value
   * @param obj
   * @param {string} key
   */
  inject(obj: any, key?: string): void;

  /**
   * Unbind injected object
   * @param obj
   */
  reject(obj: any): void;

  /**
   * set id param to flow
   * @param {string} name
   */
  setId(name: string): void;

  /**
   * set any meta data as object in flow
   * @param obj
   */
  setMetaObj(obj: any): void;

  extend(key: string, obj: any): void;
}



type MayBeflow<T> = T extends AFlow <T> ? AFlow <T> : any

export type IflowStarter = {
  <T>(a?: T): AFlow<T>
  <K>(...a: K[]): AFlow<K>
  (...a: any[]): AFlow<any>
  [s: string]:  IflowStarter
}

export type IAnyflowStarter = {
  (a: any): IAnyflowStarter
  [s: string]:  IAnyflowStarter

}
export interface IAproxy {
  flow: IflowStarter
  f: IflowStarter
  meta: IflowStarter
  m: IflowStarter
  stateless: IflowStarter
  emitter: IflowStarter
  install: IflowStarter
  [s: string]:  IflowStarter
}
