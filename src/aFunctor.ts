import { FlowState, notifyStateListeners } from './FlowState'
import { dev } from './devConst'
import { A } from './index'

export function setFunctorValue(functor: AFunctor, ...a) {
  if (!functor.children) {
    console.error('Attempt to pass in the ended newFlow ', functor.id ? functor.id : '')
    console.warn("it's possible memory leak in application")
    return functor.proxy
  }

  let [value, context] = a
  if (dev.debug) dev.updatingStarted(functor, context)
  const setValue = finalValue => {
    if (functor.wrapperFn) {
      let wrappedValue = functor.wrapperFn(finalValue, functor.value[0])
      if (wrappedValue.then) return setAsyncValue(functor, wrappedValue)
      functor.value = [wrappedValue]
    } else {
      functor.value = [finalValue]
    }
    if (dev.debug) dev.updatingFinished(functor.uid, finalValue)
    notifyChildrens(functor)
    return functor.value[0]
  }

  if (value && value.then) {
    return setAsyncValue(functor, value)
  } else {
    return setValue(value)
  }
}

function setAsyncValue(functor: AFunctor, value) {
  notifyStateListeners(functor, A.STATE_AWAIT, true)
  return value.then(v => {
    functor.value = [v]
    notifyStateListeners(functor, A.STATE_AWAIT, false)
    notifyStateListeners(functor, A.STATE_READY)
    if (dev.debug) dev.updatingFinished(functor.uid, v)
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
  const functor = function() {
    if (arguments.length) {
      if (typeof arguments[0] == 'function') {
        functor.getterFn = arguments[0]
      } else {
        return setFunctorValue(functor, ...arguments)
      }
    } else {
      if (functor.getterFn) return useGetter(functor)
      if (functor.strongFn) {
        return functor.strongFn()
      }
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
  flowName: string
  haveFrom: boolean
  strongFn: Function

  (...a: any[]): void
}
