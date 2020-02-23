import { FState, notifyStateListeners } from './state'
import { Atom } from './index'

type AnyFunction = {
  (...v: any[]): any
}

export function setAtomValue(atom: Atom, ...a) {
  if (!atom.children) {
    console.error('Attempt to pass in the ended newFlow ', atom.id ? atom.id : '')
    console.warn("it's possible memory leak in application")
    return atom.proxy
  }
  let [value, context] = a
  // if (dev.debug) dev.updatingStarted(atom, context)
  const setValue = finalValue => {
    if (atom.wrapperFn) {
      let wrappedValue = atom.wrapperFn(finalValue, atom.value[0])
      if (wrappedValue.then) return setAsyncValue(atom, wrappedValue)
      atom.value = [wrappedValue]
    } else {
      atom.value = [finalValue]
    }
    notifyChildes(atom)
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
  // if (dev.debug) dev.updatingFinished(atom.uid, v)
  notifyChildes(atom)
  return v
}

const notify = (atom: Atom, whose) =>
  whose && whose.size > 0 && whose.forEach(f => f.apply(atom.proxy, atom.value))

export function notifyChildes(atom: Atom) {
  // console.log('→', atom.flowName, atom.value)
  notify(atom, atom.children)
  notify(atom, atom.grandChildren)
}

export function grandUpFn(atom: Atom, f: AnyFunction, ff: AnyFunction): any {
  if (!atom.grandChildren) atom.grandChildren = new Map()
  atom.grandChildren.set(f, ff)
  return atom.value[0]
}

export const createAtom = (...a) => {
  const atom = function() {
    if (arguments.length) {
      if (typeof arguments[0] == 'function') {
        atom.getterFn = arguments[0]
      } else {
        return setAtomValue(atom, ...arguments)
      }
    } else {
      if (atom._isAwaiting) {
        return atom._isAwaiting
      }
      if (atom.strongFn) {
        let strongFn = atom.strongFn()
        if (strongFn.then) {
          strongFn.then(() => (atom._isAwaiting = false))
          atom._isAwaiting = strongFn
        }
        return strongFn
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
