import { Atom } from './atom'

export const FState = {
  AWAIT: 'await',
  EMPTY: 'empty',
}

export function notifyStateListeners(f: Atom, state:string, ...value) {
  if (f.stateListeners && f.stateListeners.has(state))
    f.stateListeners.get(state).forEach(f => f.apply(f, value))
}

export function addStateEventListener(f: Atom, state, fun) {
  if (!f.stateListeners) f.stateListeners = new Map()
  if (!f.stateListeners.has(state)) {
    let set = new Set()
    set.add(fun)
    f.stateListeners.set(state, fun)
  } else f.stateListeners.get(state).add(fun)
}

export function removeStateEventListener(f: Atom, state:string, fun) {
  if (f.stateListeners && f.stateListeners.has(state)) {
    let ase = f.stateListeners.get(state)
    if (ase.has(fun)) ase.delete(fun)
  }
}

