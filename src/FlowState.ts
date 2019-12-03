import { AFunctor, AnyFunction } from './aFunctor'

const list = ['empty', 'await', 'ready'] as const // TS3.4 syntax
export type FlowState = typeof list[number]

export function notifyStateListeners(f: AFunctor, aboutState: FlowState | string, ...value) {
  if (f.asEventsListeners.has(aboutState))
    f.asEventsListeners.get(aboutState).forEach(f => f.apply(f, value))
}

export function addStateEventListener(
  f: AFunctor,
  aboutState: FlowState | string,
  fn: AnyFunction,
) {
  if (!f.asEventsListeners.has(aboutState)) {
    let set = new Set<AnyFunction>()
    set.add(fn)
    f.asEventsListeners.set(aboutState, set)
  } else f.asEventsListeners.get(aboutState).add(fn)
}

export function removeASEventListener(
  f: AFunctor,
  aboutState: FlowState | string,
  fn: AnyFunction,
) {
  if (f.asEventsListeners.has(aboutState)) {
    let ase = f.asEventsListeners.get(aboutState)
    if (ase.has(fn)) ase.delete(fn)
  }
}

export function proxyStateOnMap(functor) {
  function f(aseName, fn) {
    addStateEventListener(functor, aseName, fn)
  }

  f.await = fn => addStateEventListener(functor, 'await', fn)
  f.ready = fn => addStateEventListener(functor, 'ready', fn)
  return f
}

export function proxyStateOffMap(functor) {
  function f(aseName, fn) {
    addStateEventListener(functor, aseName, fn)
  }

  f.await = fn => removeASEventListener(functor, 'await', fn)
  f.ready = fn => removeASEventListener(functor, 'ready', fn)
  return f
}
