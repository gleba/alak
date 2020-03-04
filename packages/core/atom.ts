import { FState, notifyStateListeners } from './state'
import { CoreAtom } from './index'
import { AtomContext, DECAY_ATOM_ERROR } from './utils'

type AnyFunction = {
  (...v: any[]): any
}

export const debug = {} as {
  enabled: boolean
  updateAsyncStart(atom: CoreAtom, context?: string)
  updateAsyncFinish(atom: CoreAtom)
  updateValue(atom: CoreAtom, context: string)
}

export function setAtomValue(atom: CoreAtom, value, context?) {
  const setValue = finalValue => {
    if (atom.wrapperFn) {
      let wrappedValue = atom.wrapperFn(finalValue, atom.value[0])
      if (wrappedValue.then) {
        debug.enabled && debug.updateAsyncStart(atom, context)
        return setAsyncValue(atom, wrappedValue)
      }
      finalValue = wrappedValue
    }
    atom.value = [finalValue]
    debug.enabled && debug.updateValue(atom, context)
    notifyChildes(atom)
    return finalValue
  }
  if (value && value.then) {
    return setAsyncValue(atom, value)
  }
  return setValue(value)
}

async function setAsyncValue(atom: CoreAtom, promise: PromiseLike<any>) {
  notifyStateListeners(atom, FState.AWAIT, true)
  atom.isAwaiting = promise
  atom.isAsync = true
  let v = await promise
  atom.value = [v]
  atom.isAwaiting = false
  notifyStateListeners(atom, FState.AWAIT, false)
  debug.enabled && debug.updateAsyncFinish(atom)
  notifyChildes(atom)
  return v
}

export function notifyChildes(atom: CoreAtom) {
  const v = atom.value[0]
  atom.children.size > 0 && atom.children.forEach(f => f.call(atom.proxy, v))
  atom.grandChildren &&
    atom.grandChildren.size > 0 &&
    atom.grandChildren.forEach((f, k) => {
      f(v)
    })
}

export function grandUpFn(atom: CoreAtom, keyFun: AnyFunction, grandFun: AnyFunction): any {
  if (!atom.grandChildren) atom.grandChildren = new Map()
  const grandUpFun = grandFun(keyFun.bind(atom.proxy))
  atom.grandChildren.set(keyFun, grandUpFun)
  const [v] = atom.value
  v && grandUpFun(v)
}

export const createAtom = (...a) => {
  const atom = function(value, context) {
    if (!atom.children) {
      throw DECAY_ATOM_ERROR
    }
    if (arguments.length) {
      if (debug.enabled) return setAtomValue(atom, value, context ? context : AtomContext.direct)
      else return setAtomValue(atom, value)
    } else {
      if (atom.isAwaiting) {
        return atom.isAwaiting
      }
      if (atom.getterFn) {
        return setAtomValue(atom, atom.getterFn(), AtomContext.getter)
      }
      let v = atom.value
      return v && v.length ? v[0] : undefined
    }
  } as CoreAtom
  atom.children = new Set<AnyFunction>()
  // atom.grandChildren = new Map<AnyFunction, AnyFunction>()
  // atom.stateListeners = new Map<string, Set<AnyFunction>>()
  atom.value = []
  if (a.length) {
    atom(...a)
  }
  return atom as any
}
