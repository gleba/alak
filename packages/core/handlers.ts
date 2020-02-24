import { grandUpFn, notifyChildes, setAtomValue } from './atom'
import {
  addStateEventListener,
  FState,
  notifyStateListeners,
  removeStateEventListener,
} from './state'
import { alive, deleteParams, nullFilter, someFilter, trueFilter } from './utils'
import { FlowHandlers } from './index'

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
    if (this.id) return this.id
    else return this.uid
  },
  isAsync() {
    return this._isAsync
  },
  isAwaiting() {
    return !!this._isAwaiting
  },
}

export const objectHandlers: FlowHandlers = {
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
    this.value = []
    this.children.clear()
    this.grandChildren && this.grandChildren.clear()
    this.stateListeners && this.stateListeners.clear()
    this.haveFrom && delete this.haveFrom
    return this.proxy
  },
  close() {
    this.proxy.clear()
    deleteParams(this)
  },
}

export const allHandlers: FlowHandlers = {
  clearValue() {
    notifyStateListeners(this, 'empty')
    this.value = []
    return this.proxy
  },
  onAwait(fun) {
    addStateEventListener(this, FState.AWAIT, fun)
  },
  offAwait(fun) {
    removeStateEventListener(this, FState.AWAIT, fun)
  },
  resend() {
    notifyChildes(this)
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
    return this.proxy
  },
  is(value) {
    if (this.value && this.value.length) {
      return this.value[0] === value
    } else {
      return value === undefined
    }
  },
  upSome(fun) {
    grandUpFn(this, fun, someFilter)
    return this.proxy
  },
  upTrue(fun) {
    grandUpFn(this, fun, trueFilter)
    return this.proxy
  },
  upNone(fun) {
    grandUpFn(this, fun, nullFilter)
    return this.proxy
  },
  setId(id) {
    this.id = id
    return this.proxy
  },
  setName(name) {
    this.flowName = name
    return this.proxy
  },
  apply(context, v) {
    this.bind(context)
    setAtomValue(this, v[0])
  },
  addMeta(metaName, value?) {
    if (!this.metaMap) this.metaMap = new Map<string, any>()
    this.metaMap.set(metaName, value ? value : null)
    return this.proxy
  },
  hasMeta(metaName) {
    if (!this.metaMap) return false
    return this.metaMap.has(metaName)
  },
  getMeta(metaName) {
    if (!this.metaMap) return null
    return this.metaMap.get(metaName)
  },
  on(stateEvent, fn) {
    addStateEventListener(this, stateEvent, fn)
    return this.proxy
  },
  off(stateEvent, fn) {
    removeStateEventListener(this, stateEvent, fn)
    return this.proxy
  },
  useGetter(getterFunction, isAsync) {
    this.getterFn = getterFunction
    this._isAsync = isAsync
    return this.proxy
  },
  useWrapper(wrapperFunction, isAsync) {
    this.wrapperFn = wrapperFunction
    this._isAsync = isAsync
    return this.proxy
  },
  fmap(fun) {
    setAtomValue(this, fun(...this.value))
    return this.proxy
  },
  injectOnce(o, key) {
    if (!key) {
      key = this.flowName ? this.flowName : this.id ? this.id : this.uid
    }
    if (!o) throw 'trying inject flow key : ' + key + ' to null object'
    o[key] = this.value[0]
    return this.proxy
  },
  cloneValue() {
    return this.value.length ? JSON.parse(JSON.stringify(this.value[0])) : undefined
  },
}
