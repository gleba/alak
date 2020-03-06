import { FState, notifyStateListeners } from './state'
import { Core } from './index'
import { AtomContext, DECAY_ATOM_ERROR } from './utils'

type AnyFunction = {
  (...v: any[]): any
}

export const debug = {} as {
  enabled: boolean
  updateAsyncStart(atom: Core, context?: string)
  updateAsyncFinish(atom: Core)
  updateValue(atom: Core, context: string)
}

export function setAtomValue(atom: Core, value, context?) {
  const setValue = finalValue => {
    if (atom.wrapperFn) {
      let wrappedValue = atom.wrapperFn(finalValue, atom.value)
      if (wrappedValue.then) {
        debug.enabled && debug.updateAsyncStart(atom, context)
        return setAsyncValue(atom, wrappedValue)
      }
      finalValue = wrappedValue
    }
    atom.value = finalValue
    debug.enabled && debug.updateValue(atom, context)
    notifyChildes(atom)
    return finalValue
  }
  if (value && value.then) {
    return setAsyncValue(atom, value)
  }
  return setValue(value)
}

async function setAsyncValue(atom: Core, promise: PromiseLike<any>) {
  notifyStateListeners(atom, FState.AWAIT, true)
  atom.isAwaiting = promise
  atom.isAsync = true
  let v = await promise
  atom.value = v
  atom.isAwaiting = false
  notifyStateListeners(atom, FState.AWAIT, false)
  debug.enabled && debug.updateAsyncFinish(atom)
  notifyChildes(atom)
  return v
}

export function notifyChildes(atom: Core) {
  const v = atom.value
  atom.children.size > 0 && atom.children.forEach(f => f.call(atom._, v))
  atom.grandChildren &&
    atom.grandChildren.size > 0 &&
    atom.grandChildren.forEach((f, k) => {
      f(v)
    })
}

export function grandUpFn(atom: Core, keyFun: AnyFunction, grandFun: AnyFunction): any {
  if (!atom.grandChildren) atom.grandChildren = new Map()
  const grandUpFun = grandFun(keyFun.bind(atom._))
  atom.grandChildren.set(keyFun, grandUpFun)
  !atom._.isEmpty && grandUpFun(atom.value)
}

export const createCore = (...a) => {
  const atom = function(value, context) {
    // console.log(core)
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
      return atom.value
    }
  } as Core
  atom.children = new Set<AnyFunction>()
  atom.uid = Math.random()
  if (a.length) {
    atom(...a)
  }
  return atom as any
}
