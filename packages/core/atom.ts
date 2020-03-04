import { FState, notifyStateListeners } from './state'
import { Atom } from './index'
import { DECAY_ATOM_ERROR } from './utils'

type AnyFunction = {
  (...v: any[]): any
}

export const debug = {} as {
  enabled: boolean
  updateAsyncStart(atom: Atom, context?: string)
  updateAsyncFinish(atom: Atom)
  updateValue(atom: Atom, context: string)
}

export function setAtomValue(atom: Atom, ...a) {
  let [value, context] = a
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

async function setAsyncValue(atom: Atom, promise: PromiseLike<any>) {
  notifyStateListeners(atom, FState.AWAIT, true)
  atom._isAwaiting = promise
  atom._isAsync = true
  let v = await promise
  atom.value = [v]
  atom._isAwaiting = false
  notifyStateListeners(atom, FState.AWAIT, false)
  debug.enabled && debug.updateAsyncFinish(atom)
  notifyChildes(atom)
  return v
}

export function notifyChildes(atom: Atom) {
  const v = atom.value[0]
  atom.children.size > 0 && atom.children.forEach(f => f.call(atom.proxy, v))
  atom.grandChildren &&
    atom.grandChildren.size > 0 &&
    atom.grandChildren.forEach((f, k) => {
      f(v)
    })
}

export function grandUpFn(atom: Atom, keyFun: AnyFunction, grandFun: AnyFunction): any {
  if (!atom.grandChildren) atom.grandChildren = new Map()
  const grandUpFun = grandFun(keyFun.bind(atom.proxy))
  atom.grandChildren.set(keyFun, grandUpFun)
  const [v] = atom.value
  v && grandUpFun(v)
}

export const createAtom = (...a) => {
  const atom = function() {
    if (!atom.children) {
      throw DECAY_ATOM_ERROR
    }
    if (arguments.length) {
      return setAtomValue(atom, ...arguments)
    } else {
      if (atom._isAwaiting) {
        return atom._isAwaiting
      }
      if (atom.getterFn) {
        return setAtomValue(atom, atom.getterFn(), 'getter')
      }
      let v = atom.value
      return v && v.length ? v[0] : undefined
    }
  } as Atom
  atom.children = new Set<AnyFunction>()
  // atom.grandChildren = new Map<AnyFunction, AnyFunction>()
  // atom.stateListeners = new Map<string, Set<AnyFunction>>()
  atom.value = []
  if (a.length) {
    atom(...a)
  }
  return atom as any
}
