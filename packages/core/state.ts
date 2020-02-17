import { Functor } from './functor'

export const FState = {
  AWAIT: 'await',
  EMPTY: 'empty',
}

export function notifyStateListeners(f: Functor, state:string, ...value) {
  if (f.stateListeners && f.stateListeners.has(state))
    f.stateListeners.get(state).forEach(f => f.apply(f, value))
}

export function addStateEventListener(f: Functor, state, fn) {
  if (!f.stateListeners) f.stateListeners = new Map()
  if (!f.stateListeners.has(state)) {
    let set = new Set()
    set.add(fn)
    f.stateListeners.set(state, set)
  } else f.stateListeners.get(state).add(fn)
}

export function removeStateEventListener(f: Functor, state:string, fn) {
  if (f.stateListeners && f.stateListeners.has(state)) {
    let ase = f.stateListeners.get(state)
    if (ase.has(fn)) ase.delete(fn)
  }
}

