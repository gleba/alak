import { Functor } from './functor'


export const FState = {
  AWAIT: 'await',
  EMPTY: 'empty',
}

export function notifyStateListeners(f: Functor, state: FlowState | string, ...value) {
  if (f.stateListeners && f.stateListeners.has(state))
    f.stateListeners.get(state).forEach(f => f.apply(f, value))
}

export function addStateEventListener(
  f: Functor,
  state: FlowState,
  fn: AnyFunction,
) {
  if (!f.stateListeners) f.stateListeners = new Map()
  if (!f.stateListeners.has(state)) {
    let set = new Set<AnyFunction>()
    set.add(fn)
    f.stateListeners.set(state, set)
  } else f.stateListeners.get(state).add(fn)
}

export function removeStateEventListener(
  f: Functor,
  state: FlowState,
  fn: AnyFunction,
) {
  if (f.stateListeners && f.stateListeners.has(state)) {
    let ase = f.stateListeners.get(state)
    if (ase.has(fn)) ase.delete(fn)
  }
}

export function proxyStateOnMap(functor) {
  function f(stateEvent, fn) {
    addStateEventListener(functor, stateEvent, fn)
  }
  return f
}

export function proxyStateOffMap(functor) {
  function f(stateEvent, fn) {
    removeStateEventListener(functor, stateEvent, fn)
  }

  f.await = fn => removeStateEventListener(functor, FState.AWAIT, fn)
  return f
}
