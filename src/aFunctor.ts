import {ASE, notifyAboutStateListeners} from "./ASE";


export function setFunctorValue(functor: AFunctor, ...a) {
  if (!functor.children) {
    console.error('Attempt to pass in the ended flow ', functor.id ? functor.id : '')
    console.warn("it's possible memory leak in application")
    return
  }
  if (a.length > 0) {
    functor.value = a
  }
  notifyTheChildren(functor)
}
export function notifyTheChildren(functor: AFunctor) {
  if (functor.children.size > 0) {
    functor.children.forEach(f => {
      f.apply(f, functor.value)
    })
  }
  if (functor.grandChildren.size > 0) {
    functor.grandChildren.forEach(f => {
      f.apply(f, functor.value)
    })
  }
}

function executeBorn(functor:AFunctor, bornFn) {
  let value = bornFn()
  if (value.then) {
    notifyAboutStateListeners(functor, ASE.AWAIT, true)
    value.then(v=>{
      setFunctorValue(functor, v)
      notifyAboutStateListeners(functor, ASE.AWAIT, false)
      notifyAboutStateListeners(functor, ASE.READY)
    })
  } else{
    setFunctorValue(functor, value)
  }
  return value
}

export const newAFunctor = () => {
  // let children = new Set<AnyFunction>()
  // let grandChildren = new Map<AnyFunction, AnyFunction>()
  const functor = function(...a) {
    if (a.length)
      if (typeof a[0] === 'function') functor.warpFn = a[0]
      else setFunctorValue(functor, ...a)
    else {
      if (functor.warpFn) return executeBorn(functor, functor.warpFn) //new Promise(async done => done(await ))
      return functor.value
    }
  } as AFunctor
  functor.children = new Set<AnyFunction>()
  functor.grandChildren = new Map<AnyFunction, AnyFunction>()
  functor.asEventsListeners = new Map<string, Set<AnyFunction>>()
  functor.value = []

  return functor as AFunctor
}

export type AnyFunction = {
  (...v: any[]): any
}

export interface AFunctor {
  children: Set<AnyFunction>
  grandChildren: Map<AnyFunction, AnyFunction>
  asEventsListeners: Map<string, Set<AnyFunction>>
  warpFn: any
  meta: any
  // metaSet: Set<string>
  metaMap: Map<string, any>
  proxy: any
  value: any
  id: string
  haveFrom: boolean
  (...a: any[]): void
}
