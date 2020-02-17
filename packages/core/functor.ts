import { FState, notifyStateListeners } from './state'


type AnyFunction = {
  (...v: any[]): any
}

export type Functor = {
  children: Set<AnyFunction>
  grandChildren: Map<AnyFunction, AnyFunction>
  stateListeners: Map<string, Set<AnyFunction>>
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
  isAsync: boolean
  inAwaiting: boolean
  strongFn: Function
  (...a: any[]): void
}


export function setFunctorValue(functor: Functor, ...a) {
  if (!functor.children) {
    console.error('Attempt to pass in the ended newFlow ', functor.id ? functor.id : '')
    console.warn("it's possible memory leak in application")
    return functor.proxy
  }

  let [value, context] = a
  // if (dev.debug) dev.updatingStarted(functor, context)
  const setValue = finalValue => {
    if (functor.wrapperFn) {
      let wrappedValue = functor.wrapperFn(finalValue, functor.value[0])
      if (wrappedValue.then) return setAsyncValue(functor, wrappedValue)
      functor.value = [wrappedValue]
    } else {
      functor.value = [finalValue]
    }
    // if (dev.debug) dev.updatingFinished(functor.uid, finalValue)
    notifyChildrens(functor)
    return functor.value[0]
  }

  if (value && value.then) {
    return setAsyncValue(functor, value)
  } else {
    return setValue(value)
  }
}

async function setAsyncValue(functor: Functor, promise: PromiseLike<any>) {
  notifyStateListeners(functor, FState.AWAIT, true)
  functor.inAwaiting = true
  functor.isAsync = true
  let v = await promise
  functor.value = [v]
  functor.inAwaiting = false
  notifyStateListeners(functor, FState.AWAIT, false)
  // if (dev.debug) dev.updatingFinished(functor.uid, v)
  notifyChildrens(functor)
  return v
}


const notify = (functor: Functor, whose) =>
  whose && whose.size > 0 && whose.forEach(f => f.apply(functor.proxy, functor.value))

export function notifyChildrens(functor: Functor) {
  // console.log('→', functor.flowName, functor.value)
  notify(functor, functor.children)
  notify(functor, functor.grandChildren)
}


export function grandUpFn(functor:Functor, f:AnyFunction, ff:AnyFunction):any {
  if (!functor.grandChildren) functor.grandChildren =  new Map()
  functor.grandChildren.set(f, ff)
  return functor.value[0]

}
export const createFunctor = () => {
  const functor = function() {
    if (arguments.length) {
      if (typeof arguments[0] == 'function') {
        functor.getterFn = arguments[0]
      } else {
        return setFunctorValue(functor, ...arguments)
      }
    } else {
      if (functor.strongFn) {
        return functor.strongFn()
      }
      if (functor.getterFn) return setFunctorValue(functor, functor.getterFn(), 'getter')
      let v = functor.value
      return v && v.length ? v[0] : undefined
    }
  } as Functor
  functor.children = new Set<AnyFunction>()
  // functor.grandChildren = new Map<AnyFunction, AnyFunction>()
  // functor.stateListeners = new Map<string, Set<AnyFunction>>()
  functor.value = []
  // functor.uid = Math.random()
  return functor
}
