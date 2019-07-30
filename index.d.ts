export type Listener<T extends any> = (...a: T[]) => any;

export declare const A: IAproxy;
export declare const Al: IflowStarter;
export declare const DFlow: IflowStarter;
declare const _default: IAproxy;
export default _default;

export interface AFlow<T> {
  v: T;
  value: T;
  imv: T;
  cloneValue: T;
  immutable: any;
  id: any;
  o: any;
  metaData: any;
  data: T[];
  isAsync: boolean;

  (...a: T[]): T;

  is(value?: any): Boolean;
  safe(value?: T): void;

  /**
   * set flow value and notify child listeners if value not null and undefined
   * @param value
   * @returns {Boolean}
   */
  nullSafe(value: T | null): void;

  /**
   * set flow value and notify child listeners if value not equal current flow value
   * @param value
   * @returns {Boolean}
   */
  loopSafe(value: T): void;

  /**
   * Remove key or index in object or array
   * @param value
   * @returns {Boolean}
   */
  remove(ki?: any);

  set(ki: string | number, item: any);

  push(item: any);

  map(f: (item: any, ki) => any);

  // effect(fn: Listener<T>, mutable?:boolean): any;
  // clearEffect(): void;

  each(f: (item: any, ki) => void);

  wrap(fn: Listener<T>): any;

  // iMix( ...f): any;
  // integralMix(fn: Listener<any>): any;

  unwrap(): any;

  // mix(fn: Listener<any>): any;
  /**
   * Add edge
   * subscribe listener
   * call function on every flow data update
   * `f.on(v=>...)`
   * @param {Listener<T>} fn
   * @returns {AFlow<T>}
   */
  // link(fn: Listener<T>): AFlow<T>;
  // to(fn: Listener<T>): AFlow<T>;
  on(fn: Listener<T>): AFlow<T>;

  up(fn: Listener<T>): AFlow<T>;

  $(fn: Listener<T>): AFlow<T>;

  upTrue(fn: Listener<T>): AFlow<T>;
  upNone(fn: Listener<T>): AFlow<T>;
  upSome(fn: Listener<T>): AFlow<T>;

  useFx(fxName: string, f: (fn: Promise<T>) => T): void;

  addFx(fxName: string, fn: Listener<any>): void;

  removeFx(fxName: string, fn: Listener<any>): void;



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
  down(fn: Listener<T>): AFlow<T>;
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
  kill(): void;

  end(): void;

  /**
   * Notify all edges/listeners with empty data value
   */
  emit(): void;

  /**
   * Delete data value without notify edges/listeners
   * - data value will be undefined
   */
  clear(): void;

  /**
   * Update data value without notify edges/listeners
   * @param {T} a
   * @returns {void}
   */
  silent(...a: T[]): void;

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

export type IflowStarter =
  | {
  <T>(a?: T): AFlow<T>;
}
  | {
  (...a: any[]): AFlow<any>;
};

export type IAnyflowStarter = {
  (a: any): IAnyflowStarter;
  [s: string]: IAnyflowStarter;
};

export interface IAproxy {
  flow: IflowStarter;
  f: IflowStarter;
  meta: IflowStarter;
  m: IflowStarter;
  stateless: IflowStarter;
  emitter: IflowStarter;
  install: IflowStarter;

  [s: string]: IflowStarter;
}
