import {FlowState, notifyStateListeners} from './FlowState'
import {dev} from "./dev";

export function setFunctorValue(functor: AFunctor, ...a) {
  if (!functor.children) {
    console.error('Attempt to pass in the ended flow ', functor.id ? functor.id : '')
    console.warn("it's possible memory leak in application")
    return
  }

  if (dev.itis) dev.updatingStarted(functor, a)
  let [value, context] = a

  const setValue = finalValue => {
    if (functor.wrapperFn) {
      let wrappedValue = functor.wrapperFn(finalValue)
      if (wrappedValue.then)
        return setAsyncValue(functor, wrappedValue)
      functor.value = [wrappedValue]
    } else {
      functor.value = [finalValue]
    }
    if (dev.itis) dev.updatingFinished(functor.uid, finalValue)
    notifyChildrens(functor)
  }
  if (value && value.then) {
    return setAsyncValue(functor, value)
  } else {
    return setValue(value)
  }
}
function setAsyncValue(functor:AFunctor, value) {
  notifyStateListeners(functor, FlowState.AWAIT, true)
  return value.then(v => {
    functor.value = [v]
    notifyStateListeners(functor, FlowState.AWAIT, false)
    notifyStateListeners(functor, FlowState.READY)
    if (dev.itis) dev.updatingFinished(functor.uid, v)
    notifyChildrens(functor)
  })
}
function useGetter(functor) {
  if (functor.getterFn.then) {
    return setFunctorValue(functor, ...[functor.getterFn(), 'getter']) //new Promise(async done => done(await ))
  }
  const value = functor.getterFn()
  setFunctorValue(functor, value, 'getter')
  return value
}
export function notifyChildrens(functor: AFunctor) {
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
      if (functor.getterFn) return useGetter(functor)
      let v = functor.value
      return v && v.length ? v[0] : undefined
    }
  } as AFunctor
  functor.children = new Set<AnyFunction>()
  functor.grandChildren = new Map<AnyFunction, AnyFunction>()
  functor.asEventsListeners = new Map<string, Set<AnyFunction>>()
  functor.value = []
  functor.uid = Math.random()
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
  uid: number
  id: string
  haveFrom: boolean
  (...a: any[]): void
}
