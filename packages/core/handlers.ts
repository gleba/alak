import { Functor, grandUpFn, notifyChildrens, setFunctorValue } from './functor'
import {
  addStateEventListener,
  FState,
  notifyStateListeners,
  removeStateEventListener,
} from './state'
import { alive, deleteParams, nullFilter, someFilter, trueFilter } from './utils'
import { patternMatch } from '../match/match'
import { aFromFlows } from '../from/from'

type FlowHadler = {
  (this: Functor, ...a: any[]): any
}
type FlowHandlers = {
  [key: string]: FlowHadler
}
export const properties: FlowHandlers = {
  value() {
    return this.value.length ? this.value[0] : undefined
  },
  isEmpty() {
    return !this.value.length
  },
  name() {
    return this.flowName
  },
  uid() {
    return this.uid
  },
  id() {
    return this.id
  },
}

export const handlers: FlowHandlers = {
  up(f) {
    this.children.add(f)
    if (this.value && this.value.length) f.apply(this.proxy, this.value)
    return this.proxy
  },
  down(f) {
    if (this.children.has(f)) this.children.delete(f)
    else if (this.grandChildren && this.grandChildren.has(f)) this.grandChildren.delete(f)
    return this.proxy
  },
  clear() {
    this.children.clear()
    this.grandChildren && this.grandChildren.clear()
    this.stateListeners && this.stateListeners.clear()
    this.value = []

    this.haveFrom && delete this.haveFrom
    return this.proxy
  },
  clearValue() {
    notifyStateListeners(this, 'empty')
    this.value = []
    return this.proxy
  },
  close() {
    this.children.clear()
    deleteParams(this)
    return this.proxy
  },
  notify() {
    notifyChildrens(this)
    return this.proxy
  },
  next(f) {
    this.children.add(f)
    return this.proxy
  },
  once(f) {
    if (this.value && this.value.length) f.apply(this.proxy, this.value)
    else {
      const once = v => {
        f.apply(f, this.value)
        this.children.delete(once)
      }
      this.children.add(once)
    }
  },
  is(f) {
    return v => {
      if (this.value && this.value.length) {
        return this.value[0] === v
      } else {
        return v === undefined
      }
    }
  },
  upSome(f) {
    return f => {
      let v = grandUpFn(this, f, nullFilter(f))
      if (alive(v)) f.apply(this.proxy, [v])
    }
  },
  upTrue(f) {
    return f => {
      let v = grandUpFn(this, f, trueFilter(f))
      if (v) f.apply(this.proxy, [v])
    }
  },
  upNone(f) {
    return f => {
      let v = grandUpFn(this, f, someFilter(f))
      if (this.value.length && !alive(v)) f.apply(f, [v])
    }
  },
  setId(id) {
    this.id = id
  },
  setName(name) {
    this.flowName = name
  },
  apply(context, v) {
    this.bind(context)
    setFunctorValue(this, v[0])
  },
  addMeta(metaName, value?) {
    if (!this.metaMap) this.metaMap = new Map<string, any>()
    this.metaMap.set(metaName, value ? value : null)
  },
  hasMeta(metaName) {
    if (!this.metaMap) return false
    return this.metaMap.has(metaName)
  },
  getMeta(metaName){
    if (!this.metaMap) return null
    return this.metaMap.get(metaName)
  },
  onAwait(fn){
     addStateEventListener(this, FState.AWAIT, fn)
  }
}

function fz(functor: Functor, prop: string | number | symbol, receiver: any): any {
  switch (prop) {

    case 'onAwait':
      return fn => addStateEventListener(functor, FState.AWAIT, fn)
    case 'offAwait':
      return fn => removeStateEventListener(functor, FState.AWAIT, fn)
    case 'on':
      return (stateEvent, fn) => addStateEventListener(functor, stateEvent, fn)
    case 'off':
      return (stateEvent, fn) => removeStateEventListener(functor, stateEvent, fn)

    //strong
    case 'useWarp':
    case 'useGetter':
      return fn => (functor.getterFn = fn)
    case 'useWrapper':
      return fn => (functor.wrapperFn = fn)
    case 'isAsync':
      return !!(functor.isAsync || functor.getterFn || functor.wrapperFn || functor.strongFn)
    case 'inAwaiting':
      return functor.inAwaiting
    case 'match':
      return (...pattern) => {
        let f = patternMatch(pattern)
        functor.children.add(f)
        if (functor.value && functor.value.length) f.apply(f, functor.value)
      }
    case 'mutate':
      return mutatorFn => setFunctorValue(functor, mutatorFn(...functor.value))
    case 'from':
      return (...flows) => aFromFlows(functor, ...flows)
    case 'getImmutable':
      return () =>
        functor.value.length >= 1 ? JSON.parse(JSON.stringify(functor.value[0])) : undefined
    case 'injectOnce':
      return (o, key) => {
        if (!key) {
          key = functor.flowName ? functor.flowName : functor.id ? functor.id : functor.uid
        }
        if (!o) throw 'trying inject flow key : ' + key + ' to null object'
        o[key] = functor.value[0]
      }

    case 'up':
      return f => {
        functor.children.add(f)
        if (functor.value && functor.value.length) f.apply(functor.proxy, functor.value)
      }
  }
  return false
}
