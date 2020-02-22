import { grandUpFn, notifyChildes, setAtomValue } from './atom'
import { addStateEventListener, FState, notifyStateListeners, removeStateEventListener } from './state'
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
    return this.id
  },
  isAsync() {
    return !!(this.isAsync || this.getterFn || this.wrapperFn || this.strongFn)
  },
  inAwaiting() {
    return this.inAwaiting
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
    this.children.clear()
    deleteParams(this)
    return this.proxy
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
  notify() {
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
  upSome(f) {
    let v = grandUpFn(this, f, nullFilter(f))
    if (alive(v)) f.apply(this.proxy, [v])
    return this.proxy
  },
  upTrue(f) {
    let v = grandUpFn(this, f, trueFilter(f))
    if (v) f.apply(this.proxy, [v])
    return this.proxy
  },
  upNone(f) {
    let v = grandUpFn(this, f, someFilter(f))
    if (this.value.length && !alive(v)) f.apply(f, [v])
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
  useGetter(getterFunction) {
    this.getterFn = getterFunction
    return this.proxy
  },
  useWrapper(wrapperFunction) {
    this.wrapperFn = wrapperFunction
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
