import { AFunctor, AnyFunction } from './aFunctor'

export enum ASE {
  EMPTY = 'empty',
  AWAIT = 'await',
  READY = 'ready',
}

export function notifyAboutStateListeners(f: AFunctor, aboutState: ASE | string, ...value) {
  if (f.asEventsListeners.has(aboutState))
    f.asEventsListeners.get(aboutState).forEach(f => f.apply(f, value))
}

export function addASEventListener(f: AFunctor, aboutState: ASE | string, fn: AnyFunction) {
  if (!f.asEventsListeners.has(aboutState)) {
    let set = new Set<AnyFunction>()
    set.add(fn)
    f.asEventsListeners.set(aboutState, set)
  } else f.asEventsListeners.get(aboutState).add(fn)
}
export function removeASEventListener(f: AFunctor, aboutState: ASE | string, fn: AnyFunction) {
  if (f.asEventsListeners.has(aboutState)) {
    let ase = f.asEventsListeners.get(aboutState)
    if (ase.has(fn)) ase.delete(fn)
  }
}

export function proxyASEOnMap(functor) {
  function f(aseName, fn) {
    addASEventListener(functor, aseName, fn)
  }
  f.await = fn => addASEventListener(functor, 'await', fn)
  f.ready = fn => addASEventListener(functor, 'ready', fn)
  return f
}

export function proxyASEOffMap(functor) {
  function f(aseName, fn) {
    addASEventListener(functor, aseName, fn)
  }
  f.await = fn => removeASEventListener(functor, 'await', fn)
  f.ready = fn => removeASEventListener(functor, 'ready', fn)
  return f
}
