

export const FState = {
  AWAIT: 'await',
  EMPTY: 'empty',
}

export function notifyStateListeners(atom, state:string, ...value) {
  if (atom.stateListeners && atom.stateListeners.has(state))
    atom.stateListeners.get(state).forEach(f => f.apply(f, value))
}

export function addStateEventListener(atom, state, fun) {
  if (!atom.stateListeners) atom.stateListeners = new Map()
  if (!atom.stateListeners.has(state)) {
    let set = new Set()
    set.add(fun)
    atom.stateListeners.set(state, fun)
  } else atom.stateListeners.get(state).add(fun)
}

export function removeStateEventListener(atom, state:string, fun) {
  if (atom.stateListeners && atom.stateListeners.has(state)) {
    let ase = atom.stateListeners.get(state)
    if (ase.has(fun)) ase.delete(fun)
  }
}

