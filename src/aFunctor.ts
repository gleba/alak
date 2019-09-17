import { FlowState, notifyStateListeners } from './FlowState'

export function setFunctorValue(functor: AFunctor, ...a) {
  if (!functor.children) {
    console.error('Attempt to pass in the ended flow ', functor.id ? functor.id : '')
    console.warn("it's possible memory leak in application")
    return
  }

  let [value, context] = a
  if (value && value.then) {
    notifyStateListeners(functor, FlowState.AWAIT, true)
    return value.then(v => {
      a[0] = v
      functor.value = a
      notifyStateListeners(functor, FlowState.AWAIT, false)
      notifyStateListeners(functor, FlowState.READY)
      notifyTheChildren(functor)
    })
  } else {
    functor.value = a
    notifyTheChildren(functor)
  }
}
function useGetter(functor) {
  if (functor.getterFn.then){
    return setFunctorValue(functor, ...[functor.getterFn(), "getter"]) //new Promise(async done => done(await ))
  }
  const value = functor.getterFn()
  setFunctorValue(functor, value, "getter")
  return value
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

export const newAFunctor = () => {
  // let children = new Set<AnyFunction>()
  // let grandChildren = new Map<AnyFunction, AnyFunction>()
  const functor = function(...a) {
    if (a.length) {
      return setFunctorValue(functor, ...a)
    } else {
      if (functor.getterFn)
        return useGetter(functor)
      let v = functor.value
      return v && v.length ? v[0] : undefined
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
  getterFn: any
  wrapperFn: any
  meta: any
  // metaSet: Set<string>
  metaMap: Map<string, any>
  proxy: any
  value: any
  id: string
  haveFrom: boolean
  (...a: any[]): void
}
